import { DESCRIPTION_FIELD_ID, VALIDATION_ERROR_ID } from './ids.ts';
import { DESCRIPTION_MAX_LENGTH } from './scenarios.ts';
import './EnquiryTextarea.scss';

type EnquiryTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
};

const hintId = `${DESCRIPTION_FIELD_ID}-hint`;
const exampleId = `${DESCRIPTION_FIELD_ID}-example`;
const privacyId = `${DESCRIPTION_FIELD_ID}-privacy`;
const countId = `${DESCRIPTION_FIELD_ID}-count`;

const EnquiryTextarea = ({
  value,
  onChange,
  hasError,
}: EnquiryTextareaProps) => {
  const remaining = DESCRIPTION_MAX_LENGTH - value.length;
  const describedBy = [
    hintId,
    exampleId,
    privacyId,
    countId,
    hasError ? VALIDATION_ERROR_ID : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="govuk-form-group enquiry__textarea">
      <p className="enquiry__textarea__divider">AND, OR INSTEAD</p>
      <label
        className="govuk-label govuk-label--m"
        htmlFor={DESCRIPTION_FIELD_ID}
      >
        Describe what is happening
      </label>
      <div id={hintId} className="govuk-hint">
        Use your own words. A sentence or two is enough.
      </div>
      <p id={exampleId} className="enquiry__textarea__example">
        For example, “My managing agent has sent me a large bill for roof
        repairs.”
      </p>
      <p id={privacyId} className="enquiry__textarea__privacy">
        Do not include names, addresses, account numbers or other personal
        information.
      </p>
      <textarea
        className="govuk-textarea"
        id={DESCRIPTION_FIELD_ID}
        name="description"
        rows={5}
        maxLength={DESCRIPTION_MAX_LENGTH}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        aria-describedby={describedBy}
        aria-invalid={hasError ? true : undefined}
      />
      <p className="enquiry__textarea__count" id={countId}>
        You have {remaining} characters remaining.
      </p>
    </div>
  );
};

export default EnquiryTextarea;
