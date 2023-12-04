import React from 'react';
import { NodeProps } from 'reactflow';
import AddIcon from '@mui/icons-material/Add';
import styles from './OriginNode.module.css';

export const OriginNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <AddIcon fontSize={'large'} color={'error'} className={styles.OriginNode} />
  );
};
