import { configureStore } from '@reduxjs/toolkit';
import generatedFilesReducer from './generatedFilesSlice';
import chatReducer from './chatSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['generatedFiles'], // only persist generatedFiles slice
};

const persistedGeneratedFilesReducer = persistReducer(persistConfig, generatedFilesReducer);

const dummyReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    dummy: dummyReducer,
    generatedFiles: persistedGeneratedFilesReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
