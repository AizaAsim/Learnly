import { combineSlices, configureStore } from '@reduxjs/toolkit';
import appHealth from "./reducers/appHealthReducer";
import {
  NotificationState,
  CreatorStatsState,
  CreatorProfileState,
  CreatorDetailsState,
  BlockedReelState,
  HomeReelsState,
  MyVideosState,
  PaymentMethodsState,
  ReelUploadState,
  SavedReelsState,
  SearchState,
  SubscribersSliceState,
} from './types';

const rootReducer = combineSlices({
  [appHealth.name]: appHealth.reducer,
}).withLazyLoadedSlices<LazyLoadedSlices>()

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

export interface LazyLoadedSlices {
  notifications: NotificationState,
  creatorStats: CreatorStatsState,
  creatorProfile: CreatorProfileState,
  creatorDetails: CreatorDetailsState,
  blockedReel: BlockedReelState,
  homeReels: HomeReelsState,
  myVideos: MyVideosState,
  paymentMethods: PaymentMethodsState,
  reelUpload: ReelUploadState,
  savedReels: SavedReelsState,
  searchCreator: SearchState,
  learners: SubscribersSliceState,
}
