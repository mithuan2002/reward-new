import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import Navigation from "@/components/navigation";
import FlyerGenerator from "@/components/flyer-generator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  BellRing, 
  Users, 
  TrendingUp, 
  Heart,
  Plus,
  Eye,
  Edit,
  Copy,
  Download,
  Search,
  UserPlus,
  BarChart3,
  Play,
  Trash2,
  Check,
  X,
  ZoomIn,
  Code,
  Share2
} from "lucide-react";
import { format } from "date-fns";


type Campaign = {
  id: number;
  name: string;
  description: string;
  rewardType: string;
  rewardValue: string;
  endDate: string;
  status: string;
  uniqueUrl: string;
  submissionCount?: number;
  createdAt?: string;
};

type Submission = {
  id: number;
  campaignId: number;
  customerName: string;
  phone: string;
  imageUrl: string;
  status: string;
  campaignName: string;
  createdAt?: string;
};

type DashboardStats = {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSubmissions: number;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "campaigns" | "submissions" | "customers">("dashboard");
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<Submission | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { toast } = useToast();

  // Queries
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
  });

  const { data: customers = [] } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  // Mutations
  const createCampaignMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/campaigns", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setShowCampaignForm(false);
      toast({ title: "Campaign created successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error creating campaign", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateCampaignStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest("PATCH", `/api/campaigns/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Campaign status updated!" });
    },
  });

  const updateSubmissionStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest("PATCH", `/api/submissions/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({ title: "Submission status updated!" });
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/customers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setShowCustomerForm(false);
      toast({ title: "Customer added successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error adding customer", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const [selectedCampaignWidget, setSelectedCampaignWidget] = useState<Campaign | null>(null);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [widgetCode, setWidgetCode] = useState("");
  const [selectedCampaignFlyer, setSelectedCampaignFlyer] = useState<Campaign | null>(null);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);

  const generateWidgetMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await apiRequest("GET", `/api/campaigns/${campaignId}/widget`);
      return await response.json();
    },
    onSuccess: (response: any) => {
      setWidgetCode(response.widgetCode || "");
      setIsWidgetModalOpen(true);
      toast({ 
        title: "Widget code generated successfully!", 
        description: "Copy the code and add it to your website"
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error generating widget", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const bulkImportCustomersMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/customers/bulk", data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: response.message });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error importing customers", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleCampaignSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const campaignData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      rewardType: formData.get("rewardType") as string,
      rewardValue: formData.get("rewardValue") as string,
      endDate: formData.get("endDate") as string,
      status: "draft",
    };

    createCampaignMutation.mutate(campaignData);
  };

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const customerData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string || undefined,
    };

    createCustomerMutation.mutate(customerData);
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const customers = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const customer: any = {};

      headers.forEach((header, index) => {
        if (header === 'name') customer.name = values[index];
        if (header === 'phone') customer.phone = values[index];
        if (header === 'email') customer.email = values[index];
      });

      return customer;
    }).filter(customer => customer.name && customer.phone);

    if (customers.length === 0) {
      toast({ 
        title: "No valid customers found", 
        description: "Please check your CSV format",
        variant: "destructive" 
      });
      return;
    }

    bulkImportCustomersMutation.mutate({ customers });
    e.target.value = '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/c/${text}`);
    toast({ title: "Campaign URL copied to clipboard!" });
  };

  const openImageModal = (submission: Submission) => {
    setSelectedImage(submission);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const handleApproveSubmission = (submissionId: number) => {
    updateSubmissionStatusMutation.mutate({ 
      id: submissionId, 
      status: "approved" 
    });
    closeImageModal();
  };

  const handleRejectSubmission = (submissionId: number) => {
    updateSubmissionStatusMutation.mutate({ 
      id: submissionId, 
      status: "rejected" 
    });
    closeImageModal();
  };

  const handleGenerateWidget = (campaign: Campaign) => {
    setSelectedCampaignWidget(campaign);
    generateWidgetMutation.mutate(campaign.id);
  };

  const handleGenerateFlyer = (campaign: Campaign) => {
    setSelectedCampaignFlyer(campaign);
    setIsFlyerModalOpen(true);
  };

  const copyWidgetToClipboard = () => {
    navigator.clipboard.writeText(widgetCode);
    toast({ title: "Widget code copied to clipboard!" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-800";
      case "draft": return "bg-amber-100 text-amber-800";
      case "ended": return "bg-slate-100 text-slate-800";
      case "approved": return "bg-emerald-100 text-emerald-800";
      case "pending": return "bg-amber-100 text-amber-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.phone.includes(searchTerm) ||
                         submission.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCampaign = selectedCampaign === "all" || submission.campaignId.toString() === selectedCampaign;
    return matchesSearch && matchesCampaign;
  });

  return (
    <div className="min-h-screen bg-slate-50 mobile-font-render">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 px-2 sm:px-0">Dashboard Overview</h1>
              <p className="text-slate-600 px-2 sm:px-0 text-sm sm:text-base">Monitor your customer engagement campaigns and submissions</p>
            </div>

            {/* Mobile-optimized stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 px-2 sm:px-0">
              <Card className="touch-active">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 brand-gradient rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">Total Campaigns</p>
                      <p className="text-lg sm:text-2xl font-bold text-slate-900">{stats?.totalCampaigns || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="touch-active">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Play className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">Active</p>
                      <p className="text-lg sm:text-2xl font-bold text-slate-900">{stats?.activeCampaigns || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="touch-active">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600">Submissions</p>
                      <p className="text-lg sm:text-2xl font-bold text-slate-900">{stats?.totalSubmissions || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserPlus className="text-blue-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">New submission received</p>
                        <p className="text-sm text-slate-600">
                          {submission.customerName} submitted to "{submission.campaignName}" campaign
                        </p>
                      </div>
                      <span className="text-sm text-slate-500">
                        {submission.createdAt ? format(new Date(submission.createdAt), "MMM d, h:mm a") : "Just now"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 px-2 sm:px-0">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Campaign Management</h1>
                <p className="text-slate-600 text-sm sm:text-base">Create and manage your loyalty reward campaigns</p>
              </div>
              <Button 
                onClick={() => setShowCampaignForm(!showCampaignForm)}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto touch-active"
                size="lg"
              >
                <Plus size={16} className="mr-2" />
                Create Campaign
              </Button>
            </div>

            {/* Campaign Creation Form */}
            {showCampaignForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create New Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCampaignSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Campaign Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g., Summer Loyalty Rewards"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="rewardType">Reward Type</Label>
                        <Select name="rewardType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reward type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Discount Coupon">Discount Coupon</SelectItem>
                            <SelectItem value="Free Product">Free Product</SelectItem>
                            <SelectItem value="Cashback">Cashback</SelectItem>
                            <SelectItem value="Points">Points</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="rewardValue">Reward Value</Label>
                        <Input
                          id="rewardValue"
                          name="rewardValue"
                          placeholder="e.g., 20% off, $50 cashback"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Campaign End Date</Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <Label htmlFor="description">Campaign Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Describe your loyalty campaign and how customers can participate..."
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowCampaignForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={createCampaignMutation.isPending}
                      >
                        {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Existing Campaigns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{campaign.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">{campaign.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Submissions</span>
                        <span className="font-medium text-slate-900">{campaign.submissionCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Reward</span>
                        <span className="font-medium text-slate-900">{campaign.rewardValue}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Ends</span>
                        <span className="font-medium text-slate-900">
                          {format(new Date(campaign.endDate), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg mb-4">
                      <p className="text-xs text-slate-600 mb-2">Campaign URL:</p>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={`${window.location.origin}/c/${campaign.uniqueUrl}`}
                          readOnly
                          className="text-sm bg-white"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(campaign.uniqueUrl)}
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {campaign.status === "draft" ? (
                        <Button
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                          size="sm"
                          onClick={() => updateCampaignStatusMutation.mutate({ 
                            id: campaign.id, 
                            status: "active" 
                          })}
                        >
                          Activate
                        </Button>
                      ) : (
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          size="sm"
                          onClick={() => setActiveTab("submissions")}
                        >
                          View Submissions
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 space-y-2">
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        size="sm"
                        onClick={() => handleGenerateWidget(campaign)}
                        disabled={generateWidgetMutation.isPending}
                      >
                        <Code size={16} className="mr-2" />
                        {generateWidgetMutation.isPending && generateWidgetMutation.variables === campaign.id 
                          ? "Generating Widget..." 
                          : "Get Website Widget"
                        }
                      </Button>

                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        size="sm"
                        onClick={() => handleGenerateFlyer(campaign)}
                      >
                        <Share2 size={16} className="mr-2" />
                        Create Campaign Flyer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 px-2 sm:px-0">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Customer Submissions</h1>
                <p className="text-slate-600 text-sm sm:text-base">Review and manage all customer submissions across campaigns</p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Campaigns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name, phone, or campaign..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Search size={16} className="mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submissions Table */}
            <Card className="mx-2 sm:mx-0">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                {/* Mobile Card View */}
                <div className="sm:hidden">
                  {filteredSubmissions.map((submission) => (
                    <div key={submission.id} className="border-b border-slate-200 p-4 touch-active">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {submission.customerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{submission.customerName}</div>
                            <div className="text-xs text-slate-500">{submission.phone}</div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={submission.imageUrl}
                            alt="Submission"
                            className="w-8 h-8 rounded object-cover border cursor-pointer"
                            onClick={() => openImageModal(submission)}
                          />
                          <div className="text-xs text-slate-600">{submission.campaignName}</div>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => openImageModal(submission)}>
                            <Eye size={14} />
                          </Button>
                          {submission.status === "pending" && (
                            <>
                              <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleApproveSubmission(submission.id)}>
                                <Check size={14} />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleRejectSubmission(submission.id)}>
                                <X size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Campaign
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Submission
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-white font-medium text-sm">
                                {submission.customerName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">
                                  {submission.customerName}
                                </div>
                                <div className="text-sm text-slate-500">{submission.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{submission.campaignName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <img
                                  src={submission.imageUrl}
                                  alt="Submission"
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/48x48?text=IMG";
                                  }}
                                  onClick={() => openImageModal(submission)}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <ZoomIn className="text-white w-4 h-4" />
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-900">Photo Uploaded</div>
                                <div className="text-sm text-slate-500">
                                  {submission.imageUrl.split('/').pop()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {submission.createdAt ? (
                              <>
                                {format(new Date(submission.createdAt), "MMM d, yyyy")}
                                <br />
                                <span className="text-xs">
                                  {format(new Date(submission.createdAt), "h:mm a")}
                                </span>
                              </>
                            ) : (
                              "Just now"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(submission.status)}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => openImageModal(submission)}
                                title="View full image"
                              >
                                <Eye size={16} />
                              </Button>
                              {submission.status === "pending" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleApproveSubmission(submission.id)}
                                    title="Approve submission"
                                  >
                                    <Check size={16} />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleRejectSubmission(submission.id)}
                                    title="Reject submission"
                                  >
                                    <X size={16} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredSubmissions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No submissions found matching your criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}



        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 px-2 sm:px-0">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Customer Management</h1>
                <p className="text-slate-600 text-sm sm:text-base">Manage your customer contact database</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVImport}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button
                    onClick={() => document.getElementById('csv-upload')?.click()}
                    variant="outline"
                    disabled={bulkImportCustomersMutation.isPending}
                  >
                    <Download size={16} className="mr-2" />
                    {bulkImportCustomersMutation.isPending ? "Importing..." : "Import CSV"}
                  </Button>
                </div>
                <Button 
                  onClick={() => setShowCustomerForm(!showCustomerForm)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus size={16} className="mr-2" />
                  Add Customer
                </Button>
              </div>
            </div>

            {/* Customer Creation Form */}
            {showCustomerForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Add New Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCustomerSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="customer-name">Full Name</Label>
                        <Input
                          id="customer-name"
                          name="name"
                          placeholder="e.g., John Smith"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-phone">Phone Number</Label>
                        <Input
                          id="customer-phone"
                          name="phone"
                          type="tel"
                          placeholder="e.g., +1 (555) 123-4567"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-email">Email (Optional)</Label>
                        <Input
                          id="customer-email"
                          name="email"
                          type="email"
                          placeholder="e.g., john@email.com"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowCustomerForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={createCustomerMutation.isPending}
                      >
                        {createCustomerMutation.isPending ? "Adding..." : "Add Customer"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* SMS and WhatsApp Integration Notice */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">🚀 Coming Soon: SMS & WhatsApp Integration</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      We are building SMS and WhatsApp integration for bulk messaging the campaign flyer. Early supporters will be provided at flat price.
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-slate-700">
                        For more queries contact: <strong>mithuan137@gmail.com</strong>
                      </p>
                    </div>
                    <p className="text-blue-600 text-xs mt-2">
                      <strong>Note:</strong> Phone numbers must be unique. Duplicates will be skipped automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customers List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Customer Database ({customers.length})</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Added Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {customers
                        .filter(customer => 
                          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.phone.includes(searchTerm) ||
                          (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((customer) => (
                        <tr key={customer.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-white font-medium text-sm">
                                {customer.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">
                                  {customer.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{customer.phone}</div>
                            {customer.email && (
                              <div className="text-sm text-slate-500">{customer.email}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {customer.createdAt ? (
                              <>
                                {format(new Date(customer.createdAt), "MMM d, yyyy")}
                                <br />
                                <span className="text-xs">
                                  {format(new Date(customer.createdAt), "h:mm a")}
                                </span>
                              </>
                            ) : (
                              "Just now"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost">
                                <Edit size={16} />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {customers.length === 0 && (
                  <div className="text-center py-8">
                    <UserPlus className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-sm font-medium text-slate-900">No customers yet</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Get started by adding a customer manually or importing a CSV file.
                    </p>
                    <div className="mt-6">
                      <Button
                        onClick={() => setShowCustomerForm(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <UserPlus size={16} className="mr-2" />
                        Add Your First Customer
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Image Viewing Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Submission Review</DialogTitle>
            <DialogDescription>
              Review the customer submission and approve or reject it.
            </DialogDescription>
          </DialogHeader>

          {selectedImage && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 brand-gradient rounded-full flex items-center justify-center text-white font-medium">
                  {selectedImage.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedImage.customerName}</h3>
                  <p className="text-sm text-slate-600">{selectedImage.phone}</p>
                  <p className="text-xs text-slate-500">Campaign: {selectedImage.campaignName}</p>
                </div>
                <div className="ml-auto">
                  <Badge className={getStatusColor(selectedImage.status)}>
                    {selectedImage.status.charAt(0).toUpperCase() + selectedImage.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Full Size Image */}
              <div className="flex justify-center">
                <img
                  src={selectedImage.imageUrl}
                  alt="Customer submission"
                  className="max-w-full max-h-[50vh] object-contain rounded-lg border border-slate-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }}
                />
              </div>

              {/* Action Buttons */}
              {selectedImage.status === "pending" && (
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => handleApproveSubmission(selectedImage.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check size={16} className="mr-2" />
                    Approve Submission
                  </Button>
                  <Button
                    onClick={() => handleRejectSubmission(selectedImage.id)}
                    variant="destructive"
                  >
                    <X size={16} className="mr-2" />
                    Reject Submission
                  </Button>
                </div>
              )}

              {selectedImage.status !== "pending" && (
                <div className="text-center text-slate-600">
                  This submission has already been {selectedImage.status}.
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Widget Code Modal */}
      <Dialog open={isWidgetModalOpen} onOpenChange={setIsWidgetModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Website Widget</DialogTitle>
            <DialogDescription>
              Copy this code and paste it into your website to display the campaign widget
            </DialogDescription>
          </DialogHeader>

          {selectedCampaignWidget && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-700 mb-2">Campaign: {selectedCampaignWidget.name}</h4>
                <p className="text-sm text-slate-600">{selectedCampaignWidget.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="widget-code" className="text-sm font-medium">Widget HTML Code</Label>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyWidgetToClipboard}
                    className="flex items-center gap-2"
                  >
                    <Copy size={14} />
                    Copy Code
                  </Button>
                </div>
                <textarea
                  id="widget-code"
                  value={widgetCode}
                  readOnly
                  className="w-full h-64 p-3 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">📋 How to Use This Widget</h5>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Copy the HTML code above</li>
                  <li>Paste it into your website where you want the campaign to appear</li>
                  <li>The widget will automatically display your campaign details</li>
                  <li>Customers can click "Participate Now" to submit photos</li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-2">✨ Widget Features</h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                  <li>Responsive design that works on all devices</li>
                  <li>Eye-catching gradient background and styling</li>
                  <li>Displays campaign name, description, and reward</li>
                  <li>Shows campaign end date</li>
                  <li>Direct link to photo submission form</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Flyer Generator Modal */}
      <Dialog open={isFlyerModalOpen} onOpenChange={setIsFlyerModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Flyer Generator</DialogTitle>
            <DialogDescription>
              Create promotional flyers for your campaign with QR codes and share them on social media
            </DialogDescription>
          </DialogHeader>

          {selectedCampaignFlyer && (
            <FlyerGenerator campaign={selectedCampaignFlyer} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}