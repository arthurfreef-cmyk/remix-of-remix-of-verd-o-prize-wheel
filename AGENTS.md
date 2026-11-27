<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Funnel
- Guest shipping checkout calls Velani through client-safe server functions; signed intents bind the customer, prize, size and idempotency key, and status reads require a signed receipt. Why: keep credentials server-only, prevent duplicate retries, and confirm payment with the provider rather than the browser.
- Funnel steps (home → quiz → wheel → result → claim → done) live as client state in src/routes/index.tsx; screens in src/components/funnel. Why: single-page funnel copied from the Verdão Prize Wheel project.
- Wheel outcomes are scripted in src/data/funnel.ts (targetForSpin): spin 1 = "Tente novamente", spin 2 = main prize; covered by src/test/funnel.test.ts. Why: deterministic funnel flow.
