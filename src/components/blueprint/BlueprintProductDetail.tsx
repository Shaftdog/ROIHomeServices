import { CheckCircle2, MapPin } from 'lucide-react';
import { formatUsd, type BlueprintProduct } from '@/lib/blueprint-catalog';
import { blueprintProductCopy } from '@/data/blueprint-product-copy';
import BlueprintBuyButton from './BlueprintBuyButton';

interface BlueprintProductDetailProps {
  product: BlueprintProduct;
}

/**
 * Deeper section for one ladder rung.
 *
 * Everything rendered is either a catalog fact (name, step, phase, price,
 * description) or copy Rod has confirmed in src/data/blueprint-product-copy.ts.
 * That file is empty today, so these sections show catalog facts only — no
 * invented deliverable lists, turnarounds, or guarantees.
 */
export default function BlueprintProductDetail({ product }: BlueprintProductDetailProps) {
  const copy = blueprintProductCopy[product.sku];

  return (
    <article
      id={`detail-${product.sku.toLowerCase()}`}
      className="scroll-mt-24 border-t border-border py-10 first:border-t-0 first:pt-0"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {product.step !== null && (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {product.step}
              </span>
            )}
            <h3 className="text-2xl font-bold">{product.name}</h3>
          </div>

          {product.phase && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-light-gray px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Fires during: {product.phase}
            </p>
          )}

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {copy?.body && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {copy.body}
            </p>
          )}

          {copy?.deliverables && copy.deliverables.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wide">What you get</h4>
              <ul className="mt-3 space-y-2">
                {copy.deliverables.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-highlight"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {copy?.clientProvides && copy.clientProvides.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wide">What you provide</h4>
              <ul className="mt-3 space-y-2">
                {copy.clientProvides.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="lg:pt-2">
          <div className="rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-3xl font-bold text-accent">{formatUsd(product.amountCents)}</p>
            <BlueprintBuyButton
              sku={product.sku}
              label="Order this step"
              className="mt-4"
            />
          </div>
        </aside>
      </div>
    </article>
  );
}
