const axios = require('axios');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Analyze news headlines for portfolio impact
async function analyzeNews(headlines, symbols) {
  console.log('Analyzing news for symbols:', symbols);
  console.log('Headlines received:', headlines);
  
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }
  
  // Convert headlines array to readable format and limit to prevent token overflow
  const headlinesText = headlines
    .slice(0, 10) // Limit to first 10 headlines
    .map(item => {
      if (typeof item === 'string') {
        return item.substring(0, 200); // Limit string length
      } else if (item.headline && item.summary) {
        const headline = item.headline.substring(0, 100);
        const summary = item.summary.substring(0, 100);
        return `${headline}: ${summary}`;
      } else if (item.headline) {
        return item.headline.substring(0, 200);
      } else {
        return '';
      }
    })
    .filter(text => text.trim() !== '')
    .join("; ");
  
  console.log('Processed headlines text:', headlinesText);
  
  const prompt = `You are a financial news analyst. Given these stock symbols: ${symbols.join(", ")}, and these news headlines: ${headlinesText}, analyze the likely impact on the portfolio. For each symbol, return a JSON array of objects with keys: symbol, impact (Positive, Neutral, or Negative), and a short reason. Example: [ { "symbol": "RELIANCE", "impact": "Positive", "reason": "Strong earnings report" }, { "symbol": "TCS", "impact": "Neutral", "reason": "No major news" } ] If there is no relevant news for a symbol, return impact as "Neutral" and reason as "No relevant news."`;
  
  try {
    console.log('Making request to Groq API...');
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a financial news analyst.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.3,
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Groq API response received');
    const content = response.data.choices[0].message.content;
    console.log('AI response content:', content);
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.log('Failed to parse JSON, returning raw content');
      return content;
    }
  } catch (error) {
    console.error('Groq API error details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message || 'Groq API call failed');
  }
}

module.exports = analyzeNews; 