'use client';

import { useState } from 'react';
import { CopyButton } from './CopyButton';

export interface ClientTab {
  id: string;
  label: string;
  note: string;
  code: string;
  lang?: string;
}

interface Props {
  tabs: ClientTab[];
}

export function ClientTabs({ tabs }: Props) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className="client-tabs">
      <div className="tab-list" role="tablist" aria-label="MCP client install snippets">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            aria-controls={`panel-${t.id}`}
            type="button"
            className={`tab-btn${t.id === active ? ' is-active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className="tab-panel"
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={current.id}
      >
        <div className="tab-note">
          <span className="tab-note-mark"># </span>
          {current.note}
        </div>
        <div className="code code-wide">
          <pre>{current.code}</pre>
          <CopyButton value={current.code} />
        </div>
      </div>
    </div>
  );
}
