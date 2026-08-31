import type { RefObject } from 'react';
import { UNKNOWN_TOPIC_SLUG, type TriageTopic } from '../../api/triage.ts';
import type { ScenarioValue } from '../enquiry/scenarios.ts';
import KnownResult from './KnownResult.tsx';
import UnknownResult from './UnknownResult.tsx';

type TriageResultProps = {
  topic: TriageTopic;
  description: string;
  scenario: ScenarioValue | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onChangeAnswers: () => void;
  onStartAgain: () => void;
};

const TriageResult = ({
  topic,
  description,
  scenario,
  headingRef,
  onChangeAnswers,
  onStartAgain,
}: TriageResultProps) => {
  if (topic.slug === UNKNOWN_TOPIC_SLUG) {
    return (
      <UnknownResult
        topic={topic}
        description={description}
        scenario={scenario}
        headingRef={headingRef}
        onChangeAnswers={onChangeAnswers}
        onStartAgain={onStartAgain}
      />
    );
  }

  return (
    <KnownResult
      topic={topic}
      description={description}
      scenario={scenario}
      headingRef={headingRef}
      onChangeAnswers={onChangeAnswers}
      onStartAgain={onStartAgain}
    />
  );
};

export default TriageResult;
