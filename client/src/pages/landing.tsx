
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Camera, Users, BarChart3, QrCode, Mail, ArrowRight, CheckCircle, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile-First Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 brand-gradient rounded-lg flex items-center justify-center">
                <Gift className="text-white" size={16} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-slate-900">Nambi</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-3 sm:space-x-4">
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

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="sm:hidden border-t border-slate-200 py-4 space-y-2 bg-white/95 backdrop-blur-sm">
              <Link href="/auth">
                <Button variant="outline" className="w-full justify-center">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full justify-center">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 sm:mb-8 leading-tight">
              Nambi
            </h1>
          </div>
          
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight px-4">
              Turn Moments into Memories. And Customers into Fans
            </h2>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 mb-8 sm:mb-12 px-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto flex items-center justify-center space-x-2 h-12 sm:h-auto min-w-[200px] text-base font-semibold">
                <span>Start Free Trial</span>
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-sm text-slate-500 px-4">
            <div className="flex items-center space-x-1">
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Grid */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 px-4">
              Everything You Need to Engage Customers
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              From campaign creation to customer management, Nambi provides all the tools you need to build meaningful customer relationships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Camera className="text-blue-600" size={24} />
                </div>
                <CardTitle className="text-lg">Photo Campaigns</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Create engaging photo submission campaigns with customizable rewards and end dates
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Users className="text-green-600" size={24} />
                </div>
                <CardTitle className="text-lg">Customer Management</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Organize and manage your customer database with bulk import and advanced search
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="text-purple-600" size={24} />
                </div>
                <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Track campaign performance, engagement rates, and customer insights in real-time
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="text-orange-600" size={24} />
                </div>
                <CardTitle className="text-lg">QR Code Integration</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Generate QR codes and promotional flyers to drive campaign participation
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                  <Mail className="text-red-600" size={24} />
                </div>
                <CardTitle className="text-lg">Email Marketing</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Send targeted email campaigns to customer segments with professional templates
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                  <Gift className="text-indigo-600" size={24} />
                </div>
                <CardTitle className="text-lg">Reward Management</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Create and manage different types of rewards to incentivize customer participation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 px-4">
            How Nambi Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-12 px-4">
            Get started with customer engagement in just three simple steps
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
            <div className="text-center p-4 sm:p-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Create Campaign</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Set up your photo campaign with rewards, descriptions, and end dates in minutes
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Share & Promote</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Use QR codes, flyers, and widgets to promote your campaign across channels
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Engage & Reward</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Review submissions, engage with customers, and build lasting relationships
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 px-4 leading-tight">
            Ready to Transform Your Customer Engagement?
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 px-4">
            Join hundreds of businesses already using Nambi to build stronger customer relationships
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 px-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 h-12 sm:h-auto min-w-[200px] text-base font-semibold">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-white border-t border-slate-200 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 brand-gradient rounded-lg flex items-center justify-center">
                <Gift className="text-white" size={16} />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-900">Nambi</span>
            </div>
            
            <div className="text-sm text-slate-600 text-center sm:text-left">
              © 2025 Nambi. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
