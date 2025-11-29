// test-gemini.js
const apiKey =
  process.env.GEMINI_API_KEY || "AIzaSyCrOOUAYotWMa44Gsb-ztbyFZZ1zgiwagE";

if (apiKey === "YOUR_HARDCODED_KEY_HERE") {
  console.error(
    "❌ Error: Please set your API key in the code or environment variables."
  );
  process.exit(1);
}

async function checkModels() {
  console.log("🔍 Querying Google Gemini API for available models...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log("\n✅ Success! Here are the models available to your key:\n");

    // Filter and display only Gemini models
    const geminiModels = data.models.filter((m) => m.name.includes("gemini"));

    if (geminiModels.length === 0) {
      console.log(
        "⚠️ No 'gemini' models found. You might only have access to PaLM or older models."
      );
    } else {
      console.table(
        geminiModels.map((m) => ({
          Name: m.name, // THIS IS THE EXACT STRING YOU NEED
          Version: m.version,
          "Supported Methods": m.supportedGenerationMethods.join(", "),
        }))
      );
    }
  } catch (error) {
    console.error("\n❌ Connection Failed:", error.message);
    console.log(
      "Tip: Check if your API Key is valid and has permissions enabled in Google AI Studio."
    );
  }
}

checkModels();
