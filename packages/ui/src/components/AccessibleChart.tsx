import type { CSSProperties } from "react";

export type ChartDatum = {
  label: string;
  value: number;
  displayValue?: string;
};

export function AccessibleChart({ title, summary, data, maxValue }: { title: string; summary: string; data: ChartDatum[]; maxValue?: number }) {
  const max = maxValue ?? Math.max(...data.map((item) => item.value), 1);

  return (
    <figure className="endoora-chart" aria-label={title}>
      <figcaption>
        <h3 className="text-card-title">{title}</h3>
        <p>{summary}</p>
      </figcaption>
      <div className="endoora-chart__bars" aria-hidden="true">
        {data.map((item) => {
          const percent = Math.max(0, Math.min(100, (item.value / max) * 100));
          return (
            <div className="endoora-chart__bar-row" key={item.label}>
              <span>{item.label}</span>
              <span className="endoora-chart__track"><span style={{ "--chart-percent": `${percent}%` } as CSSProperties} /></span>
              <span className="ltr-isolate">{item.displayValue ?? item.value}</span>
            </div>
          );
        })}
      </div>
      <div className="endoora-chart__table">
        <table>
          <caption className="endoora-visually-hidden">Accessible data for {title}</caption>
          <thead><tr><th scope="col">Category</th><th scope="col">Value</th></tr></thead>
          <tbody>
            {data.map((item) => <tr key={item.label}><th scope="row">{item.label}</th><td>{item.displayValue ?? item.value}</td></tr>)}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
