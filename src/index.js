import { fetchSources, scrapeRSS, scrapeHTML, saveArticles } from './scraper.js';
import { categorizeByKeywords, categorizeWithClaude, extractTags, simpleSummary } from './categorizer.js';
import { embedPendingArticles } from './embedder.js';
import { semanticSearch, fullTextSearch, printResults } from './search.js';

const [,, cmd, ...args] = process.argv;

async function runScrape() {
  console.log('=== Scraper de Noticias Deportivas AR ===\n');
  const sources = await fetchSources();
  console.log(`Fuentes activas: ${sources.length}\n`);

  let totalSaved = 0;

  for (const source of sources) {
    try {
      const raw = source.type === 'rss'
        ? await scrapeRSS(source)
        : await scrapeHTML(source);

      // Enriquecer con categoría, tags y resumen (secuencial para respetar rate limit)
      const enriched = [];
      for (const article of raw) {
        const claudeResult = await categorizeWithClaude(article.title, article.content);
        enriched.push({
          ...article,
          category: claudeResult?.category || categorizeByKeywords(article.title, article.content),
          summary:  claudeResult?.summary  || simpleSummary(article.content),
          tags:     extractTags(article.title, article.content),
        });
        // Delay para no exceder 50 req/min (~1.2s entre requests)
        if (process.env.ANTHROPIC_API_KEY) await new Promise(r => setTimeout(r, 1300));
      }

      const { saved, skipped } = await saveArticles(enriched);
      console.log(`  -> ${saved} guardados, ${skipped} duplicados\n`);
      totalSaved += saved;
    } catch (err) {
      console.error(`  ERROR en ${source.name}: ${err.message}\n`);
    }
  }

  console.log(`\nTotal guardados: ${totalSaved}`);
  console.log('\nGenerando embeddings...');
  await embedPendingArticles(50);
  console.log('\nListo.');
}

async function runEmbed() {
  console.log('=== Generador de Embeddings ===\n');
  await embedPendingArticles(100);
}

async function runSearch() {
  const query = args.join(' ') || 'Messi gol';
  const mode  = process.env.SEARCH_MODE || 'semantic';

  if (mode === 'fulltext') {
    const results = await fullTextSearch(query);
    printResults(results);
  } else {
    const results = await semanticSearch(query, { threshold: 0.35, limit: 10 });
    printResults(results);
  }
}

const commands = { scrape: runScrape, embed: runEmbed, search: runSearch };
const fn = commands[cmd];

if (!fn) {
  console.log('Uso:');
  console.log('  node src/index.js scrape          # Scrapea todas las fuentes');
  console.log('  node src/index.js embed           # Genera embeddings pendientes');
  console.log('  node src/index.js search <query>  # Búsqueda semántica');
  process.exit(0);
}

fn().catch((err) => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
