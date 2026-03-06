Delete articles older than N days from the database.

Input: $ARGUMENTS (number of days, default: 30 if not provided)

Steps:
1. Parse the number of days from input (default to 30 if empty)
2. Query Supabase `articles` table to count articles WHERE published_at < NOW() - INTERVAL 'N days'
3. Show the count to the user and ask for confirmation using AskUserQuestion with options "Yes, delete" and "No, cancel"
4. Only proceed with DELETE if user confirms
5. Report: "X articles deleted"

Never delete without explicit user confirmation.
