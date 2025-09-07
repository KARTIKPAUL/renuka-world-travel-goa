// src/components/common/Footer.jsx
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  ExternalLink,
  Heart,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div>
                <span className="text-2xl font-bold">Renuka World</span>
                <p className="text-xs text-gray-100 mt-1">
                  Travel Agency & Tour Operator in Goa
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Explore Goa like never before with curated tours, hotels, and
              experiences. Trusted by travelers since 2024.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-all duration-300 group"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition-all duration-300 group"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-blue-400 transition-all duration-300 group"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span>Browse Tours</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span>Travel Packages</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group font-medium"
                >
                  <span>Book Now</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span>About Us</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span>Contact Us</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Popular Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/categories/tours-experiences"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span>🗺️ Tours & Experiences</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/hotels-stays"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span>🏨 Hotels & Stays</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/adventure-activities"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span>🌊 Adventure & Activities</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/food-nightlife"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span>🍹 Food & Nightlife</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/wellness-retreats"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span>🧘 Wellness & Retreats</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Get In Touch
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start group">
                <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-blue-600 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">Address</p>
                  <p className="text-sm">Calangute, Goa, India</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-green-600 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <a
                    href="tel:+919876543210"
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-red-600 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">Email</p>
                  <a
                    href="mailto:info@renukaworld.com"
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    info@renukaworld.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <p>&copy; {currentYear} Renuka World. All rights reserved.</p>
              <span className="hidden md:inline">|</span>
              <div className="flex items-center space-x-4">
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-400 flex items-center">
                Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> in Goa
              </p>
              {/* <button
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-all duration-300 group"
                aria-label="Scroll to top"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              >
                <ArrowUp className="h-4 w-4 text-gray-400 group-hover:text-white" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
