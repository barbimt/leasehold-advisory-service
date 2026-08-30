import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import PageContainer from './components/PageContainer.tsx';
import EnquiryForm from './features/enquiry/EnquiryForm.tsx';

const App = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-page focus:px-4 focus:py-2 focus:text-ink"
        href="#main-content"
      >
        Skip to main content
      </a>
      <Header />
      <PageContainer>
        <main id="main-content">
          <EnquiryForm />
        </main>
      </PageContainer>
      <Footer />
    </div>
  );
};

export default App;
