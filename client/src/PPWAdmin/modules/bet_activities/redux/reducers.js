import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getBetActivities } from "./services";

export const actionTypes = {
    getBetActivities: "Get Bet Activities",
    getBetActivitiesSuccess: "Get Bet Activities Success",
    filterBetActivitiesChange: "Filter Bet Activities Change",
    getSportsSuccess: "Get Sports Success",
};

const initialState = {
    bet_activities: [],
    total: 0,
    currentPage: 1,
    loading: false,
    filter: {
        datefrom: '',
        dateto: '',
        sport: '',
        status: '',
        minamount: '',
        maxamount: '',
        house: 'p2p',
        match: '',
        email: ''
    },
    sports: [],
};

export const reducer = persistReducer(
    { storage, key: "bet-activities", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getBetActivities:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getBetActivitiesSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            case actionTypes.filterBetActivitiesChange:
                return { ...state, ...{ filter: { ...state.filter, ...action.filter } } };

            case actionTypes.getSportsSuccess:
                return { ...state, ...{ sports: action.sports } };

            default:
                return state;
        }
    }
);

export const actions = {
    getBetActivities: (page = 1) => ({ type: actionTypes.getBetActivities, page }),
    getBetActivitiesSuccess: (data) => ({ type: actionTypes.getBetActivitiesSuccess, data }),
    filterBetActivitiesChange: (filter) => ({ type: actionTypes.filterBetActivitiesChange, filter }),
    getSportsSuccess: (sports) => ({ type: actionTypes.getSportsSuccess, sports }),
};

export function* saga() {
    yield takeLatest(actionTypes.getBetActivities, function* getBetActivitiesSaga() {
        try {
            const state = yield select((state) => state.bet_activities);
            const { data } = yield getBetActivities(state.currentPage, state.filter);
            yield put(actions.getBetActivitiesSuccess({ bet_activities: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getBetActivitiesSuccess({ bet_activities: [], total: 0 }));
        }
    });

    yield takeLatest(actionTypes.filterBetActivitiesChange, function* filterChangeSaga() {
        yield put(actions.getBetActivities());
    });
}
