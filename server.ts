import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header required by skill
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Chat endpoint supporting multi-turn chat, system instructions, and Google Maps grounding
app.post('/api/chat', async (req, res) => {
  try {
    const { 
      messages, 
      chatRole = 'concierge', 
      userLocation = { lat: -15.4167, lng: 28.3056 },
      useMapsGrounding = false 
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Gemini API key is not configured. Please check Settings > Secrets in AI Studio.' 
      });
    }

    // Role-specific System Instructions
    let systemInstruction = `You are "Lama Kords Travel & Stays Concierge", a warm, knowledgeable, and reliable Zambian travel assistant for the Lama Kords Technologies platform.
You specialize in accommodation bookings, safari reserves, city hotels, and transport across Zambia (Livingstone/Victoria Falls, South Luangwa, Lusaka, Siavonga/Lake Kariba, Lower Zambezi, Kafue, and Copperbelt).
Provide practical advice with prices quoted in Zambian Kwacha (ZMW) where applicable. Mention amenities like 24/7 solar power backup and borehole water when discussing accommodations.
Keep answers helpful, engaging, and clear.`;

    if (chatRole === 'maps_guide' || useMapsGrounding) {
      systemInstruction = `You are the "Lama Kords Maps & Local Discovery Guide".
Help tourists find places, restaurants, viewpoints, craft markets, and accommodations in Zambia with accurate geographical context.
Whenever providing places, describe their location and highlight proximity to major landmarks like Victoria Falls, Kenneth Kaunda Airport, or national park gates.`;
    } else if (chatRole === 'host_copilot') {
      systemInstruction = `You are the "Lama Kords Host Copilot", helping Zambian accommodation owners craft standout listing descriptions, set competitive nightly rates in ZMW, and write courteous, culturally warm responses to guest reviews.`;
    }

    // Format multi-turn conversation contents for Gemini
    const contents = messages.map((m: { role: 'user' | 'model'; text: string }) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    // Choose model
    const model = chatRole === 'host_copilot' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';

    const config: any = {
      systemInstruction,
    };

    // Google Maps Grounding enabled if requested
    if (useMapsGrounding || chatRole === 'maps_guide') {
      config.tools = [{ googleMaps: {} }];
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.lat || -15.4167,
            longitude: userLocation.lng || 28.3056,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    const reply = response.text || 'I apologize, I could not generate a response. Please try again.';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      reply,
      groundingChunks,
      modelUsed: model,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate response from Gemini API.' 
    });
  }
});

// Google Maps Grounded Zambia Explorer endpoint
app.post('/api/explore-places', async (req, res) => {
  try {
    const { query, lat = -15.4167, lng = 28.3056 } = req.body;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Gemini API key is not configured.' 
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Find popular attractions, authentic local restaurants, and scenic spots in Zambia for this inquiry: "${query || 'top attractions and places to visit around Livingstone and Lusaka'}". Include practical travel tips.`,
      config: {
        systemInstruction: 'You are an expert Zambian travel concierge. Use Google Maps grounding to recommend real, verified locations with accurate names and surroundings.',
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: Number(lat),
              longitude: Number(lng),
            },
          },
        },
      },
    });

    const reply = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      reply,
      groundingChunks,
    });
  } catch (error: any) {
    console.error('Error in /api/explore-places:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch places.' });
  }
});

// Fast AI Host Assistant endpoint (for property copy & review replies)
app.post('/api/host-tools', async (req, res) => {
  try {
    const { task, payload } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

    let prompt = '';
    let systemInstruction = 'You are an AI assistant for Zambian accommodation businesses.';

    if (task === 'enhance_listing') {
      prompt = `Enhance this accommodation listing for our Zambian platform.
Title: ${payload.title}
Property Type: ${payload.type}
City: ${payload.city}
Rough notes: ${payload.notes}
Nightly rate: ZMW ${payload.priceZMW}

Please return:
1. An enticing, luxury or boutique Title
2. An evocative 2-paragraph property Description highlighting comfort, solar backup, and local Zambian attractions
3. 5 essential amenities to highlight.`;
    } else if (task === 'reply_review') {
      prompt = `Draft a warm, polite, and professional host response to this guest review:
Guest Name: ${payload.customerName}
Rating: ${payload.rating}/5
Review: "${payload.comment}"
Stay Name: ${payload.stayTitle}

Tone: Gracious Zambian hospitality, addressing their points directly (include a greeting like 'Mwebantu' or 'Zikomo kwambiri'). Keep it under 60 words.`;
    } else {
      prompt = payload.prompt || 'How can hosts improve guest reviews in Zambia?';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: { systemInstruction },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('Error in /api/host-tools:', error);
    res.status(500).json({ error: error.message || 'Failed to process host tool.' });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Lama Kords full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
