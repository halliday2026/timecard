interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="mb-3 text-4xl">&#128203;</div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}
