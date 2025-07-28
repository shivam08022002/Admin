import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth';
import messageReducer from '../reducers/message';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
