export const config = {
  matcher: [
    '/((?!_next/|_vercel/|admin|api/|.*\\..*).*)',
  ],
};

const BOT_UA = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|gptbot|anthropic-ai|perplexitybot|claudebot|ccbot|chatgpt|google-extended|meta-externalagent/i;

const BACKEND = 'https://medi-production-5b91.up.railway.app';

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) return;

  const url = new URL(request.url);
  const path = url.pathname;

  try {
    const category = url.searchParams.get('category') || '';
    const renderUrl = `${BACKEND}/render?path=${encodeURIComponent(path)}${category ? `&category=${encodeURIComponent(category)}` : ''}`;
    const res = await fetch(renderUrl, {
      headers: { 'x-prerender-token': 'internal' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return;

    const html = await res.text();
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Prerendered': '1',
      },
    });
  } catch {
    return;
  }
}
