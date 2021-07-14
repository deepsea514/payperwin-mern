import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getAdmins } from "./services";

export const actionTypes = {
    getAdminsAction: "Get Admins Action",
    getAdminsSuccess: "Get Admins Success",
    filterAdminChangeAction: "Filter Admin Change Action",
};

const initialState = {
    admins: [],
    total: 0,
    currentPage: 1,
    loading: false,
    filter: {
        role: 'all'
    },
};

export const reducer = persistReducer(
    { storage, key: "admin", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getAdminsAction:
                return { ...state, loading: true }

            case actionTypes.getAdminsSuccess:
                return { ...state, ...action.payload, loading: false }

            case actionTypes.filterAdminChangeAction:
                return { ...state, filter: { ...state.filter, ...action.filter } }

            default:
                return state;
        }
    }
);

export const actions = {
    getAdminsAction: (page = 1) => ({ type: actionTypes.getAdminsAction, page }),
    getAdminsSuccess: (payload) => ({ type: actionTypes.getAdminsSuccess, payload }),
    filterAdminChangeAction: (filter) => ({ type: actionTypes.filterAdminChangeAction, filter }),
};

export function* saga() {
    yield takeLatest(actionTypes.getAdminsAction, function* getAdminsActionSaga() {
        try {
            const state = yield select((state) => state.admin);
            const { data } = yield getAdmins(state.currentPage, state.filter);
            yield put(actions.getAdminsSuccess({ admins: data.data, total: data.total, currentPage: data.page }));
        } catch (error) {
            yield put(actions.getAdminsSuccess({ admins: [], total: 0, currentPage: 1 }));
        }
    })

    yield takeLatest(actionTypes.filterAdminChangeAction, function* filterAdminChangeActionSaga() {
        yield put(actions.getAdminsAction());
    })
}
