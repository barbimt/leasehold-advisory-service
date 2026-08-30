import type { RefObject } from 'react';
import { SITUATION_FIELDSET_ID, VALIDATION_ERROR_ID } from './ids.ts';
import { SCENARIO_OPTIONS, type ScenarioValue } from './scenarios.ts';

type ScenarioOptionsProps = {
  value: ScenarioValue | null;
  onChange: (value: ScenarioValue) => void;
  hasError: boolean;
  firstRadioRef: RefObject<HTMLInputElement | null>;
};

const ScenarioOptions = ({
  value,
  onChange,
  hasError,
  firstRadioRef,
}: ScenarioOptionsProps) => {
  const describedBy = hasError ? VALIDATION_ERROR_ID : undefined;

  return (
    <div className={hasError ? 'mb-6 border-l-4 border-error pl-4' : 'mb-6'}>
      <fieldset
        className="m-0 min-w-0 border-0 p-0"
        id={SITUATION_FIELDSET_ID}
        aria-describedby={describedBy}
        aria-invalid={hasError ? true : undefined}
      >
        <legend className="mb-4 p-0 text-3xl font-bold leading-tight">
          What do you need help with?
        </legend>
        {hasError ? (
          <p className="mb-4 font-bold text-error" id={VALIDATION_ERROR_ID}>
            <span className="sr-only">Error:</span> Choose a situation or tell
            us briefly what is happening.
          </p>
        ) : null}
        <div>
          {SCENARIO_OPTIONS.map((option, index) => {
            const inputId = `scenario-${option.value}`;
            const hintId = option.hint ? `${inputId}-hint` : undefined;

            return (
              <div
                className="mb-4 flex flex-wrap items-start gap-x-2 last:mb-0"
                key={option.value}
              >
                <input
                  className="mt-1 size-5 shrink-0 accent-brand"
                  ref={index === 0 ? firstRadioRef : undefined}
                  id={inputId}
                  name="scenario"
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => {
                    onChange(option.value);
                  }}
                  aria-describedby={hintId}
                />
                <label className="min-w-0 flex-1 font-bold" htmlFor={inputId}>
                  {option.label}
                </label>
                {option.hint ? (
                  <p id={hintId} className="mt-1 w-full pl-7 text-muted">
                    {option.hint}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};

export default ScenarioOptions;
