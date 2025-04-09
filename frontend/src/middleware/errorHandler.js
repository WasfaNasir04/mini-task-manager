import { createAsyncThunk } from '@reduxjs/toolkit';

export const withErrorHandler = (type, payloadCreator) => {
  return createAsyncThunk(type, async (arg, thunkAPI) => {
    try {
      return await payloadCreator(arg, thunkAPI);
    } catch (error) {
      if (error.response) {
        // Server responded with error
        return thunkAPI.rejectWithValue(error.response.data);
      } else if (error.request) {
        // Request made but no response
        return thunkAPI.rejectWithValue({ message: 'No response from server' });
      } else {
        // Something else went wrong
        return thunkAPI.rejectWithValue({ message: error.message });
      }
    }
  });
};
