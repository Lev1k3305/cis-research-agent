import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query, country, lang } = await req.json();

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
    });

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

    const geminiData = await geminiRes.json();

    if (!geminiData.candidates?.[0]) {
      return NextResponse.json({ report: "Error: " + JSON.stringify(geminiData) });
    }

    const report = geminiData.candidates[0].content.parts[0].text;
    return NextResponse.json({ report });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ report: "Error occurred. Please try again." });
  }
}