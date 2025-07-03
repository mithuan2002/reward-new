import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, BarChart3, Users, FileText, UserPlus, Mail, Menu, X } from "lucide-react";
import { useState } from "react";

type NavigationProps = {
  activeTab: "dashboard" | "campaigns" | "submissions" | "customers";
  onTabChange: (tab: "dashboard" | "campaigns" | "submissions" | "customers") => void;
};

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "campaigns", label: "Campaigns", icon: Gift },
    { id: "submissions", label: "Submissions", icon: FileText },
    { id: "customers", label: "Customers", icon: Users },
  ];

  const handleTabClick = (tab: typeof activeTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
            <Gift className="text-white" size={16} />
          </div>
          <span className="text-xl font-bold text-slate-900">Nambi</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sliding Menu */}
      <div className={`sm:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
              <Gift className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-slate-900">Nambi</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-12 text-left touch-active ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => handleTabClick(item.id as typeof activeTab)}
              >
                <Icon size={18} className="mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full touch-active"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:block bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
                <Gift className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold text-slate-900">Nambi</span>
            </div>

            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`flex items-center space-x-2 h-10 ${
                      activeTab === item.id
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={() => onTabChange(item.id as typeof activeTab)}
                  >
                    <Icon size={16} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Button>
                );
              })}
            </nav>

            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}