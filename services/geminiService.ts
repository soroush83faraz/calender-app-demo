
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    // In a real app, you might want to handle this more gracefully.
    // For this demo, we'll throw an error if the key is missing.
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const eventSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "یک عنوان کوتاه و خلاقانه برای رویداد",
        },
        description: {
            type: Type.STRING,
            description: "یک توضیح یک جمله‌ای برای رویداد",
        },
    },
    required: ["title", "description"],
};


export const generateEventSuggestion = async (date: Date): Promise<{ title: string; description: string }> => {
    try {
        const formattedDate = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);

        const prompt = `
        برای یک رویداد در تاریخ ${formattedDate} یک ایده پیشنهاد بده.
        پاسخ باید کاملا به زبان فارسی باشد.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: eventSuggestionSchema,
                temperature: 0.8, // Increase creativity
            },
        });

        const jsonText = response.text.trim();
        const suggestion = JSON.parse(jsonText);
        
        if (suggestion && suggestion.title && suggestion.description) {
            return suggestion;
        } else {
            throw new Error("Invalid JSON response from AI");
        }
    } catch (error) {
        console.error("Error generating event suggestion:", error);
        throw new Error("Failed to get suggestion from Gemini API.");
    }
};
