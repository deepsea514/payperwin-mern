import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getActiveUsers } from "./services";

export const actionTypes = {
    getActiveUsers: "Get Ative Users",
    getActiveUsersSuccess: "Get Active Users Success",
    countActiveUsersChange: "Count ActiveUsers Change",
};

const initialState = {
    active_users: [],
    loading: false,
    count: 25,
};

export const reducer = persistReducer(
    { storage, key: "active_users", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getActiveUsers:
                return { ...state, loading: true };

            case actionTypes.getActiveUsersSuccess:
                return { ...state, ...action.data, loading: false };

            case actionTypes.countActiveUsersChange:
                return { ...state, ...{ count: action.count } };

            default:
                return state;
        }
    }
);

export const actions = {
    getActiveUsers: () => ({ type: actionTypes.getActiveUsers }),
    getActiveUsersSuccess: (data) => ({ type: actionTypes.getActiveUsersSuccess, data }),
    countActiveUsersChange: (count) => ({ type: actionTypes.countActiveUsersChange, count }),
};

export function* saga() {
    yield takeLatest(actionTypes.getActiveUsers, function* getActiveUsersSaga() {
        try {
            const state = yield select((state) => state.active_users);
            const { data } = yield getActiveUsers(state.count);
            yield put(actions.getActiveUsersSuccess({ active_users: data }));
        } catch (error) {
            yield put(actions.getActiveUsersSuccess({ active_users: [] }));
        }
    });

    yield takeLatest(actionTypes.countActiveUsersChange, function* countChangeSaga() {
        yield put(actions.getActiveUsers());
    });
}
