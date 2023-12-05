// export const onNodeClickedAtom = atom(
//     (_get) => {
//         return (_event: React.MouseEvent, _node: TaskNodeShow) => {
//             console.log("nodeClickedAtom");
//         }
//     },
// );
//
// export const onEdgeClickedAtom = atom(
//     (_get) => {
//         return (_event: React.MouseEvent, _edge: TaskEdgeShow) => {
//             console.log("edgeClickedAtom");
//         }
//     },
// );
//
// export const onEdgeConnectedAtom = atom(
//     (_get,) => {
//         return (_params: Connection) => {
//             console.log("connectAtom");
//         }
//     },
// );
//
// export const onMouseLeaveFlowAtom = atom(
//     (_get) => {
//         return (_event: React.MouseEvent<HTMLDivElement, MouseEvent>,) => {
//             console.log("mouseLeaveFlowAtom");
//             const setEnterFlow = useSetAtom(enteredFlowAtom);
//             setEnterFlow(false);
//         }
//     },
// );
//
// export const onMouseEnterFlowAtom = atom(
//     (_get) => {
//         return (_event: React.MouseEvent<HTMLDivElement, MouseEvent>,) => {
//             console.log("mouseEnterFlowAtom");
//             const setEnterFlow = useSetAtom(enteredFlowAtom);
//             setEnterFlow(true);
//         }
//     },
// );


// export const documentEventsAtom = atom<Map<string, CallBack>>(
//     (get) => {
//         let events = new Map<string, CallBack>();
//         if (get(enteredFlowAtom)) {
//             // keyboard events
//             events.set("keydown", (event: KeyboardEvent) => {
//                 console.log("keydown", event.key)
//             });
//         }
//         return events;
//     }
// );