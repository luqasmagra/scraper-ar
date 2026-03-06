# scraper-ar

Experimento con Claude Code — scraper de noticias deportivas argentinas.

## Qué hace

- Scrapea fuentes RSS de deportes AR
- Categoriza artículos con Claude Haiku
- Genera embeddings semánticos para búsqueda por similitud
- Frontend en HTML puro para buscar y filtrar artículos

## Stack

- **Frontend:** HTML + Vanilla JS + Supabase JS (CDN)
- **Scraping:** Node.js + rss-parser + cheerio
- **IA:** Claude Haiku (categorización) + embeddings multilingües
- **DB:** Supabase (PostgreSQL + pgvector)

## Uso

```bash
npm run scrape      # scrapea todas las fuentes
npm run embed       # genera embeddings pendientes
npm run search <q>  # búsqueda semántica por CLI
```

Abrir `index.html` en el browser para la interfaz web.
