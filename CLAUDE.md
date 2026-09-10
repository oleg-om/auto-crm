# Project rules

## UI components: use shadcn/ui

New or redesigned screens MUST be built with **shadcn/ui** components, not raw HTML controls or ad-hoc Tailwind markup.

- Reusable primitives live in `client/components/ui/*` (`Button`, `Input`, `Select`, `Checkbox`, `Card`, `Dialog`, `AlertDialog`, `Table`, `Pagination`, `Badge`, `Label`, `Combobox`, `CollapsibleCard`, etc.). Use these instead of `<button>`, `<input>`, `<select>`, plain `<table>`, etc.
- If a needed primitive doesn't exist yet, add it to `client/components/ui/` following the same pattern (Radix primitive where applicable, `cn()` from `client/lib/utils` for class merging, `React.forwardRef`) rather than writing one-off styled elements inline.
- Styling follows the shadcn design tokens defined in `client/assets/scss/main.scss` (`--background`, `--card`, `--muted`, `--border`, etc.) via the `bg-*`/`text-*`/`border-*` Tailwind classes those components already use - don't hardcode hex colors for these components.
- Reference implementations of this pattern: `client/scenes/Employees/Employees.list.tsx` + `client/components/employees/employee.form.tsx`, and `client/scenes/Places/Places.list.tsx` + `client/components/places/place.form.tsx`. New list/form screens (search + sortable table + pagination + create/edit in a `Dialog`, collapsible `CollapsibleCard` sections) should follow the same structure.

This project has no `components.json` / shadcn CLI setup - primitives were added by hand under `client/components/ui/`. Keep new ones consistent with the existing ones instead of running the CLI.
