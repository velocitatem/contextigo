import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const isValidUrl = /^https?:\/\/.+/.test(url);
    if (!isValidUrl) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Contextigo/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('text/html')) {
      const html = await response.text();
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return NextResponse.json({ content: textContent }, { status: 200 });
    } else if (contentType.includes('application/json')) {
      const jsonContent = await response.json();
      return NextResponse.json({ content: JSON.stringify(jsonContent, null, 2) }, { status: 200 });
    } else if (contentType.includes('text/')) {
      const textContent = await response.text();
      return NextResponse.json({ content: textContent }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type. Only text, HTML, and JSON are supported.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website content' },
      { status: 500 }
    );
  }
}