# Billionaire Blueprint landing page — setup

Route: `/billionaire-blueprint`

The page renders the Billionaire Appraisal Platform catalog (SKUs `BAP-%`) out of the
Salesmod CRM `products` table. **No price is hardcoded in any component** — the page
and the checkout route both resolve amounts server-side from that catalog by SKU.

`.gitignore` ignores `.env*`, so a local `.env.example` is not tracked. This file is
the tracked list of variables the page needs.

## Environment variables

### Catalog (server-side only — never `NEXT_PUBLIC_*`)

| Variable | Required | Notes |
| --- | --- | --- |
| `SALESMOD_SUPABASE_URL` | yes | `https://<project-ref>.supabase.co` |
| `SALESMOD_SUPABASE_SERVICE_ROLE_KEY` | yes | `products` has tenant-scoped RLS for `authenticated`, so the anon key returns `[]`. Reads only. |
| `SALESMOD_CATALOG_TENANT_ID` | no | The service role bypasses RLS; set this to pin the catalog to one tenant. |

Access is read-only: `src/lib/blueprint-catalog.ts` only ever issues `GET`s against
PostgREST, filtered to `sku=like.BAP-%`, `is_active=true`, `deleted_at is null`.

### Media slots (unset renders an honest empty state, never a placeholder)

| Variable | Effect when unset |
| --- | --- |
| `NEXT_PUBLIC_BLUEPRINT_HERO_VIDEO_URL` | Hero slot shows "Intro video — hasn't been posted yet". |
| `NEXT_PUBLIC_BLUEPRINT_EXPLAINER_VIDEO_URL` | Explainer slot shows the same neutral state. |
| `NEXT_PUBLIC_WEBINAR_URL` | Floating button falls back to `/book` and relabels itself, so it is never a dead link. |

Both video vars accept an embed URL (iframe) or a direct `.mp4`/`.webm` (native player).

### ROI Assistant chat

| Variable | Effect when unset |
| --- | --- |
| `ANTHROPIC_API_KEY` | Widget states plainly that it isn't connected and offers a call with Rod. It never serves a canned answer as a real one. |
| `BLUEPRINT_CHAT_MODEL` | Defaults to `claude-sonnet-5`. |

### Checkout

| Variable | Notes |
| --- | --- |
| `STRIPE_SECRET_KEY` | Already configured for the rest of the site. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for Stripe success/cancel URLs. Defaults to `https://www.roihomesvc.com`. Deliberately not derived from the request `Host` header. |

## Slots still awaiting real content

- **Videos** — both slots are empty; see the env vars above.
- **Testimonials** — `src/data/blueprint-testimonials.ts` is an intentionally empty
  array. The section renders nothing while it is empty. Add real, verbatim,
  permission-granted quotes only.
- **Per-product deep copy** — `src/data/blueprint-product-copy.ts` is intentionally
  empty. Detail sections currently show catalog facts only (name, step, phase,
  price, description). Add deliverables per SKU once Rod confirms the wording.
- **Webinar URL** — does not exist yet.
