// Categorización por keywords (sin API key)
// Cuando ANTHROPIC_API_KEY esté disponible, usa Claude para mayor precisión.

const CATEGORIES = {
  'Fútbol': [
    'fútbol', 'futbol', 'gol', 'liga', 'copa', 'selección', 'seleccion',
    'argentina', 'river', 'boca', 'racing', 'independiente', 'san lorenzo',
    'huracán', 'vélez', 'estudiantes', 'talleres', 'belgrano', 'newells',
    'rosario central', 'premier league', 'champions', 'laliga', 'serie a',
    'eliminatorias', 'mundial', 'dt', 'técnico', 'entrenador', 'delantero',
    'defensor', 'portero', 'arquero', 'fixture', 'clásico', 'superclásico',
    'goleador', 'transferencia', 'pase', 'contrato', 'mercado de pases',
    'messi', 'di maría', 'lautaro', 'julián álvarez', 'dybala', 'de paul',
  ],
  'Tenis': [
    'tenis', 'atp', 'wta', 'grand slam', 'wimbledon', 'roland garros',
    'us open', 'australian open', 'djokovic', 'alcaraz', 'nadal', 'federer',
    'set', 'match', 'break', 'slam', 'ranking atp', 'ranking wta',
    'schwartzman', 'pella', 'zeballos', 'pereira',
  ],
  'Básquet': [
    'básquet', 'basquet', 'basketball', 'nba', 'liga nacional', 'fiba',
    'americup', 'la liga argentina', 'triple', 'enceste', 'rebote',
    'facundo campazzo', 'luca vildoza', 'nicolas laprovittola', 'peñarol',
    'instituto', 'regatas', 'san lorenzo básquet',
  ],
  'Rugby': [
    'rugby', 'los pumas', 'pumas', 'six nations', 'rugby championship',
    'world rugby', 'scrum', 'tackle', 'try', 'uar', 'unión argentina',
    'super rugby', 'buenos aires cricket', 'leandro desio',
  ],
  'Automovilismo': [
    'formula 1', 'fórmula 1', 'f1', 'moto gp', 'rally', 'tc2000',
    'turismo carretera', 'verstappen', 'hamilton', 'sainz', 'leclerc',
    'colapinto', 'pitstop', 'clasificación', 'gran premio', 'circuito',
    'ferrari', 'mercedes', 'red bull racing',
  ],
  'Boxeo': [
    'boxeo', 'box', 'pelea', 'combate', 'nocaut', 'ko', 'tko',
    'campeonato mundial', 'wbc', 'wba', 'ibf', 'peso pesado', 'peso ligero',
    'maravilla martínez', 'charlo', 'canelo',
  ],
  'Atletismo': [
    'atletismo', 'maratón', 'maraton', 'velocidad', 'salto', 'lanzamiento',
    'juegos olímpicos', 'olimpiadas', 'paris 2024', 'los angeles 2028',
    'record mundial', 'medalla de oro', 'podio',
  ],
  'Hockey': [
    'hockey', 'las leonas', 'los leones', 'palo', 'stick', 'pro league',
    'champions trophy', 'aymar', 'retegui',
  ],
};

const ALL_KEYWORDS = Object.entries(CATEGORIES).flatMap(([cat, kws]) =>
  kws.map((kw) => ({ kw: kw.toLowerCase(), cat }))
);

export function categorizeByKeywords(title = '', content = '') {
  const text = (title + ' ' + content).toLowerCase();
  const scores = {};

  for (const { kw, cat } of ALL_KEYWORDS) {
    if (text.includes(kw)) {
      scores[cat] = (scores[cat] || 0) + (title.toLowerCase().includes(kw) ? 3 : 1);
    }
  }

  if (!Object.keys(scores).length) return 'Deportes';
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

export function extractTags(title = '', content = '') {
  const text = (title + ' ' + content).toLowerCase();
  const tags = new Set();

  for (const { kw, cat: _ } of ALL_KEYWORDS) {
    if (kw.length > 4 && text.includes(kw)) tags.add(kw);
  }

  return [...tags].slice(0, 8);
}

// Summarizador simple: primeras 2 oraciones del contenido
export function simpleSummary(content = '') {
  if (!content) return null;
  const sentences = content
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 2).join(' ').slice(0, 300) || null;
}

// Claude categorizer (usa esto cuando tengas ANTHROPIC_API_KEY)
export async function categorizeWithClaude(title, content) {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const categories = Object.keys(CATEGORIES).join(', ');
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    messages: [{
      role: 'user',
      content: `Dado este artículo deportivo argentino, responde SOLO con:
1. La categoría más apropiada de: ${categories}, Deportes
2. Un resumen en 1 oración (máx 100 caracteres)

Formato: CATEGORIA|RESUMEN

Título: ${title}
Contenido: ${content?.slice(0, 400) || ''}`,
    }],
  });

  const [category, summary] = msg.content[0].text.trim().split('|');
  const validCategories = [...Object.keys(CATEGORIES), 'Deportes'];
  const cat = category?.trim();
  return {
    category: validCategories.includes(cat) ? cat : null,
    summary:  summary?.trim() || null,
  };
}
