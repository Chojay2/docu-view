// Utility classes for design system tokens
// Use these with Tailwind's arbitrary value syntax

export const styles = {
  bg: {
    page: 'bg-[var(--color-bg-page)]',
    surface: 'bg-[var(--color-bg-surface)]',
    surfaceSoft: 'bg-[var(--color-bg-surface-soft)]',
  },
  text: {
    primary: 'text-[var(--color-text-primary)]',
    onBrand: 'text-[var(--color-text-on-brand)]',
    muted: 'text-[var(--color-text-muted)]',
    accent: 'text-[var(--color-text-accent)]',
  },
  border: {
    subtle: 'border-[var(--color-border-subtle)]',
    strong: 'border-[var(--color-border-strong)]',
  },
  brand: {
    primary: 'bg-[var(--color-brand-primary)]',
    primarySoft: 'bg-[var(--color-brand-primary-soft)]',
    secondary: 'bg-[var(--color-brand-secondary)]',
    secondarySoft: 'bg-[var(--color-brand-secondary-soft)]',
  },
  shadow: {
    soft: 'shadow-[var(--shadow-soft)]',
    card: 'shadow-[var(--shadow-card)]',
  },
};

