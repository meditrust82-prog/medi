/**
 * Fallback prerenderer — use if react-snap fails.
 *
 * Usage:
 *   1. npm i -D puppeteer serve
 *   2. Replace "postbuild": "react-snap" in package.json with:
 *        "postbuild": "node scripts/prerender.mjs"
 *   3. Set VITE_API_URL env var so client-side fetches hit the real backend.
 *
 * What it does:
 *   - Boots a static server on dist/
 *   - Fetches product slugs from the API to build a dynamic route list
 *   - Launches headless Chrome, navigates to each route, waits for network idle
 *   - Writes the rendered HTML to dist/<route>/index.html
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const PORT = 5000;
const ORIGIN = `http://localhost:${PORT}`;
const API_URL = process.env.VITE_API_URL || 'https://medi-production-5b91.up.railway.app/api/v1';
const DIST = path.resolve('dist');

const STATIC_ROUTES = [
  '/', '/products', '/about', '/services', '/contact', '/blog', '/projects',
  '/bulk-inquiry', '/kathmandu-medical-equipment-supplier',
  '/hospital-equipment-nepal', '/clinic-equipment-nepal', '/diagnostic-center-equipment-nepal',
  '/category/icu-equipment-nepal', '/category/surgical-instruments-nepal',
  '/category/patient-monitors-nepal', '/category/diagnostic-equipment-nepal',
  '/brand/mindray', '/brand/philips', '/brand/ge-healthcare', '/brand/drager', '/brand/bionet',
  '/blog/icu-ventilator-price-nepal-2025', '/blog/patient-monitor-buying-guide-nepal',
  '/blog/how-to-set-up-icu-nepal', '/blog/surgical-instruments-nepal',
  '/blog/medical-equipment-maintenance-nepal',
];

const fetchProductSlugs = async () => {
  try {
    const res = await fetch(`${API_URL}/products?limit=500`);
    const data = await res.json();
    return (data.products || []).map((p) => p.slug).filter(Boolean);
  } catch (err) {
    console.warn('Could not fetch product slugs:', err.message);
    return [];
  }
};

const startStaticServer = () =>
  new Promise((resolve, reject) => {
    const proc = spawn('npx', ['serve', '-s', 'dist', '-l', String(PORT)], { stdio: 'pipe' });
    const timeout = setTimeout(() => reject(new Error('serve start timeout')), 10_000);
    proc.stdout.on('data', (d) => {
      if (d.toString().includes('Accepting connections')) {
        clearTimeout(timeout);
        resolve(proc);
      }
    });
    proc.stderr.on('data', (d) => console.error('serve:', d.toString()));
  });

const snapshotRoute = async (browser, route) => {
  const page = await browser.newPage();
  try {
    await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle0', timeout: 30_000 });
    const html = await page.content();
    const outPath = path.join(DIST, route === '/' ? 'index.html' : `${route}/index.html`);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html);
    console.log('  ✓', route);
  } catch (err) {
    console.warn('  ✗', route, '—', err.message);
  } finally {
    await page.close();
  }
};

const main = async () => {
  console.log('Fetching product slugs from API…');
  const slugs = await fetchProductSlugs();
  const routes = [...STATIC_ROUTES, ...slugs.map((s) => `/products/${s}`)];
  console.log(`Will snapshot ${routes.length} routes.`);

  console.log('Starting static server…');
  const server = await startStaticServer();

  console.log('Launching Chromium…');
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of routes) {
      await snapshotRoute(browser, route);
    }
  } finally {
    await browser.close();
    server.kill();
  }
  console.log('Done.');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
