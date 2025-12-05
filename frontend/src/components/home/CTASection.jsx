import React, { useState, useEffect, useRef } from "react";
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    "No credit card required",
    "Unlimited resume exports",
    "AI-powered suggestions",
    "ATS-optimized templates",
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-secondary via-secondary/90 to-secondary relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        {/* Animated particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-foreground/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              Limited Time: Premium features free for 14 days
            </span>
          </div>

          {/* Heading */}
          <h2
            className={`text-3xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-6 transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Ready to Land Your{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dream Job?
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className={`text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Join thousands of professionals who've transformed their job search
            with ResumeAI. Start building your perfect resume today.
          </p>

          {/* Benefits */}
          <div
            className={`flex flex-wrap justify-center gap-4 mb-10 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-sm text-secondary-foreground/80"
              >
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div
            className={`transition-all duration-700 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Button
              size="xl"
              className="bg-primary text-white hover:bg-primary/90 shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 group"
            >
              Start Building Your Resume
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="mt-4 text-sm text-secondary-foreground/60">
              No credit card required • 5-minute setup
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
