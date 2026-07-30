import { ArrowRight, Repeat } from 'lucide-react';
import { formatUsd, type BlueprintProduct } from '@/lib/blueprint-catalog';

interface BlueprintLifecycleProps {
  tripwire: BlueprintProduct[];
  ladder: BlueprintProduct[];
  addons: BlueprintProduct[];
}

interface PhaseSegment {
  phase: string;
  steps: BlueprintProduct[];
}

/**
 * Group the ladder into lifecycle phases, in step order. The phase labels come
 * from the catalog (`props.phase`) — nothing here is invented, and a phase change
 * in Salesmod reshapes the graphic on its own.
 */
function buildPhaseSegments(ladder: BlueprintProduct[]): PhaseSegment[] {
  const segments: PhaseSegment[] = [];

  for (const product of ladder) {
    const phase = product.phase ?? 'Later in the deal';
    const current = segments[segments.length - 1];
    if (current && current.phase === phase) {
      current.steps.push(product);
    } else {
      segments.push({ phase, steps: [product] });
    }
  }

  return segments;
}

/**
 * Where each product fires across the life of a deal. The five ladder rungs are
 * the spine; the tripwire sits before Step 1 and the add-ons run alongside.
 *
 * The rail is wide by nature, so it scrolls inside its own container rather than
 * making the page scroll sideways.
 */
export default function BlueprintLifecycle({
  tripwire,
  ladder,
  addons,
}: BlueprintLifecycleProps) {
  const segments = buildPhaseSegments(ladder);

  return (
    <div>
      <div
        className="overflow-x-auto pb-4"
        tabIndex={0}
        role="group"
        aria-label="Deal lifecycle timeline — scroll horizontally to see every stage"
      >
        <div className="flex min-w-[62rem] items-stretch gap-6">
          {/* Before Step 1 — the tripwire */}
          {tripwire.length > 0 && (
            <div className="flex w-60 shrink-0 flex-col">
              <p className="flex h-7 items-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Before you commit
              </p>
              <div className="mt-3 flex flex-1 flex-col gap-3">
                {tripwire.map((product) => (
                  <div
                    key={product.sku}
                    className="flex h-full flex-col rounded-xl border border-highlight/60 bg-highlight/10 p-4"
                  >
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="mt-1 text-lg font-bold text-accent">
                      {formatUsd(product.amountCents)}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tripwire.length > 0 && (
            <div className="flex shrink-0 items-center pt-7" aria-hidden="true">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          {/* The five ladder steps, banded by lifecycle phase */}
          <div className="flex flex-1 flex-col">
            <div className="flex h-7 gap-3">
              {segments.map((segment) => (
                <div
                  key={segment.phase}
                  style={{ flexGrow: segment.steps.length, flexBasis: 0 }}
                  className="flex items-center justify-center rounded-md bg-accent/10 px-2 text-xs font-semibold uppercase tracking-wide text-accent"
                >
                  {segment.phase}
                </div>
              ))}
            </div>

            <ol className="mt-3 flex flex-1 gap-3">
              {ladder.map((product) => (
                <li key={product.sku} className="flex flex-1 basis-0">
                  <div className="flex w-full flex-col rounded-xl border border-border bg-background p-4">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {product.step ?? '•'}
                    </span>
                    <p className="mt-3 text-sm font-semibold">{product.name}</p>
                    <p className="mt-1 text-lg font-bold text-accent">
                      {formatUsd(product.amountCents)}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Add-ons aren't a stage — they run across the whole timeline */}
      {addons.length > 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-border p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Repeat className="h-4 w-4" aria-hidden="true" />
            Runs alongside every stage
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {addons.map((product) => (
              <div key={product.sku} className="rounded-lg bg-light-gray p-3">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-base font-bold text-accent">
                  {formatUsd(product.amountCents)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
