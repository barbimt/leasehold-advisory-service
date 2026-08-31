import InsetNotice from '../../components/InsetNotice.tsx';

const GeneralInformation = () => {
  return (
    <InsetNotice labelledBy="result-general-info-heading" className="mb-6">
      <h2 className="mb-2 text-lg font-bold" id="result-general-info-heading">
        General information
      </h2>
      <p className="m-0">
        This tool gives general information. It helps you find LEASE guidance.
        It does not provide personalised legal advice.
      </p>
    </InsetNotice>
  );
};

export default GeneralInformation;
