import { Alert, Linking } from "react-native";
import { contact } from "./content";

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
