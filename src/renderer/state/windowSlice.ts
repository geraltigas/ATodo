import { createSlice } from '@reduxjs/toolkit';

export const windowSlice = createSlice({
  name: 'fullscreen',
  initialState: {
    fullscreen: false,
    board: true
  },
  reducers: {
    toggleFullscreen: (state) => {
      state.fullscreen = !state.fullscreen;
    },
    toggleBoard: (state) => {
      state.board = !state.board;
    }
  }
});

// Action creators are generated for each case reducer function
export const { toggleFullscreen, toggleBoard } = windowSlice.actions;

export default windowSlice.reducer;
