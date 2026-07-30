import { Card, CardContent } from '@/components/ui/card';
import { formatUsd, type BlueprintProduct } from '@/lib/blueprint-catalog';
import BlueprintBuyButton from './BlueprintBuyButton';

interface BlueprintProductTileProps {
  product: BlueprintProduct;
  /** Emphasize the tile (used for the catalog's flagship package). */
  featured?: boolean;
}

/**
 * One product. Every number rendered here comes from the server-side catalog —
 * no price is hardcoded, and the tile shows a webinar price only when the catalog
 * defines one for that SKU.
 */
export default function BlueprintProductTile({
  product,
  featured = false,
}: BlueprintProductTileProps) {
  const hasWebinarPrice =
    product.webinarAmountCents !== null && product.webinarAmountCents !== product.amountCents;

  return (
    <Card
      id={`product-${product.sku.toLowerCase()}`}
      className={`flex h-full scroll-mt-24 flex-col ${
        featured ? 'border-accent shadow-lg ring-1 ring-accent/30' : ''
      }`}
    >
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          {featured && (
            <span className="shrink-0 rounded-full bg-highlight px-2.5 py-0.5 text-xs font-semibold text-highlight-foreground">
              Flagship
            </span>
          )}
        </div>

        {product.step !== null && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Step {product.step}
            {product.phase ? ` · ${product.phase}` : ''}
          </p>
        )}

        <p className="mt-3 text-3xl font-bold text-accent">{formatUsd(product.amountCents)}</p>
        {hasWebinarPrice && (
          <p className="mt-1 text-sm text-muted-foreground">
            Webinar price{' '}
            <span className="font-semibold text-foreground">
              {formatUsd(product.webinarAmountCents as number)}
            </span>
          </p>
        )}

        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <BlueprintBuyButton
          sku={product.sku}
          label={`Buy — ${formatUsd(product.amountCents)}`}
          variant={featured ? 'highlight' : 'default'}
          className="mt-6"
        />
      </CardContent>
    </Card>
  );
}
