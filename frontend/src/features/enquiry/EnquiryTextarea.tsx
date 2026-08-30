import { DESCRIPTION_FIELD_ID, VALIDATION_ERROR_ID } from './ids.ts';
import { DESCRIPTION_MAX_LENGTH } from './scenarios.ts';

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
    <div className="mb-6">
      <p className="my-6 font-bold tracking-wide md:my-6">AND, OR INSTEAD</p>
      <label
        className="mb-2 block text-3xl font-bold leading-tight"
        htmlFor={DESCRIPTION_FIELD_ID}
      >
        Describe what is happening
      </label>
      <p id={hintId} className="mb-4 text-muted">
        Use your own words. A sentence or two is enough.
      </p>
      <p id={exampleId} className="mb-4 text-muted">
        For example, “My managing agent has sent me a large bill for roof
        repairs.”
      </p>
      <p id={privacyId} className="mb-4">
        Do not include names, addresses, account numbers or other personal
        information.
      </p>
      <textarea
        className="block min-h-32 w-full resize-y rounded-sm border-2 border-ink p-2 font-sans text-inherit"
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
      <p className="mt-2 text-muted" id={countId}>
        You have {remaining} characters remaining.
      </p>
    </div>
  );
};

export default EnquiryTextarea;
