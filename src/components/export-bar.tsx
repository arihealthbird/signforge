"use client";

import { useMemo, useRef, useState } from "react";
import { SignatureData } from "@/types/signature";
import { TemplateId } from "@/lib/templates";
import { generateSignatureHTML, htmlToPlainText, wrapHtmlDocument } from "@/lib/signature-html";
import { generateShareUrl } from "@/lib/share";
import { fireConfetti } from "@/lib/confetti";
import { Button, Segmented, Switch, cn, pad2 } from "@/components/ui";
import { Icon } from "@/components/icons";

interface ExportBarProps {
  data: SignatureData;
  templateId: TemplateId;
  credit: boolean;
  onCreditChange: (value: boolean) => void;
  onToast: (message: string) => void;
}

async function writeClipboard(text: string, html?: string): Promise<boolean> {
  try {
    if (html && typeof ClipboardItem !== "undefined") {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      return true;
    }
  } catch {
    // Fall through to plain text.
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

type Client = "gmail" | "outlook" | "apple";

const STEPS: Record<Client, string[]> = {
  gmail: [
    "Open Gmail and go to Settings, then See all settings, then General.",
    "Scroll to Signature, click Create new, and give it a name.",
    "Paste into the box (Cmd or Ctrl + V), then Save changes at the bottom.",
  ],
  outlook: [
    "New Outlook or web: Settings, then Accounts, then Signatures. Classic Outlook: File, Options, Mail, Signatures.",
    "Create a new signature and paste into the editor (Cmd or Ctrl + V).",
    "Choose it as the default for new messages and replies, then Save.",
  ],
  apple: [
    "In Mail, open Settings, then Signatures, and click the + button.",
    "Turn off \u201CAlways match my default message font\u201D so your fonts stay.",
    "Paste into the right-hand pane (Cmd + V) and close the window.",
  ],
};

export function ExportBar({ data, templateId, credit, onCreditChange, onToast }: ExportBarProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [client, setClient] = useState<Client>("gmail");
  const celebrated = useRef(false);

  // The export strips var(--font-*) tokens and never includes the dark variant.
  const html = useMemo(
    () => generateSignatureHTML(data, templateId, { credit }),
    [data, templateId, credit]
  );

  const flash = (key: string) => {
    setCopied(key);
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
  };

  const copyRich = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // `currentTarget` is cleared once the handler yields, so grab it first.
    const button = e.currentTarget;
    const ok = await writeClipboard(htmlToPlainText(html), html);
    if (!ok) {
      onToast("Couldn't access the clipboard. Try the HTML button.");
      return;
    }
    flash("rich");
    onToast("Signature copied. Paste it into your email settings.");
    if (!celebrated.current) {
      celebrated.current = true;
      const rect = button.getBoundingClientRect();
      fireConfetti({ x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  const copySource = async () => {
    if (await writeClipboard(html)) {
      flash("source");
      onToast("HTML copied.");
    }
  };

  const copyShare = async () => {
    if (await writeClipboard(generateShareUrl(data, templateId))) {
      flash("share");
      onToast("Share link copied.");
    }
  };

  return (
    <div className="border border-line bg-paper p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" lifted onClick={copyRich}>
          <Icon name={copied === "rich" ? "check" : "copy"} size="sm" />
          {copied === "rich" ? "Copied" : "Copy signature"}
        </Button>
        <Button variant="outline" onClick={copySource}>
          <Icon name={copied === "source" ? "check" : "code"} size="sm" />
          HTML
        </Button>
        <Button
          variant="outline"
          onClick={() => downloadFile("signature.html", wrapHtmlDocument(html), "text/html")}
        >
          <Icon name="download" size="sm" />
          Download
        </Button>
        <Button variant="outline" onClick={copyShare}>
          <Icon name={copied === "share" ? "check" : "link"} size="sm" />
          Share
        </Button>

        <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2 px-1">
          <span title="Adds a small line under the signature: Made with SignForge, a TheoVex project">
            <Switch
              checked={credit}
              onChange={onCreditChange}
              label={
                <span>
                  Add <span className="text-ink">&ldquo;Made with SignForge&rdquo;</span>
                </span>
              }
            />
          </span>
          <button
            type="button"
            onClick={() => setShowSteps((s) => !s)}
            aria-expanded={showSteps}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            How to add it
            <Icon name="chevron-down" size="xs" className={cn("transition-transform", showSteps && "rotate-180")} />
          </button>
        </div>
      </div>

      {showSteps ? (
        <div className="mt-3 animate-fade-in border border-line bg-paper-soft p-4">
          <Segmented<Client>
            value={client}
            onChange={setClient}
            ariaLabel="Email app"
            options={[
              { value: "gmail", label: "Gmail" },
              { value: "outlook", label: "Outlook" },
              { value: "apple", label: "Apple Mail" },
            ]}
          />
          <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted">
            {STEPS[client].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center border border-ink bg-neon font-mono text-[10px] font-bold text-neon-ink">
                  {pad2(i + 1)}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
