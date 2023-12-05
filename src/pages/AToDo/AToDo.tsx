import styles from './AToDo.module.css';
import Flow from '../../components/Flow/Flow';

export default function AToDo() {
    // const [nowClickedNodeId, setNowClickedNodeId] = useAtom();
    // const [nowClickedNode, setNowClickedNode] = useAtom();

    return (
        <div className={styles.AToDo}>
            <Flow
                // setNowClickNode={setNowClickedNodeId}
                // taskToEditId={nowClickedNodeId}
            />
            {/*{nowClickedNode !== null && (*/}
            {/*    <Board*/}
            {/*        nowClickedNode={nowClickedNode!}*/}
            {/*        setNowClickedNode={setNowClickedNode}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
}
