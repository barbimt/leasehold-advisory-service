import type { RefObject } from 'react';
import type { TriageTopic } from '../../api/triage.ts';
import type { ScenarioValue } from '../enquiry/scenarios.ts';
import { RESULT_HEADING_ID } from '../enquiry/ids.ts';
import EnquiryRecap from './EnquiryRecap.tsx';
import GuidanceResourceList from './GuidanceResourceList.tsx';
import ResultContact from './ResultContact.tsx';
import StartAgainButton from './StartAgainButton.tsx';

type KnownResultProps = {
  topic: TriageTopic;
  description: string;
  scenario: ScenarioValue | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onStartAgain: () => void;
};

const KnownResult = ({
  topic,
  description,
  scenario,
  headingRef,
  onStartAgain,
}: KnownResultProps) => {
  const primaryResources = topic.primaryResource ? [topic.primaryResource] : [];

  return (
    <>
      <p className="mb-2 text-base text-muted">What you told us</p>
      <h1
        className="mb-4 text-3xl font-bold leading-tight text-ink md:mb-6 md:text-4xl"
        id={RESULT_HEADING_ID}
        ref={headingRef}
        tabIndex={-1}
      >
        Your question may relate to {topic.label}.
      </h1>
      <p className="mb-6">
        Based on what you have told us, these are relevant places to start.
      </p>
      <EnquiryRecap description={description} scenario={scenario} />
      <section
        aria-labelledby="result-next-step-heading"
        className="mb-6 border border-ink p-4"
      >
        <h2 className="mb-2 text-lg font-bold" id="result-next-step-heading">
          Your next step
        </h2>
        <p className="m-0">{topic.nextStep}</p>
      </section>
      <section
        aria-labelledby="result-why-heading"
        className="border-t border-line py-6"
      >
        <h2 className="mb-2 text-2xl font-bold" id="result-why-heading">
          Why this guidance
        </h2>
        <p className="m-0">{topic.summary}</p>
      </section>
      <GuidanceResourceList
        heading="A good place to start"
        headingId="result-primary-heading"
        resources={primaryResources}
      />
      <GuidanceResourceList
        heading="Related guidance that may help"
        headingId="result-related-heading"
        resources={topic.relatedResources}
      />
      <aside
        aria-labelledby="result-general-info-heading"
        className="mb-6 border-l-8 border-brand bg-surface py-3 pl-6 pr-4"
      >
        <h2 className="mb-2 text-lg font-bold" id="result-general-info-heading">
          General information
        </h2>
        <p className="m-0">
          This tool gives general information. It helps you find LEASE guidance.
          It does not provide personalised legal advice.
        </p>
      </aside>
      <ResultContact />
      <StartAgainButton onStartAgain={onStartAgain} />
    </>
  );
};

export default KnownResult;
