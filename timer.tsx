import { ClockCircleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';

import styles from './index.module.scss';
import useCheckLabInstanceStatus from '../../mutations/useCheckLabInstanceStatus';

interface TimerProps {
  startDate: string;
  timeLimit: number;
  labInstanceId: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const Timer: React.FC<TimerProps> = ({
  startDate,
  timeLimit,
  labInstanceId,
}) => {
  const [timeLeftState, setTimeLeftState] = useState<TimeLeft | null>(null);

  const { checkLabStatus } = useCheckLabInstanceStatus();

  function calculateTimeLeft(): TimeLeft {
    const now = new Date();
    const targetTime = new Date(startDate);
    targetTime.setMinutes(targetTime.getMinutes() + timeLimit);

    const difference = targetTime.getTime() - now.getTime();

    let timeLeft: TimeLeft;

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  }

  useEffect(() => {
    if (
      Number(timeLeftState?.hours) +
        Number(timeLeftState?.minutes) +
        Number(timeLeftState?.seconds) ===
      0
    ) {
      setTimeout(() => checkLabStatus(labInstanceId), 2000);
    }
  }, [timeLeftState]);

  useEffect(() => {
    setTimeLeftState(calculateTimeLeft());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const calculatedTimeLeft = calculateTimeLeft();

      setTimeLeftState((prev) =>
        isEqual(calculatedTimeLeft, prev) ? prev : calculatedTimeLeft,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, timeLimit]);

  const formatTime = (time: number) => String(time).padStart(2, '0');

  return (
    <div
      className={styles.timer}
      style={{ width: Number(timeLeftState?.hours) > 0 ? 80 : 60 }}
    >
      {timeLeftState && (
        <Typography.Text type="secondary">
          <ClockCircleOutlined />
          &nbsp;
          {timeLeftState.hours > 0 && `${formatTime(timeLeftState.hours)}:`}
          {`${formatTime(timeLeftState.minutes)}:${formatTime(timeLeftState.seconds)}`}
        </Typography.Text>
      )}
    </div>
  );
};

export default Timer;
