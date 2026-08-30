import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import EnquiryTextarea from './EnquiryTextarea.tsx';
import ErrorSummary from './ErrorSummary.tsx';
import PrivacyNotice from './PrivacyNotice.tsx';
import ScenarioOptions from './ScenarioOptions.tsx';
import { hasMeaningfulInput, type ScenarioValue } from './scenarios.ts';
import './EnquiryForm.scss';

const EnquiryForm = () => {
  const [scenario, setScenario] = useState<ScenarioValue | null>(null);
  const [description, setDescription] = useState('');
  const [showError, setShowError] = useState(false);
  const [validationAttempt, setValidationAttempt] = useState(0);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const firstRadioRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (validationAttempt === 0) {
      return;
    }

    errorSummaryRef.current?.focus();
  }, [validationAttempt]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasMeaningfulInput(scenario, description)) {
      setShowError(true);
      setValidationAttempt((attempt) => attempt + 1);
      return;
    }

    setShowError(false);
  };

  const handleReset = () => {
    setScenario(null);
    setDescription('');
    setShowError(false);
    setValidationAttempt(0);
    firstRadioRef.current?.focus();
  };

  return (
    <>
      <p className="enquiry__eyebrow">Leasehold guidance</p>
      <h1 className="enquiry__title">Find the right next step</h1>
      {showError ? <ErrorSummary summaryRef={errorSummaryRef} /> : null}
      <p className="enquiry__lede">
        Describe what is happening, or choose a common situation. We will help
        you find relevant LEASE guidance.
      </p>
      <p className="enquiry__lede">
        This tool gives general information. It does not provide personalised
        legal advice. Information you enter is not saved.
      </p>
      <PrivacyNotice />
      <form onSubmit={handleSubmit} noValidate>
        <ScenarioOptions
          value={scenario}
          onChange={setScenario}
          hasError={showError}
          firstRadioRef={firstRadioRef}
        />
        <EnquiryTextarea
          value={description}
          onChange={setDescription}
          hasError={showError}
        />
        <div className="enquiry__actions">
          <button
            className="enquiry__button enquiry__button--primary"
            type="submit"
          >
            Find guidance
          </button>
          <button
            className="enquiry__button enquiry__button--secondary"
            type="button"
            onClick={handleReset}
          >
            Clear and start again
          </button>
        </div>
      </form>
    </>
  );
};

export default EnquiryForm;
