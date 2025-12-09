import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/auth.store";

function Dashboard() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        Dashboard
        <div>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
