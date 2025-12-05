import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Shield,
  Brain,
  FileCheck,
  Palette,
  Zap,
  Target,
  Download,
} from "lucide-react";

// Internal sub-component for Features
const FeatureCard = ({ feature, index, isVisible }) => {
  const Icon = feature.icon;

  return (
    <div
      className={`group relative bg-card rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-border hover:border-primary/30 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-tr-xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Writing",
      description:
        "Our AI analyzes your experience and generates compelling bullet points that highlight your achievements.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileCheck,
      title: "ATS Optimization",
      description:
        "Beat applicant tracking systems with keyword optimization and proper formatting every time.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Palette,
      title: "Beautiful Templates",
      description:
        "Choose from 50+ professionally designed templates that make your resume stand out.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description:
        "Create a polished resume in under 5 minutes with our streamlined builder interface.",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: Target,
      title: "Job Matching",
      description:
        "Tailor your resume to specific job descriptions with our intelligent matching algorithm.",
      gradient: "from-red-500 to-rose-500",
    },
    {
      icon: Download,
      title: "Multiple Formats",
      description:
        "Export your resume as PDF, Word, or plain text - whatever the employer requires.",
      gradient: "from-indigo-500 to-violet-500",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-background to-accent/30"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Features
            </span>
          </div>

          <h2
            className={`text-3xl md:text-5xl font-bold text-foreground mb-4 transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>

          <p
            className={`text-lg text-muted-foreground transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Powerful features designed to help you create the perfect resume and
            land your dream job faster than ever.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">100% Free</span>{" "}
              to start • No credit card required
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
