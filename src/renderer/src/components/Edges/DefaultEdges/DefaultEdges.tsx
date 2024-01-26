import { BaseEdge, getStraightPath } from 'reactflow'
import { Edge, now_selected } from '../../../state/app'

export default function DefaultEdges({ id, sourceX, sourceY, targetX, targetY }) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY
  })

  let selected = now_selected.value.type === 'edge' && (now_selected.value.reference as Edge).id === id

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: selected ? 'red' : 'black' }} />
    </>
  )
}
