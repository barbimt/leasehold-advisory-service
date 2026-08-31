const Header = () => {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex w-full max-w-wrapper items-start gap-3 px-4 py-4 sm:items-center sm:gap-4 sm:px-6 sm:py-6">
        <img
          src="/favicon.png"
          alt="Leasehold Advisory Service"
          width={48}
          height={48}
          className="mt-0.5 size-10 shrink-0 rounded-sm sm:mt-0 sm:size-12"
        />
        <div className="min-w-0">
          <p className="m-0 text-xl font-bold leading-tight tracking-wide sm:text-2xl">
            Leasehold Advisory Service
          </p>
          <p className="m-0 mt-1 text-sm leading-snug text-accent sm:text-base">
            Independent guidance for leaseholders in England and Wales
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
