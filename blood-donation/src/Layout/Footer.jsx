import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';


const Footer = () => {
    return (
       <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold">BloodConnect</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting blood donors with those in need. Together, we save lives and build a healthier community through the gift of blood donation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/donation-requests" className="text-gray-300 hover:text-red-600 transition-colors">
                  Donation Requests
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-red-600 transition-colors">
                  Find Donors
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-red-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/funding" className="text-gray-300 hover:text-red-600 transition-colors">
                  Support Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-600" />
                <span className="text-gray-300">+880 1234-567890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-600" />
                <span className="text-gray-300">info@bloodconnect.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <span className="text-gray-300">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 BloodConnect. All rights reserved. Made with ❤️ for humanity.
          </p>
        </div>
      </div>
    </footer>
    );
};

export default Footer;