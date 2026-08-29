import type { RefObject } from 'react';
import { SITUATION_FIELDSET_ID, VALIDATION_ERROR_ID } from './ids.ts';
import { SCENARIO_OPTIONS, type ScenarioValue } from './scenarios.ts';
import './ScenarioOptions.scss';

type ScenarioOptionsProps = {
  value: ScenarioValue | null;
  onChange: (value: ScenarioValue) => void;
  hasError: boolean;
  groupRef: RefObject<HTMLFieldSetElement | null>;
};

const ScenarioOptions = ({
  value,
  onChange,
  hasError,
  groupRef,
}: ScenarioOptionsProps) => {
  const describedBy = hasError ? VALIDATION_ERROR_ID : undefined;

  return (
    <div
      className={
        hasError
          ? 'govuk-form-group govuk-form-group--error'
          : 'govuk-form-group'
      }
    >
      <fieldset
        className="govuk-fieldset enquiry__scenarios"
        id={SITUATION_FIELDSET_ID}
        ref={groupRef}
        tabIndex={-1}
        aria-describedby={describedBy}
        aria-invalid={hasError ? true : undefined}
      >
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
          What do you need help with?
        </legend>
        {hasError ? (
          <p className="govuk-error-message" id={VALIDATION_ERROR_ID}>
            <span className="govuk-visually-hidden">Error:</span> Choose a
            situation or tell us briefly what is happening.
          </p>
        ) : null}
        <div className="govuk-radios">
          {SCENARIO_OPTIONS.map((option) => {
            const inputId = `scenario-${option.value}`;
            const hintId = option.hint ? `${inputId}-hint` : undefined;

            return (
              <div className="govuk-radios__item" key={option.value}>
                <input
                  className="govuk-radios__input"
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
                <label className="govuk-radios__label" htmlFor={inputId}>
                  {option.label}
                </label>
                {option.hint ? (
                  <div id={hintId} className="govuk-hint govuk-radios__hint">
                    {option.hint}
                  </div>
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
