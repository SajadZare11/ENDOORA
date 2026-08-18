import type { ReactNode } from "react";

export type DataColumn<Row> = {
  key: string;
  header: string;
  cell: (row: Row) => ReactNode;
};

export type DataTableProps<Row> = {
  caption: string;
  columns: DataColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  emptyMessage?: string;
};

export function DataTable<Row>({ caption, columns, rows, rowKey, emptyMessage = "No records yet." }: DataTableProps<Row>) {
  if (rows.length === 0) {
    return <div className="endoora-table-empty" role="status">{emptyMessage}</div>;
  }

  return (
    <div className="endoora-data-table">
      <div className="endoora-data-table__desktop">
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>{columns.map((column) => <th key={column.key} scope="col">{column.header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)}>{columns.map((column) => <td key={column.key}>{column.cell(row)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="endoora-data-table__cards" aria-label={`${caption} mobile view`}>
        {rows.map((row) => (
          <article className="endoora-data-card" key={rowKey(row)}>
            {columns.map((column) => (
              <div className="endoora-data-card__row" key={column.key}>
                <strong>{column.header}</strong>
                <div>{column.cell(row)}</div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}
