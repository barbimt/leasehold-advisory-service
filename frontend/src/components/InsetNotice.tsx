import type { ReactNode } from 'react';

type InsetNoticeProps = {
  children: ReactNode;
  labelledBy?: string;
  className?: string;
};

const InsetNotice = ({ children, labelledBy, className }: InsetNoticeProps) => {
  const classes = [
    'border-l-8 border-brand bg-surface py-3 pl-6 pr-4',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (labelledBy) {
    return (
      <aside className={classes} aria-labelledby={labelledBy}>
        {children}
      </aside>
    );
  }

  return <div className={classes}>{children}</div>;
};

export default InsetNotice;
