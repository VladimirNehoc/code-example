import React from 'react';
import { filter } from 'lodash';

import { TaskResultRunPageItemFragment } from '@app/components/labInstance/graphql/taskResult.fragment.generated';
import OneAnswerQuestion from './oneAnswerQuestion';
import MultipleAnswersQuestion from './multipleAnswersQuestion';

interface Props {
  taskResult: TaskResultRunPageItemFragment;
}

const MultipleChoiceContent: React.FC<Props> = ({ taskResult }) => {
  const { task } = taskResult;

  const isPassOptionsCount = filter(
    task.options,
    (option) => option.isPass,
  ).length;

  if (isPassOptionsCount === 1) {
    return <OneAnswerQuestion taskResult={taskResult} />;
  }

  if (isPassOptionsCount !== 1) {
    return <MultipleAnswersQuestion taskResult={taskResult} />;
  }

  return null;
};

export default MultipleChoiceContent;
