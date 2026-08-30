type StartAgainButtonProps = {
  onStartAgain: () => void;
};

const StartAgainButton = ({ onStartAgain }: StartAgainButtonProps) => {
  return (
    <button
      className="cursor-pointer border-0 bg-transparent p-0 text-left text-brand underline underline-offset-2 transition-colors duration-150 hover:text-brand-hover motion-reduce:transition-none"
      type="button"
      onClick={onStartAgain}
    >
      Start again with a different question
    </button>
  );
};

export default StartAgainButton;
