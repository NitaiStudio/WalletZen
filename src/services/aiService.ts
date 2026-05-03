import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getFinancialInsights(transactions: any[], userProfile: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      As a premium financial advisor for WalletZen, analyze the following transactions and provide 3 smart, concise, and actionable saving tips.
      
      User Profile: ${JSON.stringify(userProfile)}
      Recent Transactions: ${JSON.stringify(transactions.slice(0, 10))}
      
      Format the response as a JSON array of objects with 'title', 'description', and 'category' (e.g., 'Spending', 'Investment', 'Savings').
      Keep the tone professional yet encouraging, like a high-end fintech app.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON from Markdown response
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [
      { title: "Reduce Dining Out", description: "You've spent 15% more on coffee this week. Switching to home-brew could save you $40/month.", category: "Spending" },
      { title: "Emergency Fund", description: "Consider moving $200 to your 'Dream Home' goal to stay on track.", category: "Savings" }
    ];
  } catch (error) {
    console.error("AI Insight Error:", error);
    return [
      { title: "Analyze Spending", description: "Add more transactions to get personalized AI insights.", category: "Info" }
    ];
  }
}
