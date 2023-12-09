import styles from "./Worker.module.css"

const Worker = () => {
    return (
        <div className={styles.WorkerBackground}>
            <div data-tauri-drag-region className="test">
            </div>
        </div>
    )
}

export default Worker