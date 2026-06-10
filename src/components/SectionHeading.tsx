interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

/** Page-level heading with the site's display font and gold accent rule. */
export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <header className="mb-10 text-center">
      <h1 className="font-display text-3xl text-gray-900 sm:text-4xl">{title}</h1>
      <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-gray-400 to-transparent" aria-hidden="true" />
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-gray-600">{subtitle}</p>}
    </header>
  );
}
