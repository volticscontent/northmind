import { getStoreSettings } from "@/lib/actions";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await getStoreSettings();
  return <SettingsForm initialSettings={settings} />;
}
