import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getCashback } from "./services";

export const actionTypes = {
    getCashback: "Get Cashback Action",
    getCashbackSuccess: "Get Cashback Action Success",
    filterCashbackChange: "Filter Cashback Change Action",
};

const today = new Date();
const initialState = {
    cashbacks: [],
    total: 0,
    currentPage: 1,
    loading: false,
    filter: {
        year: today.getFullYear(),
        month: today.getMonth(),
    }
};

export const reducer = persistReducer(
    { storage, key: "cashback", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getCashback:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getCashbackSuccess:
                return { ...state, ...action.payload, ...{ loading: false } };

            case actionTypes.filterCashbackChange:
                return { ...state, ...{ filter: { ...state.filter, ...action.filter } } };

            default:
                return state;
        }
    }
);

export const actions = {
    getCashback: (page = 1) => ({ type: actionTypes.getCashback, page }),
    getCashbackSuccess: (payload) => ({ type: actionTypes.getCashbackSuccess, payload }),
    filterCashbackChange: (filter) => ({ type: actionTypes.filterCashbackChange, filter }),
};

export function* saga() {
    yield takeLatest(actionTypes.getCashback, function* getCashbackSaga() {
        try {
            const state = yield select((state) => state.cashback);
            const { data } = yield getCashback(state.currentPage, state.filter);
            yield put(actions.getCashbackSuccess({ cashbacks: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getCashbackSuccess({ cashbacks: [], total: 0 }));
        }
    });

    yield takeLatest(actionTypes.filterCashbackChange, function* filterCashbackChangeSaga() {
        yield put(actions.getCashback());
    });
}
