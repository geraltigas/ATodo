import styles from './Flow.module.css';
import { Background, Controls, ReactFlow } from 'reactflow';
import React, { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Dialog } from '@mui/material';

let callbackArray: Array<(event: KeyboardEvent) => void> = [];

export default function Flow() {

  const nodes = useSelector((state: RootState) => state.tasks.nodes);
  const edges = useSelector((state: RootState) => state.tasks.edges);

  const [showDialog, setShowDialog] = React.useState(false);
  const showDialogRef = useRef(showDialog);

  const onDialogClose = useCallback(() => {

  }, []);

  const keyDownChecker = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'a':
      case 'A':
        setShowDialog((prev) => {
          return !prev;
        });
        break;
      case 'd':
      case 'D':
        break;
      case 'Escape':
        setShowDialog(false);
        break;
      case 'Enter':
        console.log('showDialog: ', showDialogRef.current);
        break;
      default:
        break;
    }
  }, [showDialog]);

  const onMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    for (let i = 0; i < callbackArray.length; i++) {
      document.removeEventListener('keydown', callbackArray[i]);
    }
    document.addEventListener('keydown', keyDownChecker);
    callbackArray.push(keyDownChecker);
  };

  const onMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    for (let i = 0; i < callbackArray.length; i++) {
      document.removeEventListener('keydown', callbackArray[i]);
    }
    callbackArray = [];
  };

  return (
    <div className={styles.Flow} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <ReactFlow nodes={nodes} edges={edges} snapToGrid={true} snapGrid={[15, 15]}>
        <Background />
        <Controls />
      </ReactFlow>
      <Dialog open={showDialog} onClose={onDialogClose}>
        <h1>Dialog</h1>
      </Dialog>
    </div>
  );
}
