import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { includes, isEmpty, map, reduce, uniq } from 'lodash';
import { Button, Spin, theme } from 'antd';

import { TaskResultRunPageItemFragment } from '@app/components/labInstance/graphql/taskResult.fragment.generated';
import PlateEditor from '@app/components/PlateEditor';
import useSaveAnswerToQuestion from '@app/components/labInstance/mutations/useSaveAnswerToQuestion';
import TaskContext from '@app/components/labInstance/contexts/taskContext';
import { TaskRunPageOptionItemFragment } from '@app/components/labInstance/graphql/taskOption.fragment.generated';
import { TaskResultStatusType } from '@leia-devops-labs/graphql';

import styles from './index.module.css';
import taskStyles from '../../index.module.scss';

const { useToken } = theme;

interface Props {
  taskResult: TaskResultRunPageItemFragment;
}

const OneAnswerQuestion: React.FC<Props> = ({ taskResult }) => {
  const { setStatus } = useContext(TaskContext);
  const { task } = taskResult;
  const [savedAnswers, setSavedAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { token } = useToken();

  const { saveAnswerToQuestion, loading } = useSaveAnswerToQuestion();

  useEffect(() => {
    if (!isEmpty(savedAnswers) && task) {
      const hasPassedAnswer = reduce(
        task.options,
        (acc, option) =>
          acc || (option.isPass && includes(savedAnswers, option.id)),
        false,
      );

      if (hasPassedAnswer) {
        setStatus(TaskResultStatusType.Success);
      } else {
        setStatus(TaskResultStatusType.Error);
      }
    }
  }, [savedAnswers]);

  const onClickOption = async (optionId: string) => {
    if (includes(savedAnswers, optionId) || loading) {
      return;
    }

    setSelectedOption(optionId);
    const res = await saveAnswerToQuestion(
      taskResult.id,
      uniq([optionId, ...savedAnswers]),
    );

    if (res) {
      setSavedAnswers(map(res, 'taskOptionId'));
      setSelectedOption(null);
    }
  };

  const successStyle: CSSProperties = {
    backgroundColor: token.colorSuccess,
  };

  const errorStyle: CSSProperties = {
    backgroundColor: token.colorError,
  };

  const getButtonStyle = (option: TaskRunPageOptionItemFragment) =>
    option.isPass ? successStyle : errorStyle;

  return (
    <div className={taskStyles.task}>
      <div className={styles.wrapper}>
        <PlateEditor
          value={task.content || undefined}
          mode="simple"
          readonly
          paddingVariant="ghost"
        />

        <div className={styles.optionsList}>
          {map(task.options, (option) => (
            <div className={styles.oneAnswerOptionWrapper} key={option.id}>
              <Button
                key={option.id}
                onClick={() => onClickOption(option.id)}
                className={styles.answerButton}
                style={
                  includes(savedAnswers, option.id)
                    ? getButtonStyle(option)
                    : undefined
                }
              >
                <PlateEditor
                  value={option.value || undefined}
                  mode="simple"
                  readonly
                  paddingVariant="ghost"
                />

                {option.id === selectedOption && loading && (
                  <div className={styles.loadingWrapper}>
                    <Spin />
                  </div>
                )}
              </Button>

              {option.comment && includes(savedAnswers, option.id) && (
                <div
                  className={styles.commentWrapper}
                  style={{
                    backgroundColor: option.isPass ? '#22c55e14' : '#ef444414',
                  }}
                >
                  <PlateEditor
                    value={option.comment}
                    mode="simple"
                    readonly
                    paddingVariant="ghost"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OneAnswerQuestion;
