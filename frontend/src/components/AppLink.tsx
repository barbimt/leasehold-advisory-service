import type { ReactNode } from 'react';
import { appLinkClassName } from './appLinkClassName.ts';

type AppLinkProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof appLinkClassName;
};

const AppLink = ({ href, children, variant = 'default' }: AppLinkProps) => {
  return (
    <a className={appLinkClassName[variant]} href={href}>
      {children}
    </a>
  );
};

export default AppLink;
