import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getCredits } from "./services";

export const actionTypes = {
    getCreditsAction: "[Get Credits Action]",
    getCreditsSuccess: "[Get Credits Success]",
};

const initialState = {
    credits: [],
    total: 0,
    currentPage: 1,
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "credits", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getCreditsAction:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getCreditsSuccess:
                return { ...state, ...action.payload, loading: false };

            default:
                return state;
        }
    }
);

export const actions = {
    getCreditsAction: (page = 1) => ({ type: actionTypes.getCreditsAction, page }),
    getCreditsSuccess: (payload) => ({ type: actionTypes.getCreditsSuccess, payload }),
};

export function* saga() {
    yield takeLatest(actionTypes.getCreditsAction, function* getCreditsSaga() {
        try {
            const state = yield select((state) => state.credits);
            const { data } = yield getCredits(state.currentPage);
            yield put(actions.getCreditsSuccess({ credits: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getCreditsSuccess({ credits: [], total: 0 }));
        }
    });
}
