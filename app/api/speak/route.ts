export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }

    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // ElevenLabs default premade voice ("Rachel")

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error("ElevenLabs error:", errText);
      return Response.json(
        { error: "Could not generate audio." },
        { status: 500 }
      );
    }

    const audioBuffer = await elevenRes.arrayBuffer();

    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("Error in /api/speak:", error);
    return Response.json(
      { error: "Something went wrong generating audio." },
      { status: 500 }
    );
  }
}