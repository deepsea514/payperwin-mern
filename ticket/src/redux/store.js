import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { reduxBatch } from "@manaflair/redux-batch";
import { persistStore } from "redux-persist";
import { reducer, saga } from "./reducers";

const sagaMiddleware = createSagaMiddleware();
const middleware = [
    ...getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
        thunk: true
    }),
    sagaMiddleware
];

const store = configureStore({
    reducer: reducer,
    middleware,
    devTools: process.env.NODE_ENV !== "production",
    enhancers: [reduxBatch]
});

export const persistor = persistStore(store);

sagaMiddleware.run(saga);

export default store;
