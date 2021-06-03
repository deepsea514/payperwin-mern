import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getDepositLog } from "./services";

export const actionTypes = {
    getDepositLog: "Get Deposit Logs",
    getDepositLogSuccess: "Get Deposit Logs Success",
    updateDepositStatusSuccess: "Update Deposit Status Success",
    filterDepositChange: "Filter Deposit Change",
};

const initialState = {
    depositlogs: [],
    total: 0,
    currentPage: 1,
    loading: false,
    filter: {
        datefrom: '',
        dateto: '',
        status: '',
        method: '',
        minamount: '',
        maxamount: '',
    },
    reasons: []
};

export const reducer = persistReducer(
    { storage, key: "depositlogs", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getDepositLog:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getDepositLogSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            case actionTypes.updateDepositStatusSuccess:
                const depositlogs = state.depositlogs.map(log => {
                    if (log._id == action.id)
                        return action.data;
                    return log;
                });
                return { ...state, ...{ depositlogs } };

            case actionTypes.filterDepositChange:
                return { ...state, ...{ filter: { ...state.filter, ...action.filter } } };

            default:
                return state;
        }
    }
);

export const actions = {
    getDepositLog: (page = 1) => ({ type: actionTypes.getDepositLog, page }),
    getDepositLogSuccess: (data) => ({ type: actionTypes.getDepositLogSuccess, data }),
    updateDepositStatusSuccess: (id, data) => ({ type: actionTypes.updateDepositStatusSuccess, id, data }),
    filterDepositChange: (filter) => ({ type: actionTypes.filterDepositChange, filter }),
};

export function* saga() {
    yield takeLatest(actionTypes.getDepositLog, function* getDepositLogSaga() {
        try {
            const state = yield select((state) => state.depositlog);
            const { data } = yield getDepositLog(state.currentPage, state.filter);
            yield put(actions.getDepositLogSuccess({ depositlogs: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getDepositLogSuccess({ depositlogs: [], total: 0 }));
        }
    });

    yield takeLatest(actionTypes.filterDepositChange, function* filterChangeSaga() {
        yield put(actions.getDepositLog());
    });
}
