# News Scraper & Analyzer

## Project Overview

Scrape news sources and blogs, extract relevant articles, categorize them,
and store them in Supabase. Frontend allows searching and filtering articles.

## Database (Supabase)

Project ref: aqkymmcfktldheqgckja

### Tables

- `articles`: scraped articles (id, source_id, title, summary, url, category, keywords, published_at, scraped_at)
- `sources`: configured news sources (id, name, url, type, category, active)

---

## ⚠️ BEHAVIORAL RULES (MUST FOLLOW — NEVER IGNORE)

These rules are non-negotiable and apply to every single action taken in this project.

1. **NEVER change the overall architecture or approach unless explicitly asked.**
   If there is a bug or error, fix ONLY that specific issue. Do not refactor, restructure,
   or change the tech stack as a side effect of fixing a bug.

2. **NEVER rewrite a file from scratch to fix a small problem.**
   Apply surgical, minimal edits. If a function is broken, fix that function only.

3. **When you find an error, state exactly:**
   - What the error is
   - What file and line it's in
   - What the fix is (one sentence)
   - Then apply the fix — nothing else.

4. **Do not add unrequested features.**
   If a fix would benefit from a refactor or new feature, mention it as a suggestion
   AFTER completing the fix, not as part of it.

5. **Before ANY edit, read the current file state.**
   Never assume what's in a file. Always read it first.

6. **Confirm before deleting or overwriting any existing functionality.**
   Ask: "This will remove/replace X. Confirm?"

7. **If something is ambiguous, ask ONE clarifying question before acting.**
   Do not make assumptions and do not proceed with guesses.

8. **When verifying external URLs or feeds, try ONCE only.**
   If the fetch fails for any reason, discard that source and move on.
   Never retry in a loop or search recursively for alternative URLs.

9. **ALWAYS ask for explicit confirmation before any architectural change using AskUserQuestion.**
   An architectural change includes: adding/removing files, adding dependencies,
   changing how components communicate, modifying DB schema, switching libraries,
   or changing the search/scraping approach.
   Format: Use the AskUserQuestion tool with two options: "Yes, proceed" and "No, cancel".
   Do NOT proceed until the user selects "Yes, proceed".

---

## Agents & Commands

Agent definitions live in `.claude/agents/`. Commands live in `.claude/commands/`.
Only one agent acts at a time. Select the agent based on the trigger.

| Agent                | Trigger keywords                                                                 |
| -------------------- | -------------------------------------------------------------------------------- |
| `scraper`            | "scrape", "fetch sources", "pull news", "update articles"                        |
| `database-manager`   | "create table", "migrate", "fix schema", "add column", "query DB"                |
| `frontend-developer` | "fix UI", "update the search", "change the layout", "add filter", "frontend bug" |
| `debugger`           | "error", "bug", "broken", "not working", "fix this"                              |
| `reporter`           | "how many articles", "stats", "summary", "what do we have"                       |

Available commands: `/scrape-all` `/search-articles` `/add-source` `/cleanup-old` `/debug-fix` `/status`

---

## Tech Stack (DO NOT CHANGE WITHOUT EXPLICIT REQUEST)

- **Frontend:** Plain HTML + Vanilla JS + Supabase JS client (CDN)
- **Data layer:** Supabase (PostgreSQL via MCP)
- **Scraping:** fetch MCP → RSS XML parsing
- **Config:** tabla sources de Supabase (flat file, no DB dependency for source list)

## File Structure

```
scraper-ar/
├── CLAUDE.md
├── tabla sources de Supabase
├── index.html        ← frontend (single file, no build tools)
└── README.md
```

## Key Constraints

- No build tools (no webpack, vite, npm). Frontend is a single HTML file.
- No backend server. Everything runs via MCPs and Supabase JS client.
- RSS parsing is done inline with DOMParser — no external XML libraries.
