import {Button} from "@mui/material";
import styles from "./TaskShow.module.css"

function TaskShow() {


    return (
        <div>
            <div className={styles.showGoal}>
                ok
            </div>
            <div className={styles.buttons}>
                <Button size="small" variant="contained" color="error">Inter</Button>
                <Button size="small" variant="contained">Pause</Button>
                <Button size="small" variant="contained" color="success">Done</Button>
            </div>
        </div>
    )
}

export default TaskShow