import Link from "next/link";
import { LEADERBOARDS } from "@/lib/leaderboards";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">Leaderboards</h1>
      <p className="text-text-secondary mb-8">
        Daily snapshots of AI model rankings from Artificial Analysis
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEADERBOARDS.map((lb) => (
          <Link
            key={lb.slug}
            href={`/leaderboards/${lb.slug}`}
            className="block rounded-lg border border-border-default bg-bg-surface p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-border-strong transition-all"
          >
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              {lb.name}
            </h2>
            <p className="text-sm text-text-secondary">{lb.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
