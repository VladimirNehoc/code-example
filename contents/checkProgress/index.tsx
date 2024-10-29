import { Button, Typography } from 'antd';
import { FC, useContext } from 'react';

import { TaskResultRunPageItemFragment } from '@app/components/labInstance/graphql/taskResult.fragment.generated';
import TaskContext from '@app/components/labInstance/contexts/taskContext';
import { TaskResultStatusType } from '@leia-devops-labs/graphql';
import PlateEditor from '@app/components/PlateEditor';

import styles from '../../index.module.scss';

interface Props {
  task: TaskResultRunPageItemFragment['task'];
}

const CheckProgressContent: FC<Props> = ({ task }) => {
  const { setStatus } = useContext(TaskContext);

  const handleCheckTask = () => {
    setStatus(TaskResultStatusType.Success);
  };

  const { name } = task;

  return (
    <div className={styles.task}>
      <Typography.Title level={2}>{name}</Typography.Title>

      <PlateEditor
        readonly
        initialValue={task.content || undefined}
        paddingVariant="ghost"
      />

      <div className={styles.checkButtonWrapper}>
        <Button
          type="primary"
          size="large"
          onClick={handleCheckTask}
          loading={false}
        >
          Проверить
        </Button>
      </div>
    </div>
  );
};

export default CheckProgressContent;
