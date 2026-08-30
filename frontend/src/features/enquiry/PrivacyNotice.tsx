const PrivacyNotice = () => {
  return (
    <aside className="mb-10" aria-labelledby="privacy-notice-heading">
      <div className="border-l-8 border-brand bg-surface py-3 pl-6 pr-4">
        <h2 className="mb-2 text-xl font-bold" id="privacy-notice-heading">
          Keep your information private
        </h2>
        <p className="m-0">
          Do not include names, addresses, account numbers or other personal
          information. We only need a short description of the situation.
        </p>
      </div>
    </aside>
  );
};

export default PrivacyNotice;
