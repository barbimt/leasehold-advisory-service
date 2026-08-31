const underlineHover =
  'underline decoration-1 underline-offset-2 hover:decoration-[3px]';

export const appLinkClassName = {
  default: `text-brand ${underlineHover} transition-colors duration-150 hover:text-brand-hover motion-reduce:transition-none`,
  onDark: `text-white ${underlineHover} transition-colors duration-150 hover:text-accent motion-reduce:transition-none`,
  error: `font-bold text-error ${underlineHover}`,
} as const;
