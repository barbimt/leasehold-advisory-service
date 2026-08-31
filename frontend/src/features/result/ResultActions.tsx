import { appLinkClassName } from '../../components/appLinkClassName.ts';

type ResultActionsProps = {
  onChangeAnswers: () => void;
  onStartAgain: () => void;
};

const actionClassName = `cursor-pointer border-0 bg-transparent p-0 text-left ${appLinkClassName.default}`;

const ResultActions = ({
  onChangeAnswers,
  onStartAgain,
}: ResultActionsProps) => {
  return (
    <div className="flex flex-col items-start gap-4">
      <button
        className={actionClassName}
        type="button"
        onClick={onChangeAnswers}
      >
        Change my answers
      </button>
      <button className={actionClassName} type="button" onClick={onStartAgain}>
        Start again with a different question
      </button>
    </div>
  );
};

export default ResultActions;
