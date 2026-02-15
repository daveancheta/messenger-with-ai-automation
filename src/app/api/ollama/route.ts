import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { prompt } = await req.json()

    const systemInstruction = `You are a friendly AI assistant...`

    try {
        // ✅ Server calls the tunnel — no CORS issue
        const res = await fetch("https://dome-throwing-tin-conclusions.trycloudflare.com/" + "/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.2",
                prompt: `Instruction: ${systemInstruction}\n\nUser: ${prompt}`,
                stream: false
            })
        })

        const data = await res.json()

        return NextResponse.json({
            success: true,
            response: data.response.replace(/\*/g, '')
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 })
    }
}