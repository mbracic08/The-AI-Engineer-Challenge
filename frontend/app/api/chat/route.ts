import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { detail: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { detail: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive mental coach. Keep responses concise (1-2 sentences). Be brief and helpful.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 150,
    });

    const replyContent = response.choices[0].message.content;
    const finalReply = replyContent || "I'm here to help. Could you tell me more about what's on your mind?";

    return NextResponse.json({ reply: finalReply });
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json(
      { detail: `Error calling OpenAI API: ${error.message}` },
      { status: 500 }
    );
  }
}
