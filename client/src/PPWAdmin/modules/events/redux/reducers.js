import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getEvents } from "./services";
import config from "../../../../../../config.json";
const EventStatus = config.EventStatus;

export const actionTypes = {
    getEvents: "Get Events",
    getEventsSuccess: "Get Events Success",
    filterEventChange: "Filter Event Change",
};

const initialState = {
    events: [],
    total: 0,
    currentPage: 1,
    loading: false,
    pending_total: 0,
    filter: {
        status: EventStatus['pending'].value,
    },
};

export const reducer = persistReducer(
    { storage, key: "events", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getEvents:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getEventsSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            case actionTypes.filterEventChange:
                return { ...state, ...{ filter: { ...state.filter, ...action.filter } } };

            default:
                return state;
        }
    }
);

export const actions = {
    getEvents: (page = 1) => ({ type: actionTypes.getEvents, page }),
    getEventsSuccess: (data) => ({ type: actionTypes.getEventsSuccess, data }),
    filterEventChange: (filter) => ({ type: actionTypes.filterEventChange, filter }),
};

export function* saga() {
    yield takeLatest(actionTypes.getEvents, function* getEventsSaga() {
        try {
            const state = yield select((state) => state.events);
            const { data } = yield getEvents(state.currentPage, state.filter);
            yield put(actions.getEventsSuccess({ events: data.data, total: data.total, pending_total: data.pending_total }));
        } catch (error) {
            yield put(actions.getEventsSuccess({ events: [], total: 0, pending_total: 0 }));
        }
    });

    yield takeLatest(actionTypes.filterEventChange, function* filterChangeSaga() {
        yield put(actions.getEvents());
    });
}
