import './PrototypeBanner.scss';

const PrototypeBanner = () => {
  return (
    <div className="app__banner">
      <div className="app__banner__container">
        <div className="govuk-phase-banner">
          <p className="govuk-phase-banner__content">
            <strong className="govuk-tag govuk-phase-banner__content__tag">
              Prototype
            </strong>
            <span className="govuk-phase-banner__text">
              This is a prototype. It is for exploring how people find leasehold
              guidance. It is not a live service.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrototypeBanner;
