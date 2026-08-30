import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError } from '../../api/http.ts';
import { submitTriage, type TriageTopic } from '../../api/triage.ts';
import TriageResult from '../result/TriageResult.tsx';
import EnquiryTextarea from './EnquiryTextarea.tsx';
import ErrorSummary from './ErrorSummary.tsx';
import PrivacyNotice from './PrivacyNotice.tsx';
import ScenarioOptions from './ScenarioOptions.tsx';
import SubmissionError from './SubmissionError.tsx';
import { hasMeaningfulInput, type ScenarioValue } from './scenarios.ts';

const actionClassName =
  'w-full cursor-pointer rounded-sm px-6 py-3 text-lg font-semibold leading-snug transition-colors duration-150 motion-reduce:transition-none disabled:cursor-not-allowed md:w-auto';

type RequestState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; topic: TriageTopic }
  | { status: 'error'; kind: ApiError['kind'] };

const EnquiryForm = () => {
  const [scenario, setScenario] = useState<ScenarioValue | null>(null);
  const [description, setDescription] = useState('');
  const [showError, setShowError] = useState(false);
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [request, setRequest] = useState<RequestState>({ status: 'idle' });
  const [submissionErrorAttempt, setSubmissionErrorAttempt] = useState(0);
  const [resetAttempt, setResetAttempt] = useState(0);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const submissionErrorRef = useRef<HTMLDivElement>(null);
  const firstRadioRef = useRef<HTMLInputElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const inFlightRef = useRef(false);
  const isSubmitting = request.status === 'submitting';

  useEffect(() => {
    if (validationAttempt === 0) {
      return;
    }

    errorSummaryRef.current?.focus();
  }, [validationAttempt]);

  useEffect(() => {
    if (submissionErrorAttempt === 0) {
      return;
    }

    submissionErrorRef.current?.focus();
  }, [submissionErrorAttempt]);

  useEffect(() => {
    if (request.status !== 'success') {
      return;
    }

    resultHeadingRef.current?.focus();
  }, [request]);

  useEffect(() => {
    if (resetAttempt === 0) {
      return;
    }

    firstRadioRef.current?.focus();
  }, [resetAttempt]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inFlightRef.current) {
      return;
    }

    if (!hasMeaningfulInput(scenario, description)) {
      setShowError(true);
      setRequest({ status: 'idle' });
      setValidationAttempt((attempt) => attempt + 1);
      return;
    }

    inFlightRef.current = true;
    setShowError(false);
    setRequest({ status: 'submitting' });

    try {
      const topic = await submitTriage(scenario, description);
      setRequest({ status: 'success', topic });
    } catch (error) {
      const kind = error instanceof ApiError ? error.kind : 'network';
      setRequest({ status: 'error', kind });
      setSubmissionErrorAttempt((attempt) => attempt + 1);
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleReset = () => {
    if (inFlightRef.current) {
      return;
    }

    const returningFromResult = request.status === 'success';

    setScenario(null);
    setDescription('');
    setShowError(false);
    setValidationAttempt(0);
    setRequest({ status: 'idle' });
    setSubmissionErrorAttempt(0);

    if (returningFromResult) {
      setResetAttempt((attempt) => attempt + 1);
      return;
    }

    firstRadioRef.current?.focus();
  };

  if (request.status === 'success') {
    return (
      <TriageResult
        topic={request.topic}
        description={description}
        scenario={scenario}
        headingRef={resultHeadingRef}
        onStartAgain={handleReset}
      />
    );
  }

  return (
    <>
      <p className="mb-2 text-base text-muted">Leasehold guidance</p>
      <h1 className="mb-4 text-3xl font-bold leading-tight text-ink md:mb-6 md:text-4xl">
        Find the right next step
      </h1>
      {showError ? <ErrorSummary summaryRef={errorSummaryRef} /> : null}
      {request.status === 'error' ? (
        <SubmissionError kind={request.kind} errorRef={submissionErrorRef} />
      ) : null}
      <p className="mb-4">
        Describe what is happening, or choose a common situation. We will help
        you find relevant LEASE guidance.
      </p>
      <p className="mb-6 md:mb-8">
        This tool gives general information. It does not provide personalised
        legal advice. Information you enter is not saved.
      </p>
      <PrivacyNotice />
      <form
        aria-busy={isSubmitting ? true : undefined}
        noValidate
        onSubmit={handleSubmit}
      >
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
            className={`${actionClassName} bg-brand text-white hover:bg-brand-hover disabled:hover:bg-brand`}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Finding guidance...' : 'Find guidance'}
          </button>
          <button
            className={`${actionClassName} bg-surface text-ink hover:bg-surface-hover disabled:hover:bg-surface`}
            disabled={isSubmitting}
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
