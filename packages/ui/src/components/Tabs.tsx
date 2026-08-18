"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

export function Tabs({ items, defaultTabId, label = "Sections" }: { items: TabItem[]; defaultTabId?: string; label?: string }) {
  const firstEnabled = items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultTabId ?? firstEnabled);
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function moveFocus(currentIndex: number, direction: 1 | -1) {
    if (items.length === 0) return;
    for (let offset = 1; offset <= items.length; offset += 1) {
      const candidate = (currentIndex + direction * offset + items.length) % items.length;
      if (!items[candidate]?.disabled) {
        refs.current[candidate]?.focus();
        setActiveId(items[candidate]!.id);
        return;
      }
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const rtl = window.getComputedStyle(event.currentTarget).direction === "rtl";
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(index, rtl ? -1 : 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(index, rtl ? 1 : -1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(index, 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(index, -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      const indexToFocus = items.findIndex((item) => !item.disabled);
      if (indexToFocus >= 0) {
        refs.current[indexToFocus]?.focus();
        setActiveId(items[indexToFocus]!.id);
      }
    } else if (event.key === "End") {
      event.preventDefault();
      const indexToFocus = [...items].map((item) => item.disabled).lastIndexOf(false);
      if (indexToFocus >= 0) {
        refs.current[indexToFocus]?.focus();
        setActiveId(items[indexToFocus]!.id);
      }
    }
  }

  const active = items.find((item) => item.id === activeId && !item.disabled) ?? items.find((item) => !item.disabled);

  return (
    <div className="endoora-tabs">
      <div className="endoora-tabs__list" role="tablist" aria-label={label}>
        {items.map((item, index) => {
          const selected = item.id === active?.id;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;
          return (
            <button
              key={item.id}
              ref={(node) => { refs.current[index] = node; }}
              type="button"
              id={tabId}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {active ? (
        <div
          className="endoora-tabs__panel"
          id={`${baseId}-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active.id}`}
          tabIndex={0}
        >
          {active.content}
        </div>
      ) : null}
    </div>
  );
}
