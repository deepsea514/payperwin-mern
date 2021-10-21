import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getPlaceBets } from "./services";

export const actionTypes = {
    getPlaceBetsAction: "Get PlaceBet [Action]",
    getPlaceBetsSuccess: "Get PlaceBet [Success]",
    updatePlaceBetSuccess: "Update PlaceBet [Success]",
};

const initialState = {
    placebets: [],
    sportLeagues: [],
    selectedSport: 0,
    selectedSportLeague: 0,
    total: 0,
    currentPage: 1,
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "wager-feeds", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getPlaceBetsAction:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getPlaceBetsSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            case actionTypes.updatePlaceBetSuccess:
                const PlaceBets = state.placebets.map(bet => {
                    if (bet._id == action.id)
                        return action.data;
                    return bet;
                });
                return { ...state, ...{ placebets } };

            default:
                return state;
        }
    }
);

export const actions = {
    getPlaceBetsAction: (page = 1) => ({ type: actionTypes.getPlaceBetsAction, page }),
    getPlaceBetsSuccess: (data) => ({ type: actionTypes.getPlaceBetsSuccess, data }),
    updatePlaceBetSuccess: (id, data) => ({ type: actionTypes.updatePlaceBetSuccess, id, data }),
};

export function* saga() {
    yield takeLatest(actionTypes.getPlaceBetsAction, function* getPlaceBetsSaga() {
        try {
            const state = yield select((state) => state.placebets);
            const { data } = yield getPlaceBets(state.currentPage);
            
            yield put(actions.getPlaceBetsSuccess({ placebets: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getPlaceBetsSuccess({ placebets: [], total: 0 }));
        }
    });
}


