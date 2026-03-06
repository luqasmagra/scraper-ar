Run a full scrape of all active news sources.

Steps:

1. Query the Supabase `sources` table to get all configured sources
2. For each source:
   a. Fetch the RSS/HTML feed
   b. Parse titles, URLs, summaries, and published dates
   c. Check for duplicates by URL against the Supabase `articles` table
   d. Insert only new articles
3. Report the final result:
   - X new articles added
   - Y duplicates skipped
   - Z errors (list source names that failed)

Constraints:

- Do not touch index.html or tabla sources de Supabase
- Do not modify DB schema
- Deduplicate by URL before every insert
