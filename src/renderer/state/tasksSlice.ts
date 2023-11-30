import { createSlice } from '@reduxjs/toolkit';

export const tasksSlice = createSlice({
  name: 'taskGraph',
  initialState: {
    nodes: [],
    edges: []
  },
  reducers: {
    // toggleFullscreen: (state) => {
    //   state.fullscreen = !state.fullscreen;
    // },
    // toggleBoard: (state) => {
    //   state.board = !state.board;
    // }
  }
});

// Action creators are generated for each case reducer function
export const {} = tasksSlice.actions;

export default tasksSlice.reducer;
