import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import playReducer from "./play";
import loginReducer from "./login";
import songsReducer from "./songs";
import ilikeReducer from "./ilike";

const rootReducer = combineReducers({
  play: playReducer,
  login: loginReducer,
  songs: songsReducer,
  ilike: ilikeReducer,
});

// 状态持久化配置
const persistConfig = {
  key: "root",
  storage,
  // 注意： 这里的黑名单是 playSlice 的 name 值 ; 写在这块的数据不会存在storage
  blacklist: ["play"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// 持久化store
export const persist = persistStore(store);

export default store;
