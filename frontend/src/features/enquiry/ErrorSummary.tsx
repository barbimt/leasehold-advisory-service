import type { RefObject } from 'react';
import { ERROR_SUMMARY_ID, SITUATION_FIELDSET_ID } from './ids.ts';
import './ErrorSummary.scss';

type ErrorSummaryProps = {
  summaryRef: RefObject<HTMLDivElement | null>;
};

const ErrorSummary = ({ summaryRef }: ErrorSummaryProps) => {
  return (
    <div
      className="govuk-error-summary enquiry__error"
      id={ERROR_SUMMARY_ID}
      ref={summaryRef}
      tabIndex={-1}
    >
      <h2 className="govuk-error-summary__title">There is a problem</h2>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">
          <li>
            <a href={`#${SITUATION_FIELDSET_ID}`}>
              Choose a situation or tell us briefly what is happening.
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorSummary;
