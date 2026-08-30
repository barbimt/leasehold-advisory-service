import type { ScenarioValue } from '../enquiry/scenarios.ts';
import { SCENARIO_OPTIONS } from '../enquiry/scenarios.ts';

type EnquiryRecapProps = {
  description: string;
  scenario: ScenarioValue | null;
};

const EnquiryRecap = ({ description, scenario }: EnquiryRecapProps) => {
  const trimmedDescription = description.trim();
  const scenarioLabel =
    scenario === null
      ? null
      : (SCENARIO_OPTIONS.find((option) => option.value === scenario)?.label ??
        null);

  if (trimmedDescription.length === 0 && scenarioLabel === null) {
    return null;
  }

  return (
    <div className="mb-6 border-l-8 border-brand bg-surface py-3 pl-6 pr-4">
      {trimmedDescription.length > 0 ? (
        <>
          <h2 className="mb-2 text-lg font-bold">Your description</h2>
          <p className="m-0">{trimmedDescription}</p>
        </>
      ) : (
        <>
          <h2 className="mb-2 text-lg font-bold">The situation you chose</h2>
          <p className="m-0">{scenarioLabel}</p>
        </>
      )}
    </div>
  );
};

export default EnquiryRecap;
