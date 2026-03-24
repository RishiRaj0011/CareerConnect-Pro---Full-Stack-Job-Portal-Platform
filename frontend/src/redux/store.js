import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice    from "./authSlice";
import jobSlice     from "./jobSlice";
import companySlice from "./companySlice";

// Redux owns only UI state:
//   auth    → logged-in user, loading flag (persisted — survives page refresh)
//   job     → searchedQuery, searchJobByText (transient search inputs)
//   company → searchCompanyByText (transient search input)
//
// All server/API data is owned by TanStack Query (jobs, companies, applications, etc.)

const persistConfig = {
    key:     "root",
    version: 1,
    storage,
    whitelist: ["auth"], // only persist auth — search state should reset on refresh
};

const rootReducer = combineReducers({
    auth:    authSlice,
    job:     jobSlice,
    company: companySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;
