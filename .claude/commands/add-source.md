Add a new news source to the project.

Input: $ARGUMENTS (format: "name | url | type | category")

- type: rss or html
- category: e.g. tech, politics, science, sports

Steps:

1. Parse the input to extract name, url, type, category
2. Check if the URL already exists in Supabase — if so, stop and report duplicate
3. If type is `rss`: fetch the URL once to verify it is a valid feed
   - If fetch succeeds → proceed
   - If fetch fails for ANY reason → discard this source, report it, move to next. DO NOT retry or search for alternative URLs.
4. Insert the source into the Supabase `sources` table (active = true)
5. Confirm: "Source [name] added successfully" or "Source [name] discarded: [reason]"
