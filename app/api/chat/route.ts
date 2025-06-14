import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import { NextResponse } from "next/server"

export const maxDuration = 30

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not found")
      return new NextResponse("OpenAI API key not configured", { status: 500 })
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Invalid messages format", { status: 400 })
    }

    console.log("Processing chat request with", messages.length, "messages")

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      system: `You are a medical AI assistant for Optimed, a Canadian healthcare platform. Your role is to:

1. Assess injury severity and urgency
2. Provide appropriate care recommendations
3. Help users understand when to seek emergency vs. routine care
4. Guide them to the right healthcare facility
5. Give an estimate of waittime at specific hospitals/ERs

IMPORTANT: You are NOT providing medical diagnosis, only triage guidance.

When you complete an assessment, format your response to include:
ASSESSMENT:
Severity: [1-5 scale]
Urgency: [emergency/urgent/moderate/low]
Action: [brief recommendation]
Wait Time: [estimated minutes]

Guidelines:
- Emergency (call 911): chest pain, difficulty breathing, severe bleeding, loss of consciousness
- Urgent (ER within 2 hours): severe pain, possible fractures, high fever
- Moderate (walk-in clinic): minor injuries, mild symptoms
- Low (home care/family doctor): very minor issues

Always ask follow-up questions to better understand:
- When did the injury occur?
- Pain level (1-10)?
- Any swelling, bleeding, or deformity?
- Can you move the affected area?
- Any numbness or tingling?
- Previous medical conditions?

Be empathetic, clear, and always emphasize that this is guidance only.`,
      messages,
    })

    return result.toDataStreamResponse({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    })
  } catch (error) {
    console.error("Chat API Error:", error)

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return new NextResponse("Invalid OpenAI API key", { status: 401 })
      }
      if (error.message.includes("quota")) {
        return new NextResponse("OpenAI quota exceeded", { status: 429 })
      }
    }

    return new NextResponse(`Error: ${error}`, { status: 500 })
  }
}
