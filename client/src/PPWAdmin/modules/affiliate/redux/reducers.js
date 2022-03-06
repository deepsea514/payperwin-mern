import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";

export const actionTypes = {
};

const initialState = {
    affiliates: [],
    total: 0,
    currentPage: 1,
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "affiliates", whitelist: ['filter'] },
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
