import React from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';

// Presentation symbols transcribed from the approved Natural Sereno board.
// These are care/navigation ornaments, never the institutional logo.
function boardIcon(name: string, paths: React.ReactNode): LucideIcon {
  const Icon = React.forwardRef<SVGSVGElement, LucideProps>(function BoardIcon(
    { size = 24, strokeWidth = 1.5, color = 'currentColor', ...props }, ref,
  ) {
    return <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths}
    </svg>;
  });
  Icon.displayName = name;
  return Icon;
}

export const NaturalSerenoLotus = boardIcon('NaturalSerenoLotus', <>
  <path d="M12 3C9.8 5.9 8.9 8.3 9.4 11.2c.4 2.2 1.4 3.9 2.6 5.8 1.2-1.9 2.2-3.6 2.6-5.8C15.1 8.3 14.2 5.9 12 3Z" />
  <path d="M9.4 10.1C7.7 8.2 5.9 7.4 4 7.2c-.2 4.6 1.9 8.3 6.2 10.1M14.6 10.1c1.7-1.9 3.5-2.7 5.4-2.9.2 4.6-1.9 8.3-6.2 10.1" />
  <path d="M5.1 12.6 2 11.4c.2 6.1 3.8 9.3 10 9.6 6.2-.3 9.8-3.5 10-9.6l-3.1 1.2M12 17v4M5.7 17.4c2.1-.9 4.1-.6 6.3 1.8 2.2-2.4 4.2-2.7 6.3-1.8" />
</>);

export const NaturalSerenoAstral = boardIcon('NaturalSerenoAstral', <>
  <path d="m12 2 3 2 3.6.4.4 3.6 3 4-3 4-.4 3.6-3.6.4-3 2-3-2-3.6-.4L5 16l-3-4 3-4 .4-3.6L9 4Z" />
  <path d="m12 5 2.4 2.4 3.4.6.6 3.4L20 12l-1.6 2.6-.6 3.4-3.4.6L12 21l-2.4-2.4-3.4-.6-.6-3.4L4 12l1.6-2.6.6-3.4 3.4-.6Z" transform="translate(2.4 2.4) scale(.8)" />
  <circle cx="12" cy="12" r="4" />
  <path d="m12 8 1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2Z" />
</>);

export const NaturalSerenoNumerology = boardIcon('NaturalSerenoNumerology', <>
  <path d="M12 2 2.8 19h18.4L12 2Z" />
  <path d="m12 7-4.1 8h8.2L12 7ZM12 15v7M9 22h6" />
</>);

export const NaturalSerenoChakras = boardIcon('NaturalSerenoChakras', <>
  <circle cx="12" cy="3.5" r="1.5" /><circle cx="12" cy="7.5" r="1.5" />
  <circle cx="12" cy="11.5" r="1.5" /><circle cx="12" cy="15.5" r="1.5" />
  <path d="M9 8.5 6.5 13 9 17M15 8.5l2.5 4.5L15 17M9 17c-3.7.5-5.7 1.9-5 3.2.8 1.5 4.7 1.4 8-.5 3.3 1.9 7.2 2 8 .5.7-1.3-1.3-2.7-5-3.2M12 17v2.7" />
</>);
