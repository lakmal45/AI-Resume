import React from "react";
import {
  FileText,
  Sparkles,
  Twitter,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Templates", href: "#templates" },
      { name: "Pricing", href: "#pricing" },
      { name: "Examples", href: "#" },
    ],
    Resources: [
      { name: "Blog", href: "#" },
      { name: "Resume Tips", href: "#" },
      { name: "Career Guide", href: "#" },
      { name: "Help Center", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Contact", href: "#" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "GDPR", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <FileText className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1" />
              </div>
              <span className="font-bold text-xl text-foreground">
                ResumeAI
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Build professional, ATS-optimized resumes with AI-powered
              suggestions. Land your dream job faster.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with ❤️ for job seekers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
