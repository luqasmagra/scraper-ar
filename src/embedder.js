import { pipeline } from '@xenova/transformers';
import supabase from './db.js';

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    console.log('  Cargando modelo de embeddings (primera vez puede tardar)...');
    embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
    console.log('  Modelo listo.');
  }
  return embedder;
}

export async function generateEmbedding(text, type = 'passage') {
  const model = await getEmbedder();
  const output = await model(`${type}: ${text}`, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

export async function embedPendingArticles(batchSize = 20) {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, summary, content')
    .is('embedding', null)
    .limit(batchSize);

  if (error) throw error;
  if (!articles.length) {
    console.log('  No hay artículos pendientes de embedding.');
    return 0;
  }

  console.log(`  Generando embeddings para ${articles.length} artículos...`);
  let count = 0;

  for (const article of articles) {
    const text = [article.title, article.summary, article.content]
      .filter(Boolean)
      .join('. ')
      .slice(0, 512);

    const embedding = await generateEmbedding(text);

    const { error: updateErr } = await supabase
      .from('articles')
      .update({ embedding })
      .eq('id', article.id);

    if (updateErr) {
      console.error(`  Error embedding artículo ${article.id}:`, updateErr.message);
    } else {
      count++;
      process.stdout.write(`\r  Progreso: ${count}/${articles.length}`);
    }
  }

  console.log(`\n  Embeddings generados: ${count}`);
  return count;
}
