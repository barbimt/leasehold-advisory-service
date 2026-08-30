import type { RefObject } from 'react';
import type { ApiErrorKind } from '../../api/http.ts';
import { SUBMISSION_ERROR_ID } from './ids.ts';

type SubmissionErrorProps = {
  kind: ApiErrorKind;
  errorRef: RefObject<HTMLDivElement | null>;
};

const messageByKind: Record<ApiErrorKind, string> = {
  network: 'We could not reach the service. Try again later.',
  http: 'We could not complete your request. Check your answers and try again.',
  'invalid-response':
    'We could not complete your request. Check your answers and try again.',
};

const SubmissionError = ({ kind, errorRef }: SubmissionErrorProps) => {
  return (
    <div
      className="mb-6 rounded-sm border-2 border-error p-4 focus:outline-3 focus:outline-offset-0 focus:outline-focus"
      id={SUBMISSION_ERROR_ID}
      ref={errorRef}
      tabIndex={-1}
    >
      <h2 className="mb-2 text-3xl font-bold leading-tight">
        There is a problem
      </h2>
      <p>{messageByKind[kind]}</p>
    </div>
  );
};

export default SubmissionError;
