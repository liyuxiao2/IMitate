import SocialScreen from "@/components/ui/social-screen";
import Sidebar from "@/components/ui/sidebar";

export default function Page() {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar activePage="Social" />
      <SocialScreen />
    </div>
  );
}
