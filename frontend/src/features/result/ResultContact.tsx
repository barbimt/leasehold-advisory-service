import AppLink from '../../components/AppLink.tsx';
import { LEASE_ENQUIRY_URL, LEASE_GET_IN_TOUCH_URL } from './leaseLinks.ts';

const ResultContact = () => {
  return (
    <section
      aria-labelledby="result-contact-heading"
      className="mb-8 rounded-sm border border-line p-4"
    >
      <h2 className="mb-2 text-2xl font-bold" id="result-contact-heading">
        Still not sure what to do?
      </h2>
      <p className="mb-4">
        LEASE offers free initial advice to help you decide what to do next.
      </p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        <li>
          <AppLink href={LEASE_ENQUIRY_URL}>Request advice from LEASE</AppLink>
        </li>
        <li>
          <AppLink href={LEASE_GET_IN_TOUCH_URL}>
            Other ways to get in touch
          </AppLink>
        </li>
      </ul>
    </section>
  );
};

export default ResultContact;
