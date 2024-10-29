import { Typography } from 'antd';
import { FC, useContext, useEffect } from 'react';

import { TaskResultRunPageItemFragment } from '@app/components/labInstance/graphql/taskResult.fragment.generated';
import PlateEditor from '@app/components/PlateEditor';
import TaskContext from '@app/components/labInstance/contexts/taskContext';
import { TaskResultStatusType } from '@leia-devops-labs/graphql';

import styles from '../../index.module.scss';

interface Props {
  task: TaskResultRunPageItemFragment['task'];
}

const InfoContent: FC<Props> = ({ task }) => {
  const { status, setStatus } = useContext(TaskContext);

  useEffect(() => {
    setStatus(TaskResultStatusType.Success);
  }, [status]);

  const { name } = task;

  return (
    <div className={styles.task}>
      <Typography.Title level={2}>{name}</Typography.Title>

      <PlateEditor
        readonly
        initialValue={task.content || undefined}
        paddingVariant="ghost"
      />
    </div>
  );
};

export default InfoContent;
