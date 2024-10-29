import { FC, useMemo } from 'react';
import { findIndex, get, map } from 'lodash';
import { Typography } from 'antd';

import { TaskResultStatusType } from '@leia-devops-labs/graphql';
import StepsBlock, { StepItem } from '@app/components/steps';

import { LabRunPageInstanceFragment } from '../../graphql/labInstance.fragment.generated';
import { TaskResultRunPageItemFragment } from '../../graphql/taskResult.fragment.generated';
import styles from './index.module.scss';
import ActionButton from './actionButton';

type Props = {
  labInstance: LabRunPageInstanceFragment;
};

const InfoBlock: FC<Props> = ({ labInstance }) => {
  const taskResult = labInstance.currentTask as TaskResultRunPageItemFragment;
  const task = taskResult?.task;
  const currentTaskIndex = findIndex(
    labInstance.lab.tasks,
    (item) => item.id === task?.id,
  );

  const items: StepItem[] = useMemo(
    () =>
      map(labInstance.lab.tasks, (item, index) => {
        const currentTaskResult = labInstance.results[index];

        if (item.id === task.id) {
          return { status: 'process' };
        }

        if (index < currentTaskIndex) {
          if (currentTaskResult?.status) {
            return {
              status:
                currentTaskResult?.status === TaskResultStatusType.Success
                  ? 'success'
                  : 'error',
            };
          }

          return { status: 'error' };
        }

        return { status: 'wait' };
      }),
    [labInstance],
  );

  return (
    <div className={styles.infoWrapper}>
      <StepsBlock
        items={items}
        style={{ gridArea: 'steps-block', justifySelf: 'center' }}
      />

      <ActionButton labInstance={labInstance} />

      <div style={{ gridArea: 'tasks-count' }}>
        <Typography.Text style={{ whiteSpace: 'nowrap' }}>
          {`${currentTaskIndex + 1} / ${get(labInstance, 'lab.tasks', []).length}`}
        </Typography.Text>
      </div>
    </div>
  );
};

export default InfoBlock;
