
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-wellnet-green/90 to-wellnet-green py-16 md:py-24 text-white">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <div className="tamil-text">வெல்நெட்</div>
                <div className="text-wellnet-yellow">WellNet</div>
              </h1>
              <p className="text-xl md:text-2xl mb-8 tamil-text">
                உலகம் முழுவதும் நலமான ஆரோக்கியத்திற்கு ஒரு இணைப்பு
              </p>
              <p className="text-xl md:text-2xl mb-8">
                A connection for better health across the world
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-wellnet-green hover:bg-white/90">
                    Get Started
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md aspect-square bg-white/10 rounded-full flex items-center justify-center p-2">
                <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center p-2">
                  <div className="w-full h-full rounded-full bg-white/30 flex items-center justify-center p-4">
                    <div className="w-full h-full rounded-full bg-wellnet-yellow flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-green">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-wellnet-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Empowering Rural Health with AI</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-12 h-12 rounded-full bg-wellnet-green/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-green">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
                  <p className="text-gray-600">
                    Providing healthcare information in Tamil and English to ensure accessibility for all users.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-12 h-12 rounded-full bg-wellnet-yellow/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-yellow">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">AI Health Assistant</h3>
                  <p className="text-gray-600">
                    Getting answers to health questions and receiving guidance through our AI-powered assistant.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-12 h-12 rounded-full bg-wellnet-brown/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-brown">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">Location Services</h3>
                  <p className="text-gray-600">
                    Finding nearby Health Sakhis and labs with easy navigation and directions to healthcare providers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Role Sections */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">For Everyone in the Healthcare Ecosystem</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="pt-6 pb-8 px-6">
                  <div className="w-full h-40 bg-wellnet-green/10 rounded-md flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-green">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Coordinators</h3>
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li>Manage Health Sakhis</li>
                    <li>Monitor coverage areas</li>
                    <li>View analytics and growth</li>
                    <li>Identify underserved zones</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="pt-6 pb-8 px-6">
                  <div className="w-full h-40 bg-wellnet-green/10 rounded-md flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-green">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Health Sakhis</h3>
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li>Manage customer health records</li>
                    <li>Access AI health assistant</li>
                    <li>View nearby customers and labs</li>
                    <li>Summarize health notes</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="pt-6 pb-8 px-6">
                  <div className="w-full h-40 bg-wellnet-green/10 rounded-md flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-green">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Customers</h3>
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li>Access health records</li>
                    <li>Chat with AI in Tamil or English</li>
                    <li>Find nearby labs and health services</li>
                    <li>View educational health videos</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="pt-6 pb-8 px-6">
                  <div className="w-full h-40 bg-wellnet-green/10 rounded-md flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-green">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Labs</h3>
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li>Manage test referrals</li>
                    <li>View customer locations</li>
                    <li>Update available services</li>
                    <li>Track test statuses</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 bg-wellnet-green text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Join WellNet?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connect with our health network and access AI-powered healthcare support in your language today.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-white text-wellnet-green hover:bg-white/90">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default Index;
