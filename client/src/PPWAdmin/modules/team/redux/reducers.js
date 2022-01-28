import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getMembers } from "./services";

export const actionTypes = {
    getMembersAction: '[Get Members Action]',
    getMembersSuccess: '[Get Members Success]',
};

const initialState = {
    members: [],
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "team", whitelist: [] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getMembersAction:
                return { ...state, loading: true }

            case actionTypes.getMembersSuccess:
                return { ...state, loading: false, members: action.members }

            default:
                return state;
        }
    }
);

export const actions = {
    getMembersAction: () => ({ type: actionTypes.getMembersAction }),
    getMembersSuccess: (members) => ({ type: actionTypes.getMembersSuccess, members }),
};

export function* saga() {
    yield takeLatest(actionTypes.getMembersAction, function* getMembersActionSaga() {
        try {
            const { data } = yield getMembers();
            yield put(actions.getMembersSuccess(data));
        } catch (error) {
            yield put(actions.getMembersSuccess([]));
        }
    });
}
