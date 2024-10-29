import React, { useContext, useState } from 'react';
import { includes, filter, map, isEmpty, reduce } from 'lodash';
import { Button } from 'antd';

import { TaskResultRunPageItemFragment } from '@app/components/labInstance/graphql/taskResult.fragment.generated';
import PlateEditor from '@app/components/PlateEditor';
import Checkbox from '@app/components/Checkbox';
import useSaveAnswerToQuestion from '@app/components/labInstance/mutations/useSaveAnswerToQuestion';
import TaskContext from '@app/components/labInstance/contexts/taskContext';
import { TaskRunPageOptionItemFragment } from '@app/components/labInstance/graphql/taskOption.fragment.generated';
import { TaskResultStatusType } from '@leia-devops-labs/graphql';

import styles from './index.module.css';
import taskStyles from '../../index.module.scss';

interface Props {
  taskResult: TaskResultRunPageItemFragment;
}

const MultipleAnswersQuestion: React.FC<Props> = ({ taskResult }) => {
  const { task } = taskResult;

  const { status, setStatus } = useContext(TaskContext);
  const [savedAnswers, setSavedAnswers] = useState<string[] | null>(null);
  const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

  const { saveAnswerToQuestion, loading } = useSaveAnswerToQuestion();

  const onClickOption = (optionId: string) => {
    if (!isEmpty(savedAnswers)) {
      return;
    }

    if (includes(checkedOptions, optionId)) {
      setCheckedOptions(filter(checkedOptions, (item) => item !== optionId));
    } else {
      setCheckedOptions([...checkedOptions, optionId]);
    }
  };

  const handleSaveAnswers = async () => {
    const allAnswersPassed = reduce(
      task.options,
      (acc, option: TaskRunPageOptionItemFragment) => {
        if (!acc) {
          return false;
        }

        if (option.isPass) {
          return includes(checkedOptions, option.id);
        }

        return !includes(checkedOptions, option.id);
      },
      true,
    );

    if (allAnswersPassed) {
      const res = await saveAnswerToQuestion(taskResult.id, checkedOptions);

      if (res) {
        setSavedAnswers(map(res, 'taskOptionId'));
        setStatus(TaskResultStatusType.Success);
      }
    } else {
      setSavedAnswers(checkedOptions);
      setStatus(TaskResultStatusType.Error);
    }
  };

  const handleClearAnswers = () => {
    setCheckedOptions([]);
    setSavedAnswers(null);
  };

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
          {map(task.options, (option, index) => (
            <div className={styles.optionWrapper} key={option.id}>
              <div
                className={styles.optionContentWrapper}
                onClick={() => onClickOption(option.id)}
                onKeyDown={() => onClickOption(option.id)}
                tabIndex={0}
                role="button"
                aria-label={`Option ${index + 1}`}
              >
                <Checkbox
                  viewResultMode={!isEmpty(savedAnswers)}
                  checked={includes(checkedOptions, option.id)}
                  isPass={option.isPass}
                />

                <div style={{ maxWidth: 'calc(100% - 28px)', flexGrow: 1 }}>
                  <PlateEditor
                    value={option.value || undefined}
                    mode="simple"
                    readonly
                    paddingVariant="ghost"
                  />
                </div>
              </div>

              {option.comment && !isEmpty(savedAnswers) && (
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

        {isEmpty(savedAnswers) && !isEmpty(checkedOptions) && (
          <Button
            className={styles.saveButton}
            type="primary"
            size="large"
            disabled={isEmpty(checkedOptions)}
            onClick={handleSaveAnswers}
            loading={loading}
          >
            Узнать ответ
          </Button>
        )}

        {!isEmpty(savedAnswers) && status !== TaskResultStatusType.Success && (
          <Button
            className={styles.saveButton}
            type="primary"
            size="large"
            onClick={handleClearAnswers}
            loading={loading}
          >
            Попробовать еще раз
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultipleAnswersQuestion;
