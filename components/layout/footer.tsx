
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Users,
  Camera,
  Briefcase,
  AtSign,
  ArrowRight,
  Heart,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Departments", href: "/departments" },
  { label: "Track Complaint", href: "/tracking" },
];

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Announcements", href: "/announcements" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid gap-12 border-b border-slate-800 pb-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                C
              </span>
              CityCare
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              Making cities smarter and communities better.
              Report problems, track complaints and connect
              with local authorities through CityCare.
            </p>

            <div className="mt-6 flex gap-3">
              {[
                { icon: Users, href: "https://facebook.com" },
                { icon: Camera, href: "https://instagram.com" },
                { icon: Briefcase, href: "https://linkedin.com" },
                { icon: AtSign, href: "https://x.com" },
              ].map((social, index) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Social media ${index + 1}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 transition hover:bg-blue-600 hover:text-white"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:pl-2 hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Support
            </h3>

            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:pl-2 hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Contact Information
            </h3>

            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-blue-400" size={19} />
                <span>Dhaka, Bangladesh</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-blue-400" size={19} />
                <a
                  href="mailto:support@citycare.example"
                  className="hover:text-blue-400"
                >
                  support@citycare.example
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-blue-400" size={19} />
                <a
                  href="tel:+8801000000000"
                  className="hover:text-blue-400"
                >
                  +880 1000-000000
                </a>
              </li>
            </ul>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-400 hover:text-blue-300"
            >
              Contact Support
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-sm md:flex-row">
          <p className="text-slate-500">
            © 2026 CityCare. All rights reserved.
          </p>

          <p className="flex items-center gap-1 text-slate-500">
            Made with
            <Heart size={15} className="fill-red-500 text-red-500" />
            for a better city.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className="hover:text-blue-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="hover:text-blue-400"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
