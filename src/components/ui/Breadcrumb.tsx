import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-2 text-sm text-stone-500 font-medium ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-green-700 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-stone-900" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-stone-300 pointer-events-none select-none">/</span>}
          </div>
        );
      })}
    </nav>
  );
}
