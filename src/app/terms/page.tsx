"use client";

import type React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Sparkles, User, Copyright, AlertTriangle, Shield, Mail, Cpu, Settings, Scale, Layers, Mail as MailIcon } from "lucide-react";
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

export default function TermsPage() {
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
          <h1 className="font-semibold">Terms and Conditions</h1>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-mid-3)]/5 via-transparent to-[var(--gradient-mid-4)]/5" />
        <div className="max-w-3xl mx-auto px-4 py-12 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl border-rainbow-animated flex items-center justify-center bg-background">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-rainbow-animated">Terms</span> & Conditions
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-xl">
            The legal stuff, but we&apos;ve tried to make it readable. By using Signature Forge, you agree to these terms.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-6">
          <SectionCard icon={FileText} number="1" title="Acceptance of Terms">
            <p>
              By accessing or using Signature Forge (&quot;the Service&quot;), operated by Open Insurance, you agree 
              to be bound by these Terms and Conditions. If you do not agree to these terms, please do not 
              use the Service.
            </p>
          </SectionCard>

          <SectionCard icon={Sparkles} number="2" title="Description of Service">
            <p>
              Signature Forge is a free, web-based email signature builder that allows users to create 
              professional and creative email signatures. The Service includes AI-assisted features, 
              templates, and export functionality.
            </p>
          </SectionCard>

          <SectionCard icon={Sparkles} number="3" title="Free Service">
            <div className="p-3 rounded-lg bg-gradient-to-r from-[var(--gradient-start)]/5 to-[var(--gradient-end)]/5 border border-[var(--gradient-mid-3)]/20 mb-3">
              <p className="text-foreground">
                <span className="text-rainbow-animated font-semibold">100% Free</span> — Signature Forge is provided free of charge, forever.
              </p>
            </div>
            <p>
              We may offer optional donation features to support the project, but all core functionality remains free. 
              We reserve the right to introduce premium features in the future.
            </p>
          </SectionCard>

          <SectionCard icon={User} number="4" title="User Responsibilities">
            <p className="mb-2">When using the Service, you agree to:</p>
            <ul className="list-none space-y-1.5 ml-1">
              {[
                "Provide accurate information for your signature",
                "Not use the Service for any unlawful purpose",
                "Not attempt to circumvent any security measures",
                "Not use the Service to create misleading or fraudulent signatures",
                "Not impersonate others without authorization"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid-3)]" />
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard icon={Copyright} number="5" title="Intellectual Property">
            <div className="space-y-4">
              <div>
                <h3 className="text-foreground font-medium mb-2">5.1 Our Content</h3>
                <p>
                  The Service, including its design, templates, code, and branding, is owned by Open Insurance 
                  and protected by intellectual property laws. You may not copy, modify, or distribute our 
                  proprietary content without permission.
                </p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">5.2 Your Content</h3>
                <p>
                  You retain ownership of the information you enter and the signatures you create. By using 
                  the Service, you grant us a limited license to process your content solely to provide the Service.
                </p>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-2">5.3 Third-Party Trademarks</h3>
                <p className="mb-2">
                  The themed email templates feature characters and references that are trademarks of their respective owners:
                </p>
                <ul className="list-none space-y-1.5 ml-1 mb-3">
                  {[
                    { name: "Star Wars™", detail: " (including Darth Vader™ and Yoda™): Lucasfilm Ltd. / The Walt Disney Company" },
                    { name: "Spider-Man™", detail: ": Marvel Entertainment / The Walt Disney Company / Sony Pictures" },
                    { name: "Pirates of the Caribbean™", detail: " (including Captain Jack Sparrow™): The Walt Disney Company" },
                    { name: "The Office™", detail: ": NBCUniversal Media, LLC" },
                    { name: "Parks and Recreation™", detail: ": NBCUniversal Media, LLC" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-mid-2)] to-[var(--gradient-mid-4)] mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">{item.name}</strong>{item.detail}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs italic opacity-80">
                  These themed templates are fan tributes created for entertainment purposes only. Signature Forge 
                  is not affiliated with, endorsed by, or sponsored by any of these trademark holders.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={AlertTriangle} number="6" title="Disclaimer of Warranties">
            <div className="p-3 rounded-lg bg-muted/50 border border-border mb-3">
              <p className="text-xs uppercase tracking-wide text-foreground font-medium">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER 
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </div>
            <p className="mb-2">We do not warrant that:</p>
            <ul className="list-none space-y-1.5 ml-1">
              {[
                "The Service will be uninterrupted or error-free",
                "Signatures will be compatible with all email clients",
                "AI-generated content will be accurate or appropriate",
                "The Service will meet your specific requirements"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-mid-4)] to-[var(--gradient-end)]" />
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard icon={Shield} number="7" title="Limitation of Liability">
            <div className="p-3 rounded-lg bg-muted/50 border border-border mb-3">
              <p className="text-xs uppercase tracking-wide text-foreground font-medium">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, OPEN INSURANCE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
                WHETHER INCURRED DIRECTLY OR INDIRECTLY.
              </p>
            </div>
            <p className="mb-2">This includes losses resulting from:</p>
            <ul className="list-none space-y-1.5 ml-1">
              {[
                "Your use or inability to use the Service",
                "Any unauthorized access to or use of our servers",
                "Any errors or omissions in the Service",
                "Any third-party content or conduct"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid-1)]" />
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard icon={Mail} number="8" title="Email Client Compatibility">
            <p>
              Email signatures may render differently across various email clients (Gmail, Outlook, Apple Mail, 
              etc.). We provide export instructions for major clients, but we cannot guarantee perfect 
              compatibility with all email applications. You are responsible for testing your signature 
              before widespread use.
            </p>
          </SectionCard>

          <SectionCard icon={Cpu} number="9" title="AI-Generated Content">
            <p className="mb-2">When using AI features, content is generated by third-party AI services. You acknowledge that:</p>
            <ul className="list-none space-y-1.5 ml-1">
              {[
                "AI-generated content may contain errors or inappropriate suggestions",
                "You are responsible for reviewing and editing AI suggestions before use",
                "AI content should not be relied upon for critical professional communications without review"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--gradient-mid-3)] to-[var(--gradient-mid-4)]" />
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard icon={Settings} number="10" title="Modifications to Service">
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time 
              without notice. We shall not be liable to you or any third party for any modification, 
              suspension, or discontinuation of the Service.
            </p>
          </SectionCard>

          <SectionCard icon={FileText} number="11" title="Changes to Terms">
            <p>
              We may revise these Terms at any time by updating this page. Your continued use of the 
              Service following any changes constitutes acceptance of the new terms.
            </p>
          </SectionCard>

          <SectionCard icon={Scale} number="12" title="Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, without 
              regard to conflict of law principles.
            </p>
          </SectionCard>

          <SectionCard icon={Layers} number="13" title="Severability">
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall 
              continue in full force and effect.
            </p>
          </SectionCard>

          <SectionCard icon={MailIcon} number="14" title="Contact">
            <p>
              For questions about these Terms, please contact us at:{" "}
              <a 
                href="mailto:legal@openinsurance.ai" 
                className="text-rainbow-animated font-medium hover:opacity-80 transition-opacity"
              >
                legal@openinsurance.ai
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
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View Privacy Policy →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
