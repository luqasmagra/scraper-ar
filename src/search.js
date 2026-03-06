import { generateEmbedding } from './embedder.js';
import supabase from './db.js';

/**
 * Búsqueda semántica: convierte la query en embedding y busca por similitud coseno.
 */
export async function semanticSearch(query, { limit = 10, category } = {}) {
  console.log(`\nBuscando: "${query}"`);
  const embedding = await generateEmbedding(query, 'query');

  const { data, error } = await supabase.rpc('search_articles', {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: limit,
    filter_category: category || null,
  });

  if (error) throw error;
  return data || [];
}

/**
 * Búsqueda full-text en español (sin embedding, más rápida).
 */
export async function fullTextSearch(query, { limit = 10, category } = {}) {
  let q = supabase
    .from('articles')
    .select('id, title, url, summary, category, published_at')
    .textSearch('title', query, { type: 'websearch', config: 'spanish' })
    .limit(limit);

  if (category) q = q.eq('category', category);

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export function printResults(results) {
  if (!results.length) {
    console.log('  Sin resultados.');
    return;
  }
  console.log(`\n${results.length} resultado(s):\n`);
  results.forEach((r, i) => {
    const sim = r.similarity ? ` [${(r.similarity * 100).toFixed(1)}%]` : '';
    const date = r.published_at
      ? new Date(r.published_at).toLocaleDateString('es-AR')
      : '';
    console.log(`${i + 1}. [${r.category || '?'}]${sim} ${r.title}`);
    if (r.summary) console.log(`   ${r.summary}`);
    console.log(`   ${r.url}  ${date}\n`);
  });
}
