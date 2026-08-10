const { GoogleGenAI } = require('@google/genai');

/**
 * Generate a financial insight using the Gemini API.
 * @param {string} financialSummary - The summarized transaction data.
 * @returns {Promise<string>} The generated insight text.
 */
const generateFinancialInsight = async (financialSummary) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are SmartSpend AI, a personal finance assistant.
      
      Analyze the following user's financial summary.
      
      Financial Summary:
      ${financialSummary}
      
      Provide ONE short and useful financial insight.
      
      Requirements:
      - Base the insight only on the provided data.
      - Do not invent transactions or financial information.
      - Be practical and easy to understand.
      - Mention a specific spending pattern when possible.
      - Give one actionable suggestion.
      - Keep the response between 2 and 4 sentences.
      - Do not use excessive emojis.
      - Do not claim to provide professional financial advice.
      - Do not make guaranteed predictions.
      
      Return only the final insight text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });

    if (response && response.text) {
      return response.text.trim();
    } else {
      throw new Error('No text returned from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error.message || error);
    throw new Error('Failed to generate insight from Gemini');
  }
};

/**
 * Scan a receipt image using Gemini Vision to extract transaction details.
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} mimeType - The mime type of the image (e.g., 'image/jpeg')
 * @returns {Promise<Object>} The extracted JSON data
 */
const scanReceiptImage = async (base64Data, mimeType) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const promptText = `
      Analyze this receipt image and extract the following information.
      Return ONLY a valid JSON object without any markdown formatting, backticks, or extra text.
      Use this exact JSON schema:
      {
        "merchantName": "string or null",
        "totalAmount": "number (just the value, no currency symbols) or null",
        "date": "YYYY-MM-DD string or null",
        "category": "Pick exactly ONE from this list: ['Food & Dining', 'Shopping', 'Transportation', 'Bills & Utilities', 'Entertainment', 'Health'] or null if unknown"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            { inlineData: { data: base64Data, mimeType } }
          ]
        }
      ]
    });

    if (response && response.text) {
      // Clean up the text in case Gemini adds ```json
      let cleanText = response.text.trim();
      if (cleanText.startsWith('\`\`\`json')) cleanText = cleanText.substring(7);
      if (cleanText.startsWith('\`\`\`')) cleanText = cleanText.substring(3);
      if (cleanText.endsWith('\`\`\`')) cleanText = cleanText.substring(0, cleanText.length - 3);
      cleanText = cleanText.trim();
      
      return JSON.parse(cleanText);
    } else {
      throw new Error('No data returned from Gemini API');
    }
  } catch (error) {
    console.error('Gemini Receipt API Error:', error.message || error);
    throw new Error('Failed to scan receipt with Gemini');
  }
};

/**
 * Generate specific budget tips based on user's budgets and spending.
 * @param {string} budgetSummary - The summarized budget data.
 * @returns {Promise<Array>} Array of generated tip objects { type: 'success'|'warning', text: string }
 */
const generateBudgetInsights = async (budgetSummary) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const promptText = `
      You are SmartSpend AI, a personal finance assistant.
      
      Analyze the following user's budget and spending summary for this month.
      
      Budget Summary:
      ${budgetSummary}
      
      Provide exactly 2 short, actionable budget tips based ONLY on the provided data.
      One tip should highlight something positive (type: "success").
      One tip should highlight an area for improvement or caution (type: "warning").
      
      Return ONLY a valid JSON array of objects with this schema:
      [
        { "type": "success", "text": "Great job! You're under budget in..." },
        { "type": "warning", "text": "You can save more if you reduce..." }
      ]
      
      Requirements:
      - Do not use markdown backticks in the response.
      - Each text must be 1-2 sentences.
      - Keep it practical and easy to understand.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: promptText,
    });

    if (response && response.text) {
      let cleanText = response.text.trim();
      if (cleanText.startsWith('\`\`\`json')) cleanText = cleanText.substring(7);
      if (cleanText.startsWith('\`\`\`')) cleanText = cleanText.substring(3);
      if (cleanText.endsWith('\`\`\`')) cleanText = cleanText.substring(0, cleanText.length - 3);
      cleanText = cleanText.trim();
      
      return JSON.parse(cleanText);
    } else {
      throw new Error('No data returned from Gemini API');
    }
  } catch (error) {
    console.error('Gemini Budget Insight API Error:', error.message || error);
    throw new Error('Failed to generate budget insights with Gemini');
  }
};

module.exports = {
  generateFinancialInsight,
  scanReceiptImage,
  generateBudgetInsights
};
