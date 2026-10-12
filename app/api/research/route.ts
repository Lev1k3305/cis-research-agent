import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter to prevent API abuse (DoS, cost overrun)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_COUNT = 5; // Allow 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // per 1 minute (60,000 ms)

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Filter out timestamps outside the current window
  const recentTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW);

  if (recentTimestamps.length >= RATE_LIMIT_COUNT) {
    return true; // Rate limit exceeded
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  if (checkRateLimit(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      { report: "Too many requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch (err) {
    console.error("Failed to parse request JSON:", err);
    return NextResponse.json(
      { report: "Invalid request payload." },
      { status: 400 }
    );
  }

  const { query, country, lang } = body;

  // Input Validation
  const supportedLangs = ["ru", "en", "kz", "zh", "de", "fr"];

  if (
    typeof query !== "string" ||
    query.trim().length === 0 ||
    query.length > 100
  ) {
    return NextResponse.json(
      { report: "Invalid query. It must be a non-empty string under 100 characters." },
      { status: 400 }
    );
  }

  if (
    typeof country !== "string" ||
    country.trim().length === 0 ||
    country.length > 50
  ) {
    return NextResponse.json(
      { report: "Invalid country. It must be a non-empty string under 50 characters." },
      { status: 400 }
    );
  }

  if (typeof lang !== "string" || !supportedLangs.includes(lang)) {
    return NextResponse.json(
      { report: "Invalid language selection." },
      { status: 400 }
    );
  }

  try {
    const scrapeRes = await fetch("https://api.brightdata.com/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BRIGHT_DATA_API_KEY}`,
      },
      body: JSON.stringify({
        zone: process.env.BRIGHT_DATA_ZONE,
        url: `https://www.google.com/search?q=${encodeURIComponent(query + " IT jobs " + country + " 2026")}&num=10`,
        format: "raw",
      }),
      signal: AbortSignal.timeout(15000), // Enforce 15s timeout to prevent DoS via hung connections
    });

    if (!scrapeRes.ok) {
      console.error(`Bright Data request failed with status: ${scrapeRes.status}`);
      return NextResponse.json(
        { report: "An error occurred while fetching web context. Please try again." },
        { status: 502 }
      );
    }

    const htmlData = await scrapeRes.text();

    const langInstructions: Record<string, string> = {
      ru: "Отвечай на русском языке",
      en: "Respond in English",
      kz: "Қазақ тілінде жауап бер",
      zh: "用中文回答",
      de: "Antworte auf Deutsch",
      fr: "Répondez en français",
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000), // Enforce 15s timeout to prevent DoS via hung connections
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert IT market analyst for ${country}. ${langInstructions[lang] || "Respond in English"}.

                     Analyze the IT job market for: "${query}" in ${country}.

                     Provide a detailed structured report:

                     ## 📊 Market Analysis: ${query} — ${country}

                     ### 🔥 Top Skills
                     ### 💰 Salaries
                     ### 🏢 Top Companies
                     ### 📈 Market Trends 2026
                     ### 💡 Recommendations

                     Web data context:
                     ${htmlData.substring(0, 5000)}`
            }]
          }]
        }),
      }
    );

    if (!geminiRes.ok) {
      console.error(`Gemini API request failed with status: ${geminiRes.status}`);
      return NextResponse.json(
        { report: "An error occurred while analyzing the job market. Please try again." },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();

    if (!geminiData.candidates?.[0]) {
      console.error("Gemini response missing expected candidates structure:", JSON.stringify(geminiData));
      return NextResponse.json(
        { report: "An error occurred while generating the report. Please try again." },
        { status: 502 }
      );
    }

    const report = geminiData.candidates[0].content?.parts?.[0]?.text;
    if (!report) {
      console.error("Gemini candidate structure lacks part text:", JSON.stringify(geminiData));
      return NextResponse.json(
        { report: "An error occurred while generating the report. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ report });

  } catch (error) {
    // Log the error details securely on the server
    console.error("Secure Server Error Log:", error);
    // Return a safe, generic message to prevent leakage of internal stack traces/details
    return NextResponse.json(
      { report: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
