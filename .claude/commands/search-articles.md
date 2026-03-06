Search for articles by keyword or category.

Input: $ARGUMENTS (keyword or category name)

Steps:
1. Query Supabase `articles` table:
   - If input looks like a category: WHERE category = '$ARGUMENTS'
   - Otherwise: WHERE title ILIKE '%$ARGUMENTS%' OR summary ILIKE '%$ARGUMENTS%'
2. Order by published_at DESC, limit 10
3. Return results as a markdown table with columns:
   - Title
   - Source
   - Category
   - Date
   - URL
