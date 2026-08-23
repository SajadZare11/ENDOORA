export function Crystal({ label = "Knowledge crystal" }: { label?: string }) {
  return <div className="endoora-world-object" role="img" aria-label={label}><span aria-hidden="true">Crystal</span></div>;
}
