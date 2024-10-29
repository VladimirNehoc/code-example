import { FC } from 'react';

import PlateEditor from '@app/components/PlateEditor';
import { TaskRunPageItemFragment } from '../../graphql/task.fragment.generated';

import styles from './index.module.scss';

interface Props {
  task: TaskRunPageItemFragment;
}

const Hint: FC<Props> = ({ task }) => (
  <div className={styles.task}>
    <PlateEditor
      readonly
      initialValue={task.hint ?? undefined}
      paddingVariant="ghost"
    />
  </div>
);

export default Hint;
