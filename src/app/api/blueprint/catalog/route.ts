import { NextRequest, NextResponse } from 'next/server';
import { withRouteLogging } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import {
  CatalogUnavailableError,
  fetchBlueprintCatalog,
  type BlueprintProduct,
} from '@/lib/blueprint-catalog';

/**
 * GET /api/blueprint/catalog
 *
 * Public, read-only projection of the Billionaire Appraisal Platform catalog
 * (SKUs `BAP-%`) from the Salesmod CRM. The landing page renders every price from
 * this response — no dollar amount is hardcoded in a component.
 *
 * Only the fields below are serialized. Internal catalog fields
 * (production_template_id, tenant_id, org_id) are intentionally never exposed.
 */

const catalogLogger = createChildLogger({ context: LOG_CONTEXTS.API });

// `withRouteLogging` reads the request off args[0]; the handler itself needs no
// input — the catalog takes no parameters.
async function handleGetCatalog(_req: NextRequest) {
  try {
    const products: BlueprintProduct[] = await fetchBlueprintCatalog();

    return NextResponse.json(
      { products },
      {
        // Mirrors the 5-minute revalidate on the underlying read: cheap for the
        // CDN, still picks up a Salesmod price change quickly.
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
      }
    );
  } catch (error) {
    if (error instanceof CatalogUnavailableError) {
      catalogLogger.warn({ err: error }, 'BAP catalog unavailable');
      // 503, not an empty 200: the page must be able to tell "no products" from
      // "we could not read pricing" and say so honestly.
      return NextResponse.json({ error: 'Catalog unavailable' }, { status: 503 });
    }

    catalogLogger.error({ err: error }, 'Unexpected error reading BAP catalog');
    return NextResponse.json({ error: 'Failed to read catalog' }, { status: 500 });
  }
}

export const GET = withRouteLogging(handleGetCatalog);
