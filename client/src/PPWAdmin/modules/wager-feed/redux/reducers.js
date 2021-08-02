import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";

export const actionTypes = {
};

const initialState = {
    wager_feeds: [],
    total: 0,
    currentPage: 1,
    loading: false,
    filter: {
        // datefrom: '',
        // dateto: '',
        // sport: '',
        // status: '',
        // minamount: '',
        // maxamount: '',
        // house: '',
        // match: '',
    },
    // sports: [],
};

export const reducer = persistReducer(
    { storage, key: "wager-feeds", whitelist: ['filter'] },
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
