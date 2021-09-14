import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getErrorLogs } from "./services";

export const actionTypes = {
    getErrorLogs: "Get Error Logs",
    getErrorLogsSuccess: "Get Error Logs Success",
};

const initialState = {
    errorlogs: [],
    loading: false,
    currentPage: 1,
    total: 0
};

export const reducer = persistReducer(
    { storage, key: "errorlogs", whitelist: [''] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getErrorLogs:
                return { ...state, loading: true, currentPage: action.page };

            case actionTypes.getErrorLogsSuccess:
                return { ...state, ...action.data, loading: false };

            default:
                return state;
        }
    }
);

export const actions = {
    getErrorLogs: (page = 1) => ({ type: actionTypes.getErrorLogs, page }),
    getErrorLogsSuccess: (data) => ({ type: actionTypes.getErrorLogsSuccess, data }),
};

export function* saga() {
    yield takeLatest(actionTypes.getErrorLogs, function* getErrorLogsSaga() {
        try {
            const state = yield select((state) => state.errorlogs);
            const { data } = yield getErrorLogs(state.page);
            yield put(actions.getErrorLogsSuccess({ errorlogs: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getErrorLogsSuccess({ errorlogs: [], total: 0 }));
        }
    });
}
