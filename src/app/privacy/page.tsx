"use client";

import type React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Database, Lock, Users, Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

function SectionCard({ 
  icon: Icon, 
  number, 
  title, 
  children 
}: { 
  icon: React.ElementType; 
  number: string; 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <section className="group relative rounded-xl border border-border/60 bg-card/30 p-6 transition-all duration-300 hover:border-transparent hover:shadow-lg rainbow-hover-glow border-rainbow [&::before]:opacity-0 [&::before]:transition-opacity [&::before]:duration-300 hover:[&::before]:opacity-100">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--gradient-start)]/10 via-[var(--gradient-mid-3)]/10 to-[var(--gradient-end)]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-rainbow-animated">{number}.</span>
            <span>{title}</span>
          </h2>
          <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="px-4 h-14 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to App</span>
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold">Privacy Policy</h1>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-start)]/5 via-transparent to-[var(--gradient-end)]/5" />
        <div className="max-w-3xl mx-auto px-4 py-12 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl border-rainbow-animated flex items-center justify-center bg-background">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-rainbow-animated">Privacy</span> Policy
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-xl">
            We believe in transparency. Here&apos;s exactly how we handle your data—spoiler: we keep it minimal and respect your privacy.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-6">
          <SectionCard icon={Shield} number="1" title="Introduction">
            <p>
              Signature Forge (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a free email signature builder operated by Open Insurance. 
              We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and 
              safeguard your information when you use our service.
            </p>
          </SectionCard>

          <SectionCard icon={Database} number="2" title="Information We Collect">
            <div className="space-y-4">
              <div>
                <h3 className="text-foreground font-medium mb-2">2.1 Information You Provide</h3>
                <p className="mb-2">When using Signature Forge, you may voluntarily enter:</p>
                <ul className="list-none space-y-1.5 ml-1">
                  {["Name and job title", "Company/organization name", "Contact information (email, phone number)", "Social media profile URLs", "Profile images (via URL)"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid-3)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">2.2 Automatically Collected Information</h3>
                <p>
                  We may automatically collect basic usage analytics, including page views and feature usage, 
                  to improve our service. We do not use tracking cookies for advertising purposes.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Lock} number="3" title="How We Use Your Information">
            <p className="mb-2">The information you enter is used solely to:</p>
            <ul className="list-none space-y-1.5 ml-1 mb-4">
              {["Generate your email signature in real-time", "Provide AI-assisted suggestions (when you use the AI feature)"].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-mid-2)] to-[var(--gradient-mid-4)]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="p-3 rounded-lg bg-gradient-to-r from-[var(--gradient-start)]/5 to-[var(--gradient-end)]/5 border border-[var(--gradient-mid-3)]/20">
              <p className="text-foreground">
                <strong className="text-rainbow-animated">Important:</strong> Your signature data is processed locally in your browser and is 
                not stored on our servers unless you explicitly use features that require server processing 
                (such as AI generation). Locally entered data remains on your device.
              </p>
            </div>
          </SectionCard>

          <SectionCard icon={Database} number="4" title="Data Retention">
            <p>
              We do not persistently store your personal signature data on our servers. Data entered into 
              the form is stored locally in your browser&apos;s session storage and is cleared when you close 
              the browser or reset the application.
            </p>
          </SectionCard>

          <SectionCard icon={Users} number="5" title="Third-Party Services">
            <p className="mb-2">Our service may integrate with:</p>
            <ul className="list-none space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-mid-4)] to-[var(--gradient-end)] mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">AI Services:</strong> When using AI-assisted generation, your input may be processed by third-party AI providers (e.g., OpenAI). These providers have their own privacy policies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-mid-4)] to-[var(--gradient-end)] mt-2 flex-shrink-0" />
                <span><strong className="text-foreground">Analytics:</strong> We may use privacy-respecting analytics to understand usage patterns.</span>
              </li>
            </ul>
          </SectionCard>

          <SectionCard icon={Lock} number="6" title="Data Security">
            <p>
              We implement appropriate technical measures to protect the information processed through our 
              service. However, no internet-based service is 100% secure. We encourage you not to include 
              sensitive personal information (such as passwords or financial data) in your signature.
            </p>
          </SectionCard>

          <SectionCard icon={Users} number="7" title="Your Rights">
            <p className="mb-2">You have the right to:</p>
            <ul className="list-none space-y-1.5 ml-1">
              {["Reset your signature data at any time using the reset button", "Clear your browser data to remove any locally stored information", "Contact us with questions about your data"].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid-1)]" />
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard icon={Shield} number="8" title="Children's Privacy">
            <p>
              Signature Forge is not intended for children under 13 years of age. We do not knowingly 
              collect information from children under 13.
            </p>
          </SectionCard>

          <SectionCard icon={Bell} number="9" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify users of any material 
              changes by updating the &quot;Last updated&quot; date at the top of this policy.
            </p>
          </SectionCard>

          <SectionCard icon={Mail} number="10" title="Contact Us">
            <p>
              If you have questions about this Privacy Policy, please contact us at:{" "}
              <a 
                href="mailto:privacy@openinsurance.ai" 
                className="text-rainbow-animated font-medium hover:opacity-80 transition-opacity"
              >
                privacy@openinsurance.ai
              </a>
            </p>
          </SectionCard>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border relative">
          <div className="absolute top-0 left-0 right-0 h-px rainbow-underline" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} <span className="text-rainbow-animated font-medium">Open Insurance</span>. All rights reserved.
            </p>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View Terms →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
