import './PrivacyNotice.scss';

const PrivacyNotice = () => {
  return (
    <aside
      className="enquiry__privacy"
      aria-labelledby="privacy-notice-heading"
    >
      <div className="govuk-inset-text">
        <h2 className="enquiry__privacy__title" id="privacy-notice-heading">
          Keep your information private
        </h2>
        <p>
          Do not include names, addresses, account numbers or other personal
          information. We only need a short description of the situation.
        </p>
      </div>
    </aside>
  );
};

export default PrivacyNotice;
