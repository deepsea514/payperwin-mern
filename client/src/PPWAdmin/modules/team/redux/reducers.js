import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";

export const actionTypes = {
};

const initialState = {
    members: [],
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "team", whitelist: [] },
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
