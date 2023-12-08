import React from 'react';
import {NodeProps} from 'reactflow';
import AddIcon from '@mui/icons-material/Add';
import styles from './OriginNode.module.css';

const OriginNode: React.FC<NodeProps> = () => {
    return (
        <AddIcon fontSize={'large'} color={'error'} className={styles.OriginNode}/>
    );
};

export default OriginNode;