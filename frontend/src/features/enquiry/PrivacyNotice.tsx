import InsetNotice from '../../components/InsetNotice.tsx';

const PrivacyNotice = () => {
  return (
    <InsetNotice labelledBy="privacy-notice-heading" className="mb-8">
      <h2 className="mb-2 text-xl font-bold" id="privacy-notice-heading">
        Keep your information private
      </h2>
      <p className="m-0">
        Do not include names, addresses, account numbers or other personal
        information. We only need a short description of the situation.
      </p>
    </InsetNotice>
  );
};

export default PrivacyNotice;
