import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getWithdrawLog } from "./services";

export const actionTypes = {
    getWithdrawLog: "Get Withdraw Logs",
    getWithdrawLogSuccess: "Get Withdraw Logs Success",
    updateWithdrawStatusSuccess: "Update Withdraw Status Success",
    filterWithdrawChange: "Filter Withdraw Change",
};

const initialState = {
    withdrawlogs: [],
    total: 0,
    currentPage: 1,
    loading: false,
    pending_total: 0,
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
    { storage, key: "withdrawlogs", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getWithdrawLog:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getWithdrawLogSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            case actionTypes.updateWithdrawStatusSuccess:
                const withdrawlogs = state.withdrawlogs.map(log => {
                    if (log._id == action.id)
                        return action.data;
                    return log;
                });
                return { ...state, ...{ withdrawlogs } };

            case actionTypes.filterWithdrawChange:
                return { ...state, ...{ filter: { ...state.filter, ...action.filter } } };

            default:
                return state;
        }
    }
);

export const actions = {
    getWithdrawLog: (page = 1) => ({ type: actionTypes.getWithdrawLog, page }),
    getWithdrawLogSuccess: (data) => ({ type: actionTypes.getWithdrawLogSuccess, data }),
    updateWithdrawStatusSuccess: (id, data) => ({ type: actionTypes.updateWithdrawStatusSuccess, id, data }),
    filterWithdrawChange: (filter) => ({ type: actionTypes.filterWithdrawChange, filter }),
};

export function* saga() {
    yield takeLatest(actionTypes.getWithdrawLog, function* getWithdrawLogSaga() {
        try {
            const state = yield select((state) => state.withdrawlog);
            const { data } = yield getWithdrawLog(state.currentPage, state.filter);
            yield put(actions.getWithdrawLogSuccess({ withdrawlogs: data.data, total: data.total, pending_total: data.pending_total }));
        } catch (error) {
            yield put(actions.getWithdrawLogSuccess({ withdrawlogs: [], total: 0, pending_total: 0 }));
        }
    });

    yield takeLatest(actionTypes.filterWithdrawChange, function* filterChangeSaga() {
        yield put(actions.getWithdrawLog());
    });
}
