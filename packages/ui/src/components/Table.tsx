import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ className = "", ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="endoora-table-container">
      <table className={["endoora-table", className].filter(Boolean).join(" ")} {...props} />
    </div>
  );
}

export function TableHeader({ className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={["endoora-table__header", className].filter(Boolean).join(" ")} {...props} />;
}

export function TableBody({ className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={["endoora-table__body", className].filter(Boolean).join(" ")} {...props} />;
}

export function TableRow({ className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={["endoora-table__row", className].filter(Boolean).join(" ")} {...props} />;
}

export function TableHead({ className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th scope="col" className={["endoora-table__head", className].filter(Boolean).join(" ")} {...props} />;
}

export function TableCell({ className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={["endoora-table__cell", className].filter(Boolean).join(" ")} {...props} />;
}
