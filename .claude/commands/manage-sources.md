Manage news sources in the Supabase `sources` table.

Input: $ARGUMENTS (format: "subcommand [arguments]")

## Subcommands

### list

Show all sources with their current status.
Query: SELECT id, name, url, type, category, active FROM sources ORDER BY active DESC, name ASC
Output as a markdown table with columns: ID, Name, URL, Type, Category, Active

### toggle "name"

Activate or deactivate a source by name.

1. Query sources WHERE name ILIKE '%name%'
2. Flip the `active` boolean value
3. Confirm: "Source [name] is now [active/inactive]"

### remove "name"

Delete a source permanently.

1. Query sources WHERE name ILIKE '%name%' to confirm it exists
2. Ask for confirmation using AskUserQuestion with options "Yes, delete" and "No, cancel"
3. Only DELETE after confirmation
4. Confirm: "Source [name] removed"

### edit "name" field=value

Edit a field of an existing source.
Editable fields: name, url, type, category, active

1. Query sources WHERE name ILIKE '%name%'
2. UPDATE the specified field
3. Confirm: "Source [name] updated: [field] = [value]"

## Usage examples

- `/manage-sources list`
- `/manage-sources toggle "TechCrunch"`
- `/manage-sources remove "TechCrunch"`
- `/manage-sources edit "TechCrunch" category=science`
