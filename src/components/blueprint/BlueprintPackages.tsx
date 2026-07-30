import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  formatUsd,
  sumAmountCents,
  type BlueprintProduct,
} from '@/lib/blueprint-catalog';
import { BOOKING_PATH } from '@/lib/blueprint-config';
import BlueprintBuyButton from './BlueprintBuyButton';

interface BlueprintPackagesProps {
  packages: BlueprintProduct[];
  ladder: BlueprintProduct[];
  addons: BlueprintProduct[];
}

/**
 * Every figure here is arithmetic on the catalog's individual prices — nothing is
 * asserted.
 *
 * IMPORTANT: the catalog does not record which components each package contains,
 * so this is deliberately framed as a PRICE comparison against an à-la-carte
 * reference total, never as "you get all of this for less". A package is measured
 * against the smallest reference it comes in under; when it comes in under
 * neither, we say so instead of manufacturing a savings number.
 */
function comparison(
  pkg: BlueprintProduct,
  ladderTotalCents: number,
  ladderPlusAddonsCents: number
): { label: string; differenceCents: number } | null {
  if (pkg.amountCents < ladderTotalCents) {
    return {
      differenceCents: ladderTotalCents - pkg.amountCents,
      label: `below the ${formatUsd(ladderTotalCents)} five-step à-la-carte total`,
    };
  }
  if (pkg.amountCents < ladderPlusAddonsCents) {
    return {
      differenceCents: ladderPlusAddonsCents - pkg.amountCents,
      label: `below the ${formatUsd(ladderPlusAddonsCents)} total for the five steps plus both add-ons`,
    };
  }
  return null;
}

export default function BlueprintPackages({
  packages,
  ladder,
  addons,
}: BlueprintPackagesProps) {
  const ladderTotalCents = sumAmountCents(ladder);
  const ladderPlusAddonsCents = ladderTotalCents + sumAmountCents(addons);

  return (
    <div>
      <div className="mx-auto mb-8 grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">All five steps, bought individually</p>
          <p className="mt-1 text-2xl font-bold">{formatUsd(ladderTotalCents)}</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Five steps plus both add-ons, bought individually
          </p>
          <p className="mt-1 text-2xl font-bold">{formatUsd(ladderPlusAddonsCents)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {packages.map((pkg) => {
          const compare = comparison(pkg, ladderTotalCents, ladderPlusAddonsCents);
          const hasWebinarPrice =
            pkg.webinarAmountCents !== null && pkg.webinarAmountCents !== pkg.amountCents;

          return (
            <Card
              key={pkg.sku}
              id={`product-${pkg.sku.toLowerCase()}`}
              className={`flex h-full scroll-mt-24 flex-col ${
                pkg.flagship ? 'border-accent shadow-lg ring-1 ring-accent/30' : ''
              }`}
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{pkg.name}</h3>
                  {pkg.flagship && (
                    <span className="shrink-0 rounded-full bg-highlight px-2.5 py-0.5 text-xs font-semibold text-highlight-foreground">
                      Flagship
                    </span>
                  )}
                </div>

                <p className="mt-3 text-3xl font-bold text-accent">
                  {formatUsd(pkg.amountCents)}
                </p>
                {hasWebinarPrice && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Webinar price{' '}
                    <span className="font-semibold text-foreground">
                      {formatUsd(pkg.webinarAmountCents as number)}
                    </span>
                  </p>
                )}

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {pkg.description}
                </p>

                <div className="mt-4 flex-1">
                  {compare ? (
                    <div className="rounded-lg bg-highlight/10 p-3">
                      <p className="text-sm font-semibold">
                        {formatUsd(compare.differenceCents)} {compare.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Price comparison only &mdash; not a statement of what this package
                        includes.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-light-gray p-3">
                      <p className="text-xs text-muted-foreground">
                        This tier&rsquo;s contents aren&rsquo;t itemized in the catalog, so
                        there&rsquo;s no à-la-carte comparison to show. Book a call to confirm
                        scope before you buy.
                      </p>
                    </div>
                  )}
                </div>

                <BlueprintBuyButton
                  sku={pkg.sku}
                  label={`Buy — ${formatUsd(pkg.amountCents)}`}
                  variant={pkg.flagship ? 'highlight' : 'default'}
                  className="mt-6"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-foreground">
        Comparisons above are arithmetic on the individual step and add-on prices on
        this page. Each package includes what its own description states.{' '}
        <Button asChild variant="link" className="h-auto p-0 text-xs">
          <a href={BOOKING_PATH}>Questions about scope? Book a call.</a>
        </Button>
      </p>
    </div>
  );
}
