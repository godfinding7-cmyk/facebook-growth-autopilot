import Parser from 'rss-parser';
import crypto from 'node:crypto';

const parser = new Parser({ timeout: 10000 });

function scoreItem(item) {
  const published = item.isoDate ? new Date(item.isoDate).getTime() : Date.now();
  const ageHours = Math.max(0, (Date.now() - published) / 36e5);
  const freshness = Math.max(0, 100 - ageHours * 2.5);
  const titleSignal = Math.min(20, Math.round((item.title || '').length / 6));
  return Math.max(1, Math.min(99, Math.round(freshness * 0.8 + titleSignal)));
}

export async function fetchTrends() {
  const feeds = (process.env.RSS_FEEDS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!feeds.length) return [];

  const all = [];
  for (const url of feeds.slice(0, 5)) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of (feed.items || []).slice(0, 15)) {
        const title = (item.title || 'Untitled').trim();
        all.push({
          id: crypto.createHash('sha1').update(`${title}|${item.link || ''}`).digest('hex').slice(0, 12),
          title,
          source: feed.title || new URL(url).hostname,
          sourceUrl: item.link || null,
          publishedAt: item.isoDate || item.pubDate || null,
          score: scoreItem(item),
          status: 'candidate'
        });
      }
    } catch (error) {
      console.error('RSS error:', url, error.message);
    }
  }

  const seen = new Set();
  return all
    .sort((a, b) => b.score - a.score)
    .filter(x => {
      const key = x.title.toLowerCase().replace(/\W+/g, ' ').trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 30);
}
