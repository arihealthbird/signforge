"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Check, Download, FileCode, Clipboard } from "lucide-react";

// Gmail Logo SVG
const GmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4H20C21.1 4 22 4.9 22 6Z" fill="#F6F6F6"/>
    <path d="M22 6L12 13L2 6" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 6V18C2 19.1 2.9 20 4 20" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6V18C22 19.1 21.1 20 20 20" stroke="#34A853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 20H20" stroke="#FBBC05" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 6L4 4H20L22 6" fill="white"/>
    <path d="M2 6L12 13L22 6" fill="#EA4335" fillOpacity="0.2"/>
  </svg>
);

// Outlook Logo SVG
const OutlookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 3V21L3 18V6L14 3Z" fill="#0078D4"/>
    <path d="M21 6H14V18H21C21.55 18 22 17.55 22 17V7C22 6.45 21.55 6 21 6Z" fill="#28A8EA"/>
    <path d="M14 6L22 10V7C22 6.45 21.55 6 21 6H14Z" fill="#50D9FF"/>
    <path d="M14 18L22 14V17C22 17.55 21.55 18 21 18H14Z" fill="#0078D4"/>
    <ellipse cx="8" cy="12" rx="3" ry="3.5" fill="white"/>
  </svg>
);

interface ExportPanelProps {
  onCopyHTML: () => string;
  onFirstExport?: () => void;
}

export function ExportPanel({ onCopyHTML, onFirstExport }: ExportPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const hasExportedRef = useRef(false);

  const triggerFirstExport = () => {
    if (!hasExportedRef.current && onFirstExport) {
      hasExportedRef.current = true;
      onFirstExport();
    }
  };

  const copyToClipboard = async (type: "html" | "rich") => {
    const html = onCopyHTML();
    
    if (!html) {
      return;
    }

    try {
      if (type === "rich") {
        // Copy as rich text (for Gmail, Outlook)
        const blob = new Blob([html], { type: "text/html" });
        const data = new ClipboardItem({
          "text/html": blob,
          "text/plain": new Blob([html], { type: "text/plain" }),
        });
        await navigator.clipboard.write([data]);
      } else {
        // Copy as plain HTML
        await navigator.clipboard.writeText(html);
      }
      
      setCopied(type);
      triggerFirstExport();
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for browsers that don't support ClipboardItem
      await navigator.clipboard.writeText(html);
      setCopied(type);
      triggerFirstExport();
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const downloadHTML = () => {
    const html = onCopyHTML();
    if (!html) return;

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Signature</title>
</head>
<body>
${html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-signature.html";
    a.click();
    URL.revokeObjectURL(url);
    triggerFirstExport();
  };

  const exportOptions = [
    {
      id: "gmail",
      title: "Gmail / Google Workspace",
      description: "Copy for Gmail settings → Signature",
      action: () => copyToClipboard("rich"),
      icon: GmailIcon,
      instructions: "Settings → See all settings → General → Signature → Paste",
    },
    {
      id: "outlook",
      title: "Outlook / Microsoft 365",
      description: "Copy for Outlook signature settings",
      action: () => copyToClipboard("rich"),
      icon: OutlookIcon,
      instructions: "Settings → View all Outlook settings → Mail → Compose and reply → Paste",
    },
    {
      id: "html",
      title: "Copy HTML Code",
      description: "Get the raw HTML for custom integration",
      action: () => copyToClipboard("html"),
      icon: FileCode,
      instructions: "Paste the HTML code into your email client's signature HTML editor",
    },
    {
      id: "download",
      title: "Download HTML File",
      description: "Save as .html file for later use",
      action: downloadHTML,
      icon: Download,
      instructions: "Open the downloaded file in a browser to preview or copy",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clipboard className="w-5 h-5 text-primary" />
          Export Your Signature
        </CardTitle>
        <CardDescription>
          Choose your email client and follow the instructions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {exportOptions.map((option) => (
          <div
            key={option.id}
            className="p-3 sm:p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-1.5 sm:p-2 rounded-lg bg-secondary flex-shrink-0">
                  <option.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs sm:text-sm">{option.title}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 italic hidden sm:block">
                    {option.instructions}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={option.action}
                className="shrink-0 w-full sm:w-auto"
              >
                {copied === option.id.replace("gmail", "rich").replace("outlook", "rich") ||
                 (option.id === "gmail" && copied === "rich") ||
                 (option.id === "outlook" && copied === "rich") ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    Copied!
                  </>
                ) : option.id === "download" ? (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg bg-secondary/50">
          <h4 className="font-medium text-xs sm:text-sm mb-2">Quick Tips</h4>
          <ul className="text-[10px] sm:text-xs text-muted-foreground space-y-1">
            <li>• Images embedded as base64 for compatibility</li>
            <li>• Some email clients may strip CSS styles</li>
            <li>• Test by sending an email to yourself first</li>
            <li>• Keep images under 100KB each</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
