import type { RefObject } from 'react';
import type { TriageTopic } from '../../api/triage.ts';
import type { ScenarioValue } from '../enquiry/scenarios.ts';
import { RESULT_HEADING_ID } from '../enquiry/ids.ts';
import EnquiryRecap from './EnquiryRecap.tsx';
import { LEASE_HOME_URL } from './leaseLinks.ts';
import ResultContact from './ResultContact.tsx';
import { resultLinkClassName } from './resultLinkClassName.ts';
import ResultActions from './ResultActions.tsx';

type UnknownResultProps = {
  topic: TriageTopic;
  description: string;
  scenario: ScenarioValue | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onChangeAnswers: () => void;
  onStartAgain: () => void;
};

const UnknownResult = ({
  topic,
  description,
  scenario,
  headingRef,
  onChangeAnswers,
  onStartAgain,
}: UnknownResultProps) => {
  return (
    <>
      <p className="mb-2 text-base text-muted">What you told us</p>
      <h1
        className="mb-4 text-3xl font-bold leading-tight text-ink md:mb-6 md:text-4xl"
        id={RESULT_HEADING_ID}
        ref={headingRef}
        tabIndex={-1}
      >
        We could not match this to a specific topic
      </h1>
      <p className="mb-6">{topic.summary}</p>
      <EnquiryRecap description={description} scenario={scenario} />
      <section
        aria-labelledby="unknown-next-step-heading"
        className="mb-6 border border-ink p-4"
      >
        <h2 className="mb-2 text-lg font-bold" id="unknown-next-step-heading">
          What you can do next
        </h2>
        <p className="m-0">{topic.nextStep}</p>
      </section>
      <p className="mb-4">
        <a className={resultLinkClassName} href={LEASE_HOME_URL}>
          Browse all LEASE guidance
        </a>
      </p>
      <aside
        aria-labelledby="unknown-general-info-heading"
        className="mb-6 border-l-8 border-brand bg-surface py-3 pl-6 pr-4"
      >
        <h2
          className="mb-2 text-lg font-bold"
          id="unknown-general-info-heading"
        >
          General information
        </h2>
        <p className="m-0">
          This tool gives general information. It does not provide personalised
          legal advice.
        </p>
      </aside>
      <ResultContact />
      <ResultActions
        onChangeAnswers={onChangeAnswers}
        onStartAgain={onStartAgain}
      />
    </>
  );
};

export default UnknownResult;
