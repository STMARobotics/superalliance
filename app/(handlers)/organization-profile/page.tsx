import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationProfilePage() {
  return <OrganizationProfile routing="virtual" path="/organization-profile" />;
}
