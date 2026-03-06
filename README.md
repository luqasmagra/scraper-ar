# scraper-ar

- Scrapes RSS feeds from sources
- Categorizes articles using Claude Haiku
- Generates semantic embeddings for similarity search
- Plain HTML frontend to search and filter articles

- HTML + Vanilla JS + Supabase JS (CDN)
- Node.js + rss-parser + cheerio
- Claude Haiku (categorization) + multilingual embeddings
- Supabase (PostgreSQL + pgvector)

```bash
npm run scrape      # scrape all sources
npm run embed       # generate pending embeddings
npm run search <q>  # semantic search via CLI
```

Open `index.html` in the browser for the web interface.
