
import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter: React.FC = () => {
  return (
    <footer className="bg-wellnet-charcoal text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-wellnet-yellow flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-green">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <span className="tamil-text">வெல்நெட்</span>
              <span className="ml-1">WellNet</span>
            </h3>
            <p className="text-sm text-gray-300">
              உலகம் முழுவதும் நலமான ஆரோக்கியத்திற்கு ஒரு இணைப்பு
              <br />
              A connection for better health across the world
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-3">Resources</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="#" className="hover:text-wellnet-yellow">Health Articles</Link></li>
              <li><Link to="#" className="hover:text-wellnet-yellow">Educational Videos</Link></li>
              <li><Link to="#" className="hover:text-wellnet-yellow">Health Tools</Link></li>
              <li><Link to="#" className="hover:text-wellnet-yellow">Find a Health Sakhi</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-3">Contact</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Dharmapuri, Tamil Nadu</li>
              <li>India</li>
              <li>support@wellnet.org</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-wellnet-yellow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-wellnet-yellow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-wellnet-yellow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-wellnet-yellow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} வெல்நெட் (WellNet). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
