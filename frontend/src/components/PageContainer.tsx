import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="mx-auto w-full max-w-content flex-1 px-4 py-6 sm:px-6 sm:py-8">
      {children}
    </div>
  );
};

export default PageContainer;
