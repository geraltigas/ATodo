import { configureStore } from '@reduxjs/toolkit';
import windowReducer from '../state/windowSlice';
import tasksReducer from '../state/tasksSlice';


const store = configureStore({
  reducer: {
    window: windowReducer,
    tasks: tasksReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
