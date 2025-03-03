import { NextResponse } from 'next/server';
import { getOpenAIResponse } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt parametresi gereklidir' },
        { status: 400 }
      );
    }

    const response = await getOpenAIResponse(prompt);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 