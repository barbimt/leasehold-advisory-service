import './PrototypeBanner.scss';

const PrototypeBanner = () => {
  return (
    <div className="app__banner">
      <div className="app__banner__container">
        <p className="app__banner__content">
          <strong className="app__banner__tag">Prototype</strong>
          <span className="app__banner__text">
            This is a prototype. It is for exploring how people find leasehold
            guidance. It is not a live service.
          </span>
        </p>
      </div>
    </div>
  );
};

export default PrototypeBanner;
