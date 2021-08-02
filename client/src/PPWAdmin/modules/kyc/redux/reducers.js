import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getVerifications } from "./services";

export const actionTypes = {
    getVerifications: "Get Verifications Activities",
    getVerificationsSuccess: "Get Verifications Success",
};

const initialState = {
    verifications: [],
    total: 0,
    currentPage: 1,
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "verifications", whitelist: [] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getVerifications:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getVerificationsSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            default:
                return state;
        }
    }
);

export const actions = {
    getVerifications: (page = 1) => ({ type: actionTypes.getVerifications, page }),
    getVerificationsSuccess: (data) => ({ type: actionTypes.getVerificationsSuccess, data }),
};

export function* saga() {
    yield takeLatest(actionTypes.getVerifications, function* getVerificationsSaga() {
        try {
            const state = yield select((state) => state.kyc);
            const { data } = yield getVerifications(state.currentPage, state.filter);
            yield put(actions.getVerificationsSuccess({ verifications: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getVerificationsSuccess({ verifications: [], total: 0 }));
        }
    });
}
