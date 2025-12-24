
import { GoogleGenAI } from "@google/genai";

// Always use the API key directly from process.env.API_KEY as per initialization rules.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes financial data using Gemini 3 Pro to provide summarized business insights.
 */
export const getFinancialInsights = async (data: any): Promise<string> => {
  try {
    // Using gemini-3-pro-preview for high-reasoning tasks like financial analysis.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `你是一位世界级的财务分析专家。请根据以下最新的财务分录数据，为管理者提供一条专业的财务状况总结或风险提示（字数控制在50-80字）：\n\n${JSON.stringify(data)}`,
    });

    // Directly access the text property as per @google/genai guidelines.
    return response.text || "暂无 AI 财务分析建议。";
  } catch (error) {
    console.error("Gemini Insight Generation Failed:", error);
    return "智能财务分析服务暂时繁忙，请稍后再试。";
  }
};
