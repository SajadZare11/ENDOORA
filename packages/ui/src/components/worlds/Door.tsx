export function Door({ label = "A new learning door" }: { label?: string }) {
  return <div className="endoora-world-object" role="img" aria-label={label}><span aria-hidden="true">Door</span></div>;
}
