import { withSearchCreatorSlice } from "../reducers/searchCreatorReducer";

export const selectSearchCreator = withSearchCreatorSlice.selector(
  (state) => state.searchCreator
);
