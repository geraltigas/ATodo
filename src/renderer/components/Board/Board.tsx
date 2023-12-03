import styles from './Board.module.css';
import { TaskNodeShow } from '../Flow/Flow';
import React from 'react';
import { TextField, Typography } from '@mui/material';
import { DateCalendar, TimeClock } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

export default function Board({
  nowClickedNode,
  setNowClickedNode,
}: {
  nowClickedNode: TaskNodeShow;
  setNowClickedNode: (node: TaskNodeShow) => void;
}) {
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNowClickedNode({
      ...nowClickedNode,
      data: {
        ...nowClickedNode.data,
        realTask: {
          ...nowClickedNode.data.realTask!,
          name: e.target.value,
        },
      },
    });
  };

  const onGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNowClickedNode({
      ...nowClickedNode,
      data: {
        ...nowClickedNode.data,
        realTask: {
          ...nowClickedNode.data.realTask!,
          goal: e.target.value,
        },
      },
    });
  };

  const onDateChange = (date: Dayjs | null) => {
    setNowClickedNode({
      ...nowClickedNode,
      data: {
        ...nowClickedNode.data,
        realTask: {
          ...nowClickedNode.data.realTask!,
          date: date,
        },
      },
    });
  };

  const onTimeChange = (date: Dayjs | null) => {
    setNowClickedNode({
      ...nowClickedNode,
      data: {
        ...nowClickedNode.data,
        realTask: {
          ...nowClickedNode.data.realTask!,
          time: date,
        },
      },
    });
  };

  return (
    <div className={styles.Board}>
      <TextField
        label={'Name'}
        variant={'outlined'}
        value={nowClickedNode.data.realTask!.name}
        onChange={onNameChange}
      />
      <TextField
        label="Goal"
        multiline
        rows={5}
        value={nowClickedNode.data.realTask!.goal}
        onChange={onGoalChange}
      />
      <DateCalendar
        onChange={onDateChange}
        value={nowClickedNode.data.realTask!.date}
      />
      <div>
        <Typography
          variant="h5"
          gutterBottom
          style={{
            textAlign: 'center',
          }}
        >
          {nowClickedNode.data.realTask!.time!.format('HH:mm')}
        </Typography>
        <TimeClock
          onChange={onTimeChange}
          value={nowClickedNode.data.realTask!.time}
          views={['hours', 'minutes']}
        />
      </div>
    </div>
  );
}
