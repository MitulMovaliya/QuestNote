import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/auth.store";

function Dashboard() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <div>
      Dashboard
      <div>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
