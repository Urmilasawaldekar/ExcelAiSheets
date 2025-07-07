import { createSlice } from '@reduxjs/toolkit';

const generatedFilesSlice = createSlice({
  name: 'generatedFiles',
  initialState: {
    files: [],
  },
  reducers: {
    addFile: (state, action) => {
      // Add new file to the list
      console.log('addFile reducer called with payload:', action.payload);
      state.files.push(action.payload);
    },
    clearFiles: (state) => {
      state.files = [];
    },
  },
});

export const { addFile, clearFiles } = generatedFilesSlice.actions;

export default generatedFilesSlice.reducer;
