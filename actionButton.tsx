import { FC, useContext } from 'react';
import { findIndex } from 'lodash';
import { Button } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';

import { TaskResultStatusType } from '@leia-devops-labs/graphql';

import { LabRunPageInstanceFragment } from '../../graphql/labInstance.fragment.generated';
import { TaskResultRunPageItemFragment } from '../../graphql/taskResult.fragment.generated';
import styles from './index.module.scss';
import TaskContext from '../../contexts/taskContext';
import useNextTask from '../../mutations/useNextTask';

type Props = {
  labInstance: LabRunPageInstanceFragment;
};

const ActionButton: FC<Props> = ({ labInstance }) => {
  const { status, resetContext } = useContext(TaskContext);

  const taskResult = labInstance.currentTask as TaskResultRunPageItemFragment;
  const task = taskResult?.task;
  const currentTaskIndex = findIndex(
    labInstance.lab.tasks,
    (item) => item.id === task.id,
  );
  const isLastTask = currentTaskIndex === labInstance.lab.tasks.length - 1;

  const { nextTask, loading: switchingTask } = useNextTask();

  const handleSendMessage = () => {
    if (!labInstance) {
      return;
    }

    const messageJSON = JSON.stringify({
      type: 'finishLabInstance',
      data: {
        labId: labInstance.lab.id,
        labInstanceId: labInstance.id,
        status: 'success',
      },
    });

    window.top?.postMessage(messageJSON, '*');
  };

  const handleNextTask = async () => {
    if (labInstance.currentTask?.id) {
      await nextTask(
        labInstance.id,
        taskResult.id,
        status || TaskResultStatusType.Error,
      ).then(() => {
        if (isLastTask) {
          handleSendMessage();
        }
      });

      resetContext();
    }
  };

  return (
    <div
      className={styles.nextButtonWrapper}
      style={{ gridArea: 'next-button' }}
    >
      {!status && !isLastTask && (
        <Button
          type="link"
          onClick={handleNextTask}
          loading={switchingTask}
          style={{
            height: 'min-centent',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Пропустить <RightCircleOutlined style={{ fontSize: 16 }} />
        </Button>
      )}

      {!status && isLastTask && (
        <Button
          type="link"
          onClick={handleNextTask}
          loading={switchingTask}
          style={{
            height: 'min-centent',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Пропустить и завершить{' '}
          <RightCircleOutlined style={{ fontSize: 16 }} />
        </Button>
      )}

      {status && !isLastTask && (
        <Button
          type="primary"
          onClick={handleNextTask}
          loading={switchingTask}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Следующий <RightCircleOutlined style={{ fontSize: 16 }} />
        </Button>
      )}

      {status && isLastTask && (
        <Button
          type="primary"
          onClick={handleNextTask}
          loading={switchingTask}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Завершить <RightCircleOutlined style={{ fontSize: 16 }} />
        </Button>
      )}
    </div>
  );
};

export default ActionButton;
