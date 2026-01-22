import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, validateSignatureData, truncate } from "@/lib/security";
import { SIGNATURE_TEMPLATES } from "@/lib/templates";
import { COLOR_THEMES, FONT_OPTIONS } from "@/types/signature";

// Constants for validation
const MAX_PROMPT_LENGTH = 2000;
const MAX_REQUEST_SIZE = 50000; // 50KB

// Placeholder image services for AI-generated content
const PLACEHOLDER_SERVICES = {
  profile: (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=random&color=fff&bold=true`,
  logo: (company: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&size=200&background=6366f1&color=fff&rounded=false&bold=true&format=png`,
};

export async function POST(request: NextRequest) {
  try {
    // Get client identifier for rate limiting (use IP or fallback)
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                     request.headers.get("x-real-ip") || 
                     "anonymous";
    
    // Check rate limit (10 requests per minute)
    const rateLimit = checkRateLimit(clientIp, 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)),
            "X-RateLimit-Remaining": "0",
          }
        }
      );
    }

    // Check content length
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: "Request too large" },
        { status: 413 }
      );
    }

    // Check if OpenAI is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI features are not configured" },
        { status: 503 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { prompt, currentData, providedImages } = body;
    
    // Extract provided image URLs
    const userProvidedProfilePhoto = providedImages?.profilePhotoUrl || null;
    const userProvidedLogo = providedImages?.logoUrl || null;

    // Validate prompt
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt must be less than ${MAX_PROMPT_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Validate currentData structure
    if (currentData && !validateSignatureData(currentData)) {
      return NextResponse.json(
        { error: "Invalid signature data format" },
        { status: 400 }
      );
    }

    // Sanitize the prompt (basic cleanup)
    const sanitizedPrompt = truncate(prompt.trim(), MAX_PROMPT_LENGTH);

    // Build comprehensive context for AI
    const templateInfo = SIGNATURE_TEMPLATES.map(t => `${t.id}: ${t.name} - ${t.description}`).join("\n");
    const colorThemeInfo = COLOR_THEMES.map(t => `${t.id}: ${t.name} (primary: ${t.primaryColor}, secondary: ${t.secondaryColor})`).join("\n");
    const fontInfo = FONT_OPTIONS.slice(0, 15).map(f => f.label).join(", ");

    const systemPrompt = `You are an expert email signature designer and creative director. You have FULL creative control to design stunning, professional email signatures.

Your capabilities:
1. CONTENT GENERATION: Create realistic, professional content (names, titles, companies, contact info)
2. VISUAL DESIGN: Choose colors, fonts, and visual style that match the user's brand/personality
3. TEMPLATE SELECTION: Recommend the best template layout for their needs
4. COMPLETE SIGNATURES: Generate fully-populated signatures from scratch based on descriptions
5. PLACEHOLDER IMAGES: Set includeProfilePhoto and includeCompanyLogo to true when appropriate

Current signature data:
${JSON.stringify(currentData, null, 2)}

AVAILABLE TEMPLATES (use "suggestedTemplate" field to recommend one):
${templateInfo}

AVAILABLE COLOR THEMES (for inspiration):
${colorThemeInfo}

POPULAR FONTS: ${fontInfo}

You MUST respond with ONLY a valid JSON object. Available fields:

== CONTENT FIELDS ==
- fullName (string) - Person's full name
- jobTitle (string) - Professional title/role
- company (string) - Company/organization name
- department (string) - Department or team
- email (string) - Professional email address
- phone (string) - Office/work phone with proper formatting
- mobile (string) - Mobile number with proper formatting
- website (string) - Company or personal website URL
- address (string) - Street address
- city (string) - City name
- state (string) - State/province
- zipCode (string) - Postal/ZIP code  
- country (string) - Country name
- disclaimer (string) - Legal disclaimer or confidentiality notice
- calendarLink (string) - Calendly or booking link URL

== SOCIAL LINKS ==
- socialLinks (array of {platform: "linkedin"|"twitter"|"facebook"|"instagram"|"github"|"youtube"|"website", url: string})
  Generate realistic URLs based on person's name (e.g., linkedin.com/in/firstname-lastname)

== VISUAL STYLING ==
- primaryColor (hex string) - Main brand color (e.g., "#6366f1")
- secondaryColor (hex string) - Accent color
- fontFamily (string) - Use one of: "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Playfair Display"
- fontSize (number) - Base font size in pixels (12-18)

== IMAGES ==
- includeProfilePhoto (boolean) - Set true to include a profile photo in the signature
- includeCompanyLogo (boolean) - Set true to include a company logo in the signature

NOTE: The user has provided the following images:
- Profile Photo: ${userProvidedProfilePhoto ? "YES - User uploaded their profile photo" : "NO - Use placeholder if includeProfilePhoto is true"}
- Company Logo: ${userProvidedLogo ? "YES - User uploaded their company logo" : "NO - Use placeholder if includeCompanyLogo is true"}

If the user has provided images, set the corresponding include flag to true so their images will be used.

== TEMPLATE RECOMMENDATION ==
- suggestedTemplate (string) - One of: "professional-classic", "minimal-modern", "corporate-bold", "creative-gradient", "executive-elegant", "startup-fresh"

DESIGN GUIDELINES:
- For "professional/corporate": Use blues (#2563eb, #1e40af), clean fonts like Inter/Roboto
- For "creative/startup": Use vibrant colors (#7c3aed, #06b6d4), modern fonts like Poppins/Space Grotesk  
- For "executive/elegant": Use sophisticated colors (#334155, #18181b), fonts like Playfair Display
- For "tech/developer": Include GitHub, use darker themes, monospace-friendly
- For "marketing/sales": Include social links, use warm colors (#ea580c, #e11d48), add calendar link

Be CREATIVE and COMPLETE. When the user describes themselves or a scenario, generate a FULL signature with realistic content, appropriate styling, and the best template.`;

    // Example: if user says "I'm a software engineer at Google", generate:
    // - A realistic name, title, email (firstname.lastname@google.com)
    // - GitHub and LinkedIn links
    // - Google's brand colors
    // - Tech-appropriate template

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: sanitizedPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      // Don't expose full error details from OpenAI
      const status = response.status;
      if (status === 401) {
        return NextResponse.json(
          { error: "Invalid API key" },
          { status: 401 }
        );
      } else if (status === 429) {
        return NextResponse.json(
          { error: "OpenAI rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: "AI service error. Please try again." },
          { status: 502 }
        );
      }
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    try {
      // Remove markdown code blocks if present
      const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
      const aiResponse = JSON.parse(jsonStr);
      
      // Extract special fields
      const { suggestedTemplate, includeProfilePhoto, includeCompanyLogo, ...signatureFields } = aiResponse;
      
      // Process the signature data
      const signature = { ...signatureFields };
      
      // Handle profile photo: use user-provided image or placeholder
      if (includeProfilePhoto) {
        if (userProvidedProfilePhoto) {
          // User provided their own profile photo
          signature.profilePhotoUrl = userProvidedProfilePhoto;
          signature.profilePhotoSize = 80;
        } else if (signature.fullName) {
          // Generate a placeholder based on name
          signature.profilePhotoUrl = PLACEHOLDER_SERVICES.profile(signature.fullName);
          signature.profilePhotoSize = 80;
        }
      }
      
      // Handle company logo: use user-provided image or placeholder
      if (includeCompanyLogo) {
        if (userProvidedLogo) {
          // User provided their own logo
          signature.logoUrl = userProvidedLogo;
          signature.logoWidth = 120;
        } else if (signature.company) {
          // Generate a placeholder based on company name
          signature.logoUrl = PLACEHOLDER_SERVICES.logo(signature.company);
          signature.logoWidth = 120;
        }
      }
      
      // Map font family names to actual CSS values
      if (signature.fontFamily) {
        const fontMap: Record<string, string> = {
          "Inter": "var(--font-inter), 'Inter', system-ui, sans-serif",
          "Roboto": "var(--font-roboto), 'Roboto', Arial, sans-serif",
          "Open Sans": "var(--font-open-sans), 'Open Sans', Arial, sans-serif",
          "Lato": "var(--font-lato), 'Lato', Arial, sans-serif",
          "Montserrat": "var(--font-montserrat), 'Montserrat', Arial, sans-serif",
          "Poppins": "var(--font-poppins), 'Poppins', Arial, sans-serif",
          "Playfair Display": "var(--font-playfair), 'Playfair Display', Georgia, serif",
        };
        signature.fontFamily = fontMap[signature.fontFamily] || signature.fontFamily;
      }
      
      // Validate the response structure
      if (!validateSignatureData(signature)) {
        return NextResponse.json(
          { error: "AI returned invalid data format" },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          signature,
          suggestedTemplate: suggestedTemplate || null,
        },
        {
          headers: {
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          }
        }
      );
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }
  } catch (error) {
    // Sanitized error logging - don't log full error object which might contain sensitive data
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Generate API error:", errorMessage);
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
