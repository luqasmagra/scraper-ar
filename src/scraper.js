import RSSParser from 'rss-parser';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import supabase from './db.js';

const parser = new RSSParser({
  customFields: { item: ['media:content', 'media:thumbnail', 'dc:creator'] },
  timeout: 10000,
});

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; NewsScraper/1.0)',
  Accept: 'application/rss+xml, application/xml, text/xml, */*',
};

export async function fetchSources() {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('active', true);
  if (error) throw error;
  return data;
}

export async function scrapeRSS(source) {
  console.log(`  Fetching RSS: ${source.name}`);
  const feed = await parser.parseURL(source.url);
  return feed.items
    .map((item) => ({
      source_id: source.id,
      title: item.title?.trim() || '',
      url: item.link || item.guid || '',
      content: item.contentSnippet || item.content || item.summary || '',
      author: item['dc:creator'] || item.creator || null,
      published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
    }))
    .filter((a) => a.url && a.title);
}

export async function scrapeHTML(source) {
  console.log(`  Fetching HTML: ${source.name}`);
  const res = await fetch(source.url, { headers: HEADERS, timeout: 15000 });
  const html = await res.text();
  const $ = cheerio.load(html);
  const articles = [];

  // Selectores genéricos para portadas de noticias
  $(
    'article, .post, .news-item, .article-item, [class*="article"], [class*="nota"]',
  ).each((_, el) => {
    const $el = $(el);
    const titleEl = $el.find('h1, h2, h3, .title, [class*="title"]').first();
    const linkEl = $el.find('a[href]').first();
    const title = titleEl.text().trim();
    const href = linkEl.attr('href') || '';
    const url = href.startsWith('http') ? href : new URL(href, source.url).href;
    const content = $el
      .find('p')
      .map((_, p) => $(p).text().trim())
      .get()
      .join(' ');

    if (title && url) {
      articles.push({
        source_id: source.id,
        title,
        url,
        content,
        published_at: null,
      });
    }
  });

  return articles;
}

export async function saveArticles(articles) {
  if (!articles.length) return { saved: 0, skipped: 0 };

  const { data, error } = await supabase
    .from('articles')
    .upsert(articles, { onConflict: 'url', ignoreDuplicates: true })
    .select('id');

  if (error) throw error;
  return {
    saved: data?.length || 0,
    skipped: articles.length - (data?.length || 0),
  };
}
