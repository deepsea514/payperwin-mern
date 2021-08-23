import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getProfitReports } from "./services";

export const actionTypes = {
    getProfitReports: "Get Profit Report",
    getProfitReportsSuccess: "Get Profit Report Success",
    filterProfitChange: "Count Profit Change",
};

const initialState = {
    profits: [],
    loading_profits: false,
    total_profits: 0,
    currentPage_profits: 1,
    filter_profits: {
        datefrom: null,
        dateto: null,
        type: 'all',
    }
};

export const reducer = persistReducer(
    { storage, key: "reports", whitelist: ['filter_profits'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getProfitReports:
                return { ...state, loading_profits: true, currentPage_profits: action.page };

            case actionTypes.getProfitReportsSuccess:
                return { ...state, ...action.data, loading_profits: false };

            case actionTypes.filterProfitChange:
                return { ...state, filter_profits: { ...state.filter_profits, ...action.filter } };

            default:
                return state;
        }
    }
);

export const actions = {
    getProfitReports: (page = 1) => ({ type: actionTypes.getProfitReports, page }),
    getProfitReportsSuccess: (data) => ({ type: actionTypes.getProfitReportsSuccess, data }),
    filterProfitChange: (filter) => ({ type: actionTypes.filterProfitChange, filter }),
};

export function* saga() {
    yield takeLatest(actionTypes.getProfitReports, function* getProfitReportsSaga() {
        try {
            const state = yield select((state) => state.reports);
            const { data } = yield getProfitReports(state.currentPage_profits, state.filter_profits);
            yield put(actions.getProfitReportsSuccess({ profits: data.data, total_profits: data.total, }));
        } catch (error) {
            yield put(actions.getProfitReportsSuccess({ profits: [], total: 0 }));
        }
    });

    yield takeLatest(actionTypes.filterProfitChange, function* countChangeSaga() {
        yield put(actions.getProfitReports());
    });
}
