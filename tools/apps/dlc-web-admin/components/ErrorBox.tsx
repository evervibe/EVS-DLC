/**
 * User-friendly error display component
 * Shows error title and optional detail message instead of raw stack traces
 */
export function ErrorBox({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-red-900/40 bg-red-900/15 p-4 text-red-200">
      <div className="font-semibold">{title}</div>
      {detail ? <div className="text-sm opacity-90 mt-1">{detail}</div> : null}
    </div>
  );
}
