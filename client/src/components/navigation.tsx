import { Button } from "@/components/ui/button";
import { Gift, BarChart3, Users, FileText, UserPlus, Mail, LogOut } from "lucide-react";

type NavigationProps = {
  activeTab: string;
  onTabChange: (tab: "dashboard" | "campaigns" | "submissions" | "customers" | "bulk-email") => void;
};

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
                <Gift className="text-white" size={16} />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">Nambi</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("dashboard")}
              className="flex items-center space-x-2"
            >
              <BarChart3 size={16} />
              <span>Dashboard</span>
            </Button>

            <Button
              variant={activeTab === "campaigns" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("campaigns")}
              className="flex items-center space-x-2"
            >
              <Gift size={16} />
              <span>Campaigns</span>
            </Button>

            <Button
              variant={activeTab === "submissions" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("submissions")}
              className="flex items-center space-x-2"
            >
              <FileText size={16} />
              <span>Submissions</span>
            </Button>

            <Button
              variant={activeTab === "customers" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("customers")}
              className="flex items-center space-x-2"
            >
              <Users size={16} />
              <span>Customers</span>
            </Button>



            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
              {userData && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-700">
                      {userData.username[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-700">{userData.username}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}