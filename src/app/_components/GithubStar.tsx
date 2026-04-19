const API = 'https://api.github.com/repos/nikhilbhima/mistral-ai-docs-mcp-server';

async function fetchStarCount(): Promise<number | null> {
  try {
    const res = await fetch(API, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? 0;
  } catch {
    return null;
  }
}

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

export async function GithubStarButton() {
  const count = await fetchStarCount();
  return (
    <a
      href="https://github.com/nikhilbhima/mistral-ai-docs-mcp-server"
      target="_blank"
      rel="noopener noreferrer"
      className="star-btn"
      aria-label="Star on GitHub"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span className="star-label">Star</span>
      <span className="star-divider" aria-hidden="true" />
      <span className="star-count">{count === null ? '—' : formatCount(count)}</span>
    </a>
  );
}
