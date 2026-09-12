import { Alert, Linking } from "react-native";
import { contact, payment } from "./content";

export async function openWhatsApp() {
  const url = `whatsapp://send?phone=${contact.whatsapp}&text=${encodeURIComponent(contact.whatsappMessage)}`;
  const webUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`;

  const canOpen = await Linking.canOpenURL(url);
  await Linking.openURL(canOpen ? url : webUrl);
}

export async function openPhoneCall() {
  const url = `tel:${contact.phone}`;
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    Alert.alert("Cannot call", `Dial ${contact.displayPhone} from your phone.`);
    return;
  }

  await Linking.openURL(url);
}

export function buildUpiUrl(amount: number, note: string) {
  const params = new URLSearchParams({
    pa: payment.upiId,
    pn: payment.upiName,
    am: amount.toFixed(2),
    cu: payment.currency,
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

export async function openUpiPayment(amount: number, note: string) {
  const url = buildUpiUrl(amount, note);
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    Alert.alert(
      "UPI app not found",
      `Pay ${payment.symbol}${amount.toFixed(0)} to ${payment.upiId} using any UPI app.`,
    );
    return;
  }

  await Linking.openURL(url);
}
