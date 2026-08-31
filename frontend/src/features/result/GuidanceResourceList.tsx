import type { GuidanceResource } from '../../api/triage.ts';
import { resultLinkClassName } from './resultLinkClassName.ts';

type GuidanceResourceListProps = {
  heading: string;
  headingId: string;
  resources: GuidanceResource[];
};

const GuidanceResourceList = ({
  heading,
  headingId,
  resources,
}: GuidanceResourceListProps) => {
  if (resources.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={headingId} className="border-t border-line py-6">
      <h2 className="mb-4 text-2xl font-bold" id={headingId}>
        {heading}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-6 p-0">
        {resources.map((resource) => (
          <li key={resource.url}>
            <h3 className="mb-1 text-lg font-bold">{resource.title}</h3>
            <p className="mb-2">{resource.summary}</p>
            <a className={resultLinkClassName} href={resource.url}>
              {resource.linkText}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GuidanceResourceList;
