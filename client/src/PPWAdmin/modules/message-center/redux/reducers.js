import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getMessageDrafts } from "./services";

export const actionTypes = {
    getMessagesAction: "Get Messages Action",
    getMessagesSuccess: "Get Messages Success",
};

const initialState = {
    message_drafts: [],
    total: 0,
    currentPage: 1,
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "message-center", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getMessagesAction:
                return { ...state, loading: true, currentPage: action.page }

            case actionTypes.getMessagesSuccess:
                return { ...state, ...action.payload, loading: false }

            default:
                return state;
        }
    }
);

export const actions = {
    getMessagesAction: (page = 1) => ({ type: actionTypes.getMessagesAction, page }),
    getMessagesSuccess: (payload) => ({ type: actionTypes.getMessagesSuccess, payload }),
};

export function* saga() {
    yield takeLatest(actionTypes.getMessagesAction, function* getMessagesActionSaga() {
        try {
            const state = yield select((state) => state.messages);
            const { data } = yield getMessageDrafts(state.currentPage);
            yield put(actions.getMessagesSuccess({ message_drafts: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getMessagesSuccess({ message_drafts: [], total: 0 }));
        }
    });
}
