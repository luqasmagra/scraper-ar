Show a full status report of the news scraper project.

Steps:
1. Query Supabase `articles` table: count grouped by category
2. Query Supabase `sources` table: count WHERE active = true
3. Query Supabase `articles` table: last 5 records ordered by scraped_at DESC (return title, url, scraped_at)
4. Check for any sources that haven't produced articles in the last 7 days

Return the report in this format:

## Articles by category
| Category | Count |
|---|---|
| ... | ... |

## Active sources
X sources configured and active

## Last 5 scraped articles
| Title | Date |
|---|---|
| ... | ... |

## Source health
List any sources with no articles in the last 7 days
