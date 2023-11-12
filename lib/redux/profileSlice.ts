import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    const token = Cookies.get("token");
    if (!token) {
      return thunkAPI.rejectWithValue("Access token not found");
    }
    const response = await axios.get("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null as unknown,
  },
  reducers: {
    setProfile: (state, action) => {
      state.data = action.payload;
    },
    clearProfile: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
