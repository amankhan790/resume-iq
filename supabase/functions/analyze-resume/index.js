const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { resumeText, jobTitle, jobDescription, companyName } =
      await req.json();

    if (!resumeText || !jobTitle || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const prompt = `You are an ATS resume analyzer. Analyze the resume against the job posting.

Reply ONLY with valid JSON, no markdown, no extra text:
{
  "score": <number 0-100>,
  "summary": "<2 sentence assessment>",
  "strengths": ["<point 1>", "<point 2>", "<point 3>"],
  "improvements": ["<point 1>", "<point 2>", "<point 3>"],
  "keywords_missing": ["<keyword 1>", "<keyword 2>"]
}

Company: ${companyName}
Job Title: ${jobTitle}
Job Description: ${jobDescription}
Resume: ${resumeText}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    const geminiData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini API error:", geminiData);

      return new Response(
        JSON.stringify({
          error: "Gemini API request failed",
          details:
            geminiData?.error?.message || "Unknown Gemini API error",
        }),
        {
          status: geminiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const responseText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return new Response(
        JSON.stringify({ error: "Gemini returned an empty response" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const result = JSON.parse(responseText);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);

    return new Response(
      JSON.stringify({
        error: "Analysis failed",
        details: err.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});