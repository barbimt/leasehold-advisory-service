import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => {
  return <div className="app__content">{children}</div>;
};

export default PageContainer;
