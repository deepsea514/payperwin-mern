import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getTickets } from "./services";

export const actionTypes = {
    getTickets: "Get Tickets Activities",
    getTicketsSuccess: "Get Tickets Success",
};

const initialState = {
    tickets: [],
    total: 0,
    currentPage: 1,
    loading: false,
    status: 'new',
};

export const reducer = persistReducer(
    { storage, key: "tickets", whitelist: [] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getTickets:
                return { ...state, ...{ loading: true, currentPage: action.page, status: action.status } };

            case actionTypes.getTicketsSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            default:
                return state;
        }
    }
);

export const actions = {
    getTickets: (status = 'new', page = 1) => ({ type: actionTypes.getTickets, page, status }),
    getTicketsSuccess: (data) => ({ type: actionTypes.getTicketsSuccess, data }),
};

export function* saga() {
    yield takeLatest(actionTypes.getTickets, function* getTicketsSaga() {
        try {
            const state = yield select((state) => state.tickets);
            const { data } = yield getTickets(state.currentPage, state.status);
            yield put(actions.getTicketsSuccess({ tickets: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getTicketsSuccess({ tickets: [], total: 0 }));
        }
    });
}
