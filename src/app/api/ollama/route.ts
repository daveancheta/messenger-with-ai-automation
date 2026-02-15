import { NextRequest, NextResponse } from 'next/server'
import ollama from 'ollama'

export async function POST(req: NextRequest) {
    const { prompt } = await req.json()

    const systemInstruction = `You are a friendly AI assistant. Keep your answers clear and concise — not too long, not too short. Explain things briefly but with enough detail to be helpful.`

    try {
        const response = await ollama.chat({
            model: 'llama3.2',
            messages: [{ role: 'user', content: `Instruction: ${systemInstruction}\n\nUser question: ${prompt}` }],
        })

        return NextResponse.json({
            success: true,
            prompt,
            response: response.message.content.replace(/\*/g, '') || ''
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false
        }, { status: 400 })
    }
}