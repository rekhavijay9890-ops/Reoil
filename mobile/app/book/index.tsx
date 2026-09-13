import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Location from "expo-location";
import { PrimaryButton } from "../../components/PrimaryButton";
import { StepIndicator } from "../../components/StepIndicator";
import { colors, fonts, radius, shadow } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { mobileBooking } from "../../lib/content";
import {
  fetchAddresses,
  submitBulkPickups,
  submitPickup,
  type AddressRecord,
  type PickupPayload,
} from "../../lib/api";

const { sourceTypes, quantityOptions, timeSlots } = mobileBooking;

function nextDates(count = 7) {
  const dates: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      label: d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      value: d.toISOString().slice(0, 10),
    });
  }
  return dates;
}

function mapQuantityForApi(value: string) {
  const match = quantityOptions.find((q) => q.value === value);
  return match?.apiValue ?? "5-10";
}

export default function BookPickupScreen() {
  const { bulk } = useLocalSearchParams<{ bulk?: string }>();
  const isBulk = bulk === "1";
  const { user, token } = useAuth();

  const [step, setStep] = useState(1);
  const [type, setType] = useState("home");
  const [quantity, setQuantity] = useState("10");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [bulkCount, setBulkCount] = useState("3");
  const [savedAddresses, setSavedAddresses] = useState<AddressRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const dates = nextDates();

  useEffect(() => {
    if (!token) return;
    fetchAddresses(token)
      .then((list) => {
        setSavedAddresses(list);
        const home = list.find((a) => a.label.toLowerCase() === "home") ?? list[0];
        if (home && !address) {
          setAddress(home.address);
          setLat(home.lat);
          setLng(home.lng);
        }
      })
      .catch(() => {});
  }, [token, address]);

  const useGps = useCallback(async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Allow location to pin your pickup spot.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
      Alert.alert("Location pinned", "GPS coordinates saved for this pickup.");
    } catch {
      Alert.alert("Location error", "Could not get GPS. Enter address manually.");
    } finally {
      setLocating(false);
    }
  }, []);

  function buildPayload(dateLabel: string): PickupPayload {
    return {
      name,
      email,
      phone,
      address,
      type,
      quantity: mapQuantityForApi(quantity),
      preferredDate: dateLabel,
      preferredTime: timeSlot,
      notes: instructions.trim() || undefined,
      lat,
      lng,
    };
  }

  async function handleConfirm() {
    if (!address || !name || !phone || !email || !date || !timeSlot) {
      Alert.alert("Missing details", "Please complete all fields before confirming.");
      return;
    }

    if (isBulk && !token) {
      Alert.alert("Login required", "Sign in to use bulk booking.");
      return;
    }

    setLoading(true);
    try {
      const dateLabel = dates.find((d) => d.value === date)?.label ?? date;
      const typeLabel = sourceTypes.find((s) => s.value === type)?.label ?? type;
      const qtyLabel = quantityOptions.find((q) => q.value === quantity)?.label ?? quantity;
      const payload = buildPayload(dateLabel);

      if (isBulk && token) {
        const count = Math.min(10, Math.max(1, parseInt(bulkCount, 10) || 1));
        const pickups = Array.from({ length: count }, () => payload);
        const result = await submitBulkPickups(pickups, token);
        router.replace({
          pathname: "/book/success",
          params: {
            bulk: "1",
            count: String(result.pickups?.length ?? count),
            type: typeLabel,
            quantity: qtyLabel,
            address,
            date: dateLabel,
            time: timeSlot,
          },
        });
        return;
      }

      const result = await submitPickup(payload, token ?? undefined);
      router.replace({
        pathname: "/book/success",
        params: {
          id: result.pickup?.id ?? "",
          type: typeLabel,
          quantity: qtyLabel,
          address,
          date: dateLabel,
          time: timeSlot,
        },
      });
    } catch (error) {
      Alert.alert(
        "Booking failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (step === 1 && !type) return;
    if (step === 2 && !quantity) return;
    if (step === 3 && (!address || !name || !phone || !email)) {
      Alert.alert("Contact & address", "Please fill name, phone, email, and address.");
      return;
    }
    if (step === 4) {
      handleConfirm();
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <StepIndicator step={step} />
        {isBulk ? (
          <Text style={styles.bulkBanner}>Bulk mode — schedule multiple pickups at once</Text>
        ) : null}

        {step === 1 && (
          <>
            <Text style={styles.title}>Select source type</Text>
            <Text style={styles.subtitle}>Where is the used oil coming from?</Text>
            {sourceTypes.map((item) => (
              <Pressable
                key={item.value}
                style={[styles.typeCard, type === item.value && styles.typeCardActive]}
                onPress={() => setType(item.value)}
              >
                <Text style={styles.typeIcon}>{item.icon}</Text>
                <View style={styles.typeText}>
                  <Text style={styles.typeLabel}>{item.label}</Text>
                  <Text style={styles.typeDesc}>{item.description}</Text>
                </View>
              </Pressable>
            ))}
            {isBulk ? (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Number of pickups (1–10)</Text>
                <TextInput
                  style={styles.input}
                  value={bulkCount}
                  onChangeText={setBulkCount}
                  keyboardType="number-pad"
                />
              </View>
            ) : null}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>How much oil?</Text>
            <Text style={styles.subtitle}>Select an estimated quantity</Text>
            <View style={styles.qtyVisual}>
              <Text style={styles.oilJug}>🛢️</Text>
              <Text style={styles.qtySelected}>
                {quantityOptions.find((q) => q.value === quantity)?.label ?? quantity}
              </Text>
            </View>
            <View style={styles.chipRow}>
              {quantityOptions.map((item) => (
                <Pressable
                  key={item.value}
                  style={[styles.chip, quantity === item.value && styles.chipActive]}
                  onPress={() => setQuantity(item.value)}
                >
                  <Text style={[styles.chipText, quantity === item.value && styles.chipTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Pickup location</Text>
            <Text style={styles.subtitle}>Where should we collect the oil?</Text>

            {savedAddresses.length > 0 ? (
              <View style={styles.savedBlock}>
                <Text style={styles.fieldLabel}>Saved addresses</Text>
                {savedAddresses.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.savedChip}
                    onPress={() => {
                      setAddress(item.address);
                      setLat(item.lat);
                      setLng(item.lng);
                    }}
                  >
                    <Text style={styles.savedChipText}>
                      {item.label}: {item.address.slice(0, 48)}
                      {item.address.length > 48 ? "…" : ""}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <View style={styles.mapPlaceholder}>
              {lat != null && lng != null ? (
                <>
                  <Text style={styles.mapEmoji}>📍</Text>
                  <Text style={styles.mapText}>
                    GPS pinned: {lat.toFixed(5)}, {lng.toFixed(5)}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.mapEmoji}>🗺️</Text>
                  <Text style={styles.mapText}>Tap below to pin your location</Text>
                </>
              )}
            </View>

            <Pressable style={styles.gpsBtn} onPress={useGps} disabled={locating}>
              {locating ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text style={styles.gpsBtnText}>Use current location (GPS)</Text>
              )}
            </Pressable>

            <Field label="Full name" value={name} onChangeText={setName} />
            <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Field label="Pickup address" value={address} onChangeText={setAddress} multiline />
            <Field
              label="Special instructions (optional)"
              value={instructions}
              onChangeText={setInstructions}
              multiline
            />
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>Choose date & time</Text>
            <Text style={styles.subtitle}>We&apos;ll confirm your slot within 24 hours</Text>
            <Text style={styles.fieldLabel}>Preferred date</Text>
            <View style={styles.chipRow}>
              {dates.map((d) => (
                <Pressable
                  key={d.value}
                  style={[styles.dateChip, date === d.value && styles.chipActive]}
                  onPress={() => setDate(d.value)}
                >
                  <Text style={[styles.chipText, date === d.value && styles.chipTextActive]}>
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Time slot</Text>
            <View style={styles.slotGrid}>
              {timeSlots.map((slot) => (
                <Pressable
                  key={slot}
                  style={[styles.slotChip, timeSlot === slot && styles.chipActive]}
                  onPress={() => setTimeSlot(slot)}
                >
                  <Text style={[styles.slotText, timeSlot === slot && styles.chipTextActive]}>
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <View style={styles.actions}>
          {step > 1 ? (
            <View style={styles.backWrap}>
              <PrimaryButton
                label="Back"
                variant="outline"
                onPress={() => setStep((s) => s - 1)}
              />
            </View>
          ) : null}
          <View style={step > 1 ? styles.nextWrap : styles.nextFull}>
            <PrimaryButton
              label={step === 4 ? (isBulk ? "Schedule all" : "Confirm pickup") : "Continue"}
              onPress={handleNext}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholderTextColor={colors.muted}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  bulkBanner: {
    fontFamily: fonts.bodySemi,
    color: colors.primary,
    marginBottom: 12,
    fontSize: 13,
  },
  title: { fontSize: 22, fontFamily: fonts.heading, color: colors.dark },
  subtitle: {
    fontFamily: fonts.body,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 22,
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadow.soft,
  },
  typeCardActive: { borderColor: colors.primary, backgroundColor: colors.mint },
  typeIcon: { fontSize: 32, marginRight: 14 },
  typeText: { flex: 1 },
  typeLabel: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.dark },
  typeDesc: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  qtyVisual: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  oilJug: { fontSize: 56 },
  qtySelected: {
    marginTop: 8,
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.primary,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.muted },
  chipTextActive: { color: colors.white },
  dateChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  savedBlock: { marginBottom: 8 },
  savedChip: {
    backgroundColor: colors.mint,
    padding: 10,
    borderRadius: radius.md,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.light,
  },
  savedChipText: { fontFamily: fonts.body, color: colors.dark, fontSize: 13 },
  mapPlaceholder: {
    height: 120,
    backgroundColor: colors.mint,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapEmoji: { fontSize: 36 },
  mapText: { fontFamily: fonts.body, color: colors.muted, marginTop: 6, textAlign: "center", paddingHorizontal: 12 },
  gpsBtn: {
    marginBottom: 16,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
  },
  gpsBtnText: { fontFamily: fonts.bodySemi, color: colors.primary },
  field: { marginBottom: 14 },
  fieldLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.dark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
  },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  slotGrid: { gap: 8, marginBottom: 16 },
  slotChip: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.dark },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
  backWrap: { flex: 1 },
  nextWrap: { flex: 2 },
  nextFull: { flex: 1 },
});
