import type { RefObject } from 'react';
import { SITUATION_FIELDSET_ID, VALIDATION_ERROR_ID } from './ids.ts';
import { SCENARIO_OPTIONS, type ScenarioValue } from './scenarios.ts';
import './ScenarioOptions.scss';

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
    <div
      className={
        hasError ? 'enquiry__group enquiry__group--error' : 'enquiry__group'
      }
    >
      <fieldset
        className="enquiry__scenarios"
        id={SITUATION_FIELDSET_ID}
        aria-describedby={describedBy}
        aria-invalid={hasError ? true : undefined}
      >
        <legend className="enquiry__legend">What do you need help with?</legend>
        {hasError ? (
          <p className="enquiry__field-error" id={VALIDATION_ERROR_ID}>
            <span className="visually-hidden">Error:</span> Choose a situation
            or tell us briefly what is happening.
          </p>
        ) : null}
        <div className="enquiry__radios">
          {SCENARIO_OPTIONS.map((option, index) => {
            const inputId = `scenario-${option.value}`;
            const hintId = option.hint ? `${inputId}-hint` : undefined;

            return (
              <div className="enquiry__radio" key={option.value}>
                <input
                  className="enquiry__radio-input"
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
                <label className="enquiry__radio-label" htmlFor={inputId}>
                  {option.label}
                </label>
                {option.hint ? (
                  <p id={hintId} className="enquiry__radio-hint">
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
