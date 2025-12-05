import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Upload, Wand2, FileDown } from "lucide-react";

const HowItWorksSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Import Your Data",
      description:
        "Upload your existing resume or LinkedIn profile, or start from scratch with our guided form.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "02",
      icon: Wand2,
      title: "AI Enhancement",
      description:
        "Our AI analyzes your experience and suggests powerful improvements to make you stand out.",
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "03",
      icon: FileDown,
      title: "Download & Apply",
      description:
        "Export your polished resume in any format and start applying to your dream jobs today.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Simple Process
            </span>
          </div>

          <h2
            className={`text-3xl md:text-5xl font-bold text-foreground mb-4 transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            How It <span className="text-primary">Works</span>
          </h2>

          <p
            className={`text-lg text-muted-foreground transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Create your professional resume in three simple steps. It's fast,
            easy, and completely free to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;

            return (
              <div
                key={step.number}
                className={`relative transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0" />
                )}

                <div
                  className={`relative bg-card rounded-2xl p-8 border transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "border-primary shadow-xl scale-105"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {/* Step number badge */}
                  <div
                    className={`absolute -top-4 left-8 px-4 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Step {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${
                      step.color
                    } mb-6 transition-transform duration-300 ${
                      isActive ? "scale-110" : ""
                    }`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
