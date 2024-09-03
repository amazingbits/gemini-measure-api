import {
  GoogleGenerativeAI,
  ResponseSchema,
  SchemaType,
} from "@google/generative-ai";
import { MeasureType } from "@repositories/measures-repository";

const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const responseSchema: ResponseSchema = {
  description: "complete fields with measure information",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      product_name: { type: SchemaType.STRING },
      serial_number: { type: SchemaType.STRING },
      reading: { type: SchemaType.NUMBER },
      unit: { type: SchemaType.STRING },
      max_flow: { type: SchemaType.NUMBER },
      min_flow: { type: SchemaType.NUMBER },
      max_pressure: { type: SchemaType.NUMBER },
      is_valid: {
        type: SchemaType.BOOLEAN,
        description: "validate if is a water or gas reader or not",
      },
    },
    required: ["product_name", "serial_number", "reading", "unit", "is_valid"],
  },
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.8,
    topP: 0.9,
    topK: 50,
    responseMimeType: "application/json",
    responseSchema,
  },
});

export const generateReadingFromLLM = async (
  base64Image: string,
  type: MeasureType = "WATER"
) => {
  const propmts = {
    GAS: "Gostaria que você me respondesse se esta imagem é de um leitor de gás. Se for, me traga as seguintes informações: número de série, leitura, unidade de medida, vazão máxima, vazão mínima e pressão máxima.",
    WATER:
      "Gostaria que você me respondesse se esta imagem é de um leitor de água. Se for, me traga as seguintes informações: número de série, leitura e unidade de medida.",
  };
  try {
    const promptConfig = [
      {
        text: propmts[type],
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
    ];

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: promptConfig }],
    });
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "An error occurred while generating reading from Google Vision"
    );
  }
};
