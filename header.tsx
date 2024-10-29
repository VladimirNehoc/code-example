import { FC, useMemo } from 'react';
import { Tabs } from 'antd';

import Timer from './timer';
import { LabRunPageDataQuery } from '../../graphql/data.query.generated';

export type TabKey = 'task' | 'hint' | 'solution';

interface Props {
  currentTabKey: TabKey;
  setCurrentTabKey: React.Dispatch<React.SetStateAction<TabKey>>;
  labInstance: LabRunPageDataQuery['labInstance'];
}

const Header: FC<Props> = ({
  currentTabKey,
  setCurrentTabKey,
  labInstance,
}) => {
  const handleSwitchTab = (key: TabKey) => {
    setCurrentTabKey(key);
  };

  const taskResult = labInstance.currentTask;

  const tabItems = useMemo(
    () => [
      {
        key: 'task',
        label: 'Task',
      },
      {
        key: 'hint',
        label: 'Hint',
        disabled: !taskResult?.task.hint,
      },
    ],
    [labInstance],
  );

  return (
    <Tabs
      onChange={(key) => handleSwitchTab(key as TabKey)}
      activeKey={currentTabKey}
      type="card"
      size="small"
      items={tabItems}
      tabBarExtraContent={
        <Timer
          startDate={labInstance.createdAt}
          timeLimit={labInstance.lab.timeLimit}
          labInstanceId={labInstance.id}
        />
      }
    />
  );
};

export default Header;
