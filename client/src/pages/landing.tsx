import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Camera, Users, BarChart3, QrCode, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
                <Gift className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold text-slate-900">Nambi</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-slate-900 mb-8">
              Nambi
            </h1>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Turn Moments into Memories. And Customers into Fans
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              <CheckCircle size={16} className="text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle size={16} className="text-green-500" />
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle size={16} className="text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything You Need to Engage Customers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From campaign creation to customer management, Nambi provides all the tools you need to build meaningful customer relationships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="text-blue-600" size={24} />
                </div>
                <CardTitle>Photo Campaigns</CardTitle>
                <CardDescription>
                  Create engaging photo submission campaigns with customizable rewards and end dates
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-green-600" size={24} />
                </div>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>
                  Organize and manage your customer database with bulk import and advanced search
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-purple-600" size={24} />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track campaign performance, engagement rates, and customer insights in real-time
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="text-orange-600" size={24} />
                </div>
                <CardTitle>QR Code Integration</CardTitle>
                <CardDescription>
                  Generate QR codes and promotional flyers to drive campaign participation
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="text-red-600" size={24} />
                </div>
                <CardTitle>Email Marketing</CardTitle>
                <CardDescription>
                  Send targeted email campaigns to customer segments with professional templates
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Gift className="text-indigo-600" size={24} />
                </div>
                <CardTitle>Reward Management</CardTitle>
                <CardDescription>
                  Create and manage different types of rewards to incentivize customer participation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            How Nambi Works
          </h2>
          <p className="text-lg text-slate-600 mb-12">
            Get started with customer engagement in just three simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Create Campaign</h3>
              <p className="text-slate-600">
                Set up your photo campaign with rewards, descriptions, and end dates in minutes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Share & Promote</h3>
              <p className="text-slate-600">
                Use QR codes, flyers, and widgets to promote your campaign across channels
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Engage & Reward</h3>
              <p className="text-slate-600">
                Review submissions, engage with customers, and build lasting relationships
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Customer Engagement?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join hundreds of businesses already using Nambi to build stronger customer relationships
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
                <Gift className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-slate-900">Nambi</span>
            </div>
            
            <div className="text-sm text-slate-600">
              © 2025 Nambi. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}