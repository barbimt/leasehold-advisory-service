import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import PageContainer from './components/PageContainer.tsx';
import PrototypeBanner from './components/PrototypeBanner.tsx';
import EnquiryForm from './features/enquiry/EnquiryForm.tsx';

const App = () => {
  return (
    <div className="app">
      <a className="govuk-skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <PrototypeBanner />
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
