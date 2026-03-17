import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const res = await fetch(`${STRAPI_URL}/api/contact-inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Contact Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
