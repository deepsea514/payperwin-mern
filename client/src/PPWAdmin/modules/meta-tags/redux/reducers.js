import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import pages from "./pages.json";

export const actionTypes = {
};

const initialState = {
    pages: pages
};

export const reducer = persistReducer(
    { storage, key: "meta-tags", whitelist: [] },
    (state = initialState, action) => {
        switch (action.type) {
            default:
                return state;
        }
    }
);

export const actions = {
};

export function* saga() {
}
