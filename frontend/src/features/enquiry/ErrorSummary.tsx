import type { RefObject } from 'react';
import { ERROR_SUMMARY_ID, SITUATION_FIELDSET_ID } from './ids.ts';

type ErrorSummaryProps = {
  summaryRef: RefObject<HTMLDivElement | null>;
};

const ErrorSummary = ({ summaryRef }: ErrorSummaryProps) => {
  return (
    <div
      className="mb-6 rounded-sm border-2 border-error p-4 focus:outline-3 focus:outline-offset-0 focus:outline-focus"
      id={ERROR_SUMMARY_ID}
      ref={summaryRef}
      tabIndex={-1}
    >
      <h2 className="mb-2 text-3xl font-bold leading-tight">
        There is a problem
      </h2>
      <div>
        <ul className="m-0 list-disc pl-5">
          <li>
            <a
              className="font-bold text-error underline"
              href={`#${SITUATION_FIELDSET_ID}`}
            >
              Choose a situation or tell us briefly what is happening.
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorSummary;
