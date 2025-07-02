
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "../hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Mail, Send, Users, CheckCircle, XCircle } from "lucide-react";

type Campaign = {
  id: number;
  name: string;
  description: string;
  status: string;
};

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export function BulkMailer() {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [customSubject, setCustomSubject] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [customRecipients, setCustomRecipients] = useState("");
  const { toast } = useToast();

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/email/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.connected) {
        toast({ title: "Email connection successful!" });
      } else {
        toast({ 
          title: "Email connection failed", 
          description: "Please check your SMTP settings",
          variant: "destructive" 
        });
      }
    },
  });

  const sendCampaignEmailMutation = useMutation({
    mutationFn: async (data: { campaignId: string; subject: string; recipients: string[] }) => {
      const response = await fetch("/api/email/send-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Campaign emails sent!", 
        description: `Sent to ${data.sent} recipients. ${data.failed} failed.` 
      });
      setSelectedCustomers([]);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to send emails", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const sendCustomEmailMutation = useMutation({
    mutationFn: async (data: { subject: string; htmlContent: string; recipients: string[] }) => {
      const response = await fetch("/api/email/send-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Custom emails sent!", 
        description: `Sent to ${data.sent} recipients. ${data.failed} failed.` 
      });
      setCustomSubject("");
      setCustomContent("");
      setCustomRecipients("");
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to send emails", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleCustomerSelect = (customerId: number, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.filter(c => c.email).map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSendCampaignEmail = () => {
    if (!selectedCampaign || selectedCustomers.length === 0) {
      toast({ 
        title: "Missing information", 
        description: "Please select a campaign and recipients",
        variant: "destructive" 
      });
      return;
    }

    const recipients = customers
      .filter(c => selectedCustomers.includes(c.id) && c.email)
      .map(c => c.email);

    if (recipients.length === 0) {
      toast({ 
        title: "No email addresses", 
        description: "Selected customers don't have email addresses",
        variant: "destructive" 
      });
      return;
    }

    const campaign = campaigns.find(c => c.id.toString() === selectedCampaign);
    const subject = `Join Our Campaign: ${campaign?.name}`;

    sendCampaignEmailMutation.mutate({
      campaignId: selectedCampaign,
      subject,
      recipients,
    });
  };

  const handleSendCustomEmail = () => {
    if (!customSubject || !customContent || !customRecipients) {
      toast({ 
        title: "Missing information", 
        description: "Please fill in all fields",
        variant: "destructive" 
      });
      return;
    }

    const recipients = customRecipients
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.includes("@"));

    if (recipients.length === 0) {
      toast({ 
        title: "No valid email addresses", 
        description: "Please enter valid email addresses",
        variant: "destructive" 
      });
      return;
    }

    sendCustomEmailMutation.mutate({
      subject: customSubject,
      htmlContent: customContent,
      recipients,
    });
  };

  const emailCustomers = customers.filter(c => c.email);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bulk Email</h2>
          <p className="text-muted-foreground">Send campaign emails to your customers</p>
        </div>
        <Button
          variant="outline"
          onClick={() => testConnectionMutation.mutate()}
          disabled={testConnectionMutation.isPending}
        >
          <Mail className="mr-2 h-4 w-4" />
          Test Email Connection
        </Button>
      </div>

      <Tabs defaultValue="campaign" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaign">Campaign Email</TabsTrigger>
          <TabsTrigger value="custom">Custom Email</TabsTrigger>
        </TabsList>

        <TabsContent value="campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Campaign Email</CardTitle>
              <CardDescription>
                Send a pre-designed email to promote your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="campaign-select">Select Campaign</Label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>
                        {campaign.name} ({campaign.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Recipients ({selectedCustomers.length} selected)</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="select-all"
                      checked={selectedCustomers.length === emailCustomers.length && emailCustomers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all" className="text-sm">Select all</Label>
                  </div>
                </div>
                
                <Card className="max-h-60 overflow-y-auto">
                  <CardContent className="p-4 space-y-2">
                    {emailCustomers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No customers with email addresses found
                      </p>
                    ) : (
                      emailCustomers.map((customer) => (
                        <div key={customer.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`customer-${customer.id}`}
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={(checked) => handleCustomerSelect(customer.id, !!checked)}
                          />
                          <Label htmlFor={`customer-${customer.id}`} className="flex-1">
                            {customer.name} - {customer.email}
                          </Label>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={handleSendCampaignEmail}
                disabled={sendCampaignEmailMutation.isPending || !selectedCampaign || selectedCustomers.length === 0}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {sendCampaignEmailMutation.isPending ? "Sending..." : "Send Campaign Email"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Custom Email</CardTitle>
              <CardDescription>
                Send a custom HTML email to specific recipients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-subject">Subject</Label>
                <Input
                  id="custom-subject"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>

              <div>
                <Label htmlFor="custom-content">HTML Content</Label>
                <Textarea
                  id="custom-content"
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="<h1>Your HTML content here...</h1>"
                  rows={8}
                />
              </div>

              <div>
                <Label htmlFor="custom-recipients">Recipients</Label>
                <Textarea
                  id="custom-recipients"
                  value={customRecipients}
                  onChange={(e) => setCustomRecipients(e.target.value)}
                  placeholder="email1@example.com, email2@example.com&#10;Or one email per line"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter email addresses separated by commas or one per line
                </p>
              </div>

              <Button 
                onClick={handleSendCustomEmail}
                disabled={sendCustomEmailMutation.isPending || !customSubject || !customContent || !customRecipients}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {sendCustomEmailMutation.isPending ? "Sending..." : "Send Custom Email"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{emailCustomers.length} customers with email</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>SMTP configured for bulk sending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
