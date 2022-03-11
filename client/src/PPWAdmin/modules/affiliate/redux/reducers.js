import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getAffiliates } from "./services";

export const actionTypes = {
    getAffiliatesAction: "Get Affiliates Action",
    setAffiliatesAction: "Set Affiliates Action",
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
            case actionTypes.getAffiliatesAction:
                return {
                    ...state,
                    loading: true,
                }

            case actionTypes.setAffiliatesAction:
                return {
                    ...state,
                    loading: false,
                    ...action.payload
                }

            default:
                return state;
        }
    }
);

export const actions = {
    getAffiliatesAction: (page = 1) => ({ type: actionTypes.getAffiliatesAction, payload: page }),
    setAffiliatesAction: (payload) => ({ type: actionTypes.setAffiliatesAction, payload }),
};

export function* saga() {
    yield takeLatest(actionTypes.getAffiliatesAction, function* getAffiliatesSaga(action) {
        try {
            const { data } = yield getAffiliates(action.payload);
            yield put(actions.setAffiliatesAction({
                affiliates: data.affiliates,
                total: data.total,
                currentPage: data.page
            }));
        } catch (error) {
            yield put(actions.setAffiliatesAction({ affiliates: [], total: 0, currentPage: 1 }));
        }
    })
}
