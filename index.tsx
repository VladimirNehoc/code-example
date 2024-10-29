'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';

import { TaskType } from '@leia-devops-labs/graphql';
import { TaskResultRunPageItemFragment } from '../../graphql/taskResult.fragment.generated';
import SplitLabContext from '../../contexts/splitLabContext';

import { LabRunPageInstanceFragment } from '../../graphql/labInstance.fragment.generated';
import Header, { TabKey } from './header';
import Hint from './hint';
import InfoContent from './contents/info';
import CheckProgressContent from './contents/checkProgress';
import MultipleChoiceContent from './contents/multipleChoice';

import styles from './index.module.scss';
import InfoBlock from './info';

type Props = {
  labInstance: LabRunPageInstanceFragment;
};

const LabInstanceTask: React.FC<Props> = ({ labInstance }) => {
  const [currentTabKey, setCurrentTabKey] = useState<TabKey>('task');
  const { enabledFullscreen } = useContext(SplitLabContext);
  const taskResult = labInstance.currentTask as TaskResultRunPageItemFragment;
  const task = taskResult?.task;

  useEffect(() => {
    setCurrentTabKey('task');
  }, [labInstance.currentTask]);

  const taskContent = useMemo(() => {
    switch (task?.taskType) {
      case TaskType.Info:
        return <InfoContent task={task} />;
      case TaskType.MultipleChoice:
        return <MultipleChoiceContent taskResult={taskResult} />;
      case TaskType.CheckProgress:
        return <CheckProgressContent task={task} />;
      default:
        return null;
    }
  }, [taskResult]);

  return (
    <div
      className={styles.wrapper}
      style={{ display: enabledFullscreen === 'terminal' ? 'none' : undefined }}
    >
      <Header
        currentTabKey={currentTabKey}
        setCurrentTabKey={setCurrentTabKey}
        labInstance={labInstance}
      />

      <div className={styles.taskContentWrapper}>
        <InfoBlock labInstance={labInstance} />

        {currentTabKey === 'task' && taskContent}

        {currentTabKey === 'hint' && task.hint && <Hint task={task} />}
      </div>
    </div>
  );
};

export default LabInstanceTask;
