import styles from './Board.module.css';
import React from 'react';
import {TextField, Typography} from '@mui/material';
import {DateCalendar, TimeClock} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';
import {useAtom} from "jotai";
import {nowSelectedAtom, Task} from "../../state/tasksAtoms.ts";

export default function Board() {

    const [nowSelected, setNowSelected] = useAtom(nowSelectedAtom);

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNowSelected({
            type: 'modify-node',
            reference: {
                ...nowSelected.reference!,
                name: e.target.value,
            },
        })
    };

    const onGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNowSelected({
            type: 'modify-node',
            reference: {
                ...nowSelected.reference!,
                goal: e.target.value,
            },
        })
    };

    const onDateChange = (date: Dayjs | null) => {
        setNowSelected({
            type: 'modify-node',
            reference: {
                ...nowSelected.reference!,
                date: date!.toString(),
            },
        });
    };

    const onTimeChange = (date: Dayjs | null) => {
        console.log(date);
        setNowSelected({
            type: 'modify-node',
            reference: {
                ...nowSelected.reference!,
                time: date!.toString(),
            },
        });
    };

    return (
        <div className={styles.Board}>
            <TextField
                label={'Name'}
                variant={'outlined'}
                defaultValue={(nowSelected.reference! as Task).name}
                onChange={onNameChange}
            />
            <TextField
                label="Goal"
                multiline
                rows={5}
                defaultValue={(nowSelected.reference! as Task).goal}
                onChange={onGoalChange}
            />
            <DateCalendar
                onChange={onDateChange}
            />
            <div>
                <Typography
                    variant="h5"
                    gutterBottom
                    style={{
                        textAlign: 'center',
                    }}
                >
                    {dayjs((nowSelected.reference! as Task).time).format('HH:mm')}
                </Typography>
                <TimeClock
                    onChange={onTimeChange}
                    defaultValue={dayjs((nowSelected.reference! as Task).time)}
                    views={['hours', 'minutes']}
                />
            </div>
        </div>
    );
}
