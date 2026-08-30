import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import EnquiryTextarea from './EnquiryTextarea.tsx';
import ErrorSummary from './ErrorSummary.tsx';
import PrivacyNotice from './PrivacyNotice.tsx';
import ScenarioOptions from './ScenarioOptions.tsx';
import { hasMeaningfulInput, type ScenarioValue } from './scenarios.ts';

const actionClassName =
  'w-full cursor-pointer rounded-sm px-6 py-3 text-lg font-semibold leading-snug transition-colors duration-150 motion-reduce:transition-none md:w-auto';

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
      <p className="mb-2 text-base text-muted">Leasehold guidance</p>
      <h1 className="mb-4 text-3xl font-bold leading-tight text-ink md:mb-6 md:text-4xl">
        Find the right next step
      </h1>
      {showError ? <ErrorSummary summaryRef={errorSummaryRef} /> : null}
      <p className="mb-4">
        Describe what is happening, or choose a common situation. We will help
        you find relevant LEASE guidance.
      </p>
      <p className="mb-6 md:mb-8">
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
        <div className="mt-6 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          <button
            className={`${actionClassName} bg-brand text-white hover:bg-brand-hover`}
            type="submit"
          >
            Find guidance
          </button>
          <button
            className={`${actionClassName} bg-surface text-ink hover:bg-surface-hover`}
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
