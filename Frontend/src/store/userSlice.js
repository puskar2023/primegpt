import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUser(state, action) {
      state.user = action.payload || null;
    }
}
});

export const { loadUser } = userSlice.actions;
export default userSlice.reducer;