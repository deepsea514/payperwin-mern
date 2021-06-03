import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getAutoBets } from "./services";

export const actionTypes = {
    getAutoBetsAction: "Get AutoBet [Action]",
    getAutoBetsSuccess: "Get AutoBet [Success]",
    updateAutoBetSuccess: "Update AutoBet [Success]",
};

const initialState = {
    autobets: [],
    total: 0,
    currentPage: 1,
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "wager-feeds", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getAutoBetsAction:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getAutoBetsSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            case actionTypes.updateAutoBetSuccess:
                const autobets = state.autobets.map(bet => {
                    if (bet._id == action.id)
                        return action.data;
                    return bet;
                });
                return { ...state, ...{ autobets } };

            default:
                return state;
        }
    }
);

export const actions = {
    getAutoBetsAction: (page = 1) => ({ type: actionTypes.getAutoBetsAction, page }),
    getAutoBetsSuccess: (data) => ({ type: actionTypes.getAutoBetsSuccess, data }),
    updateAutoBetSuccess: (id, data) => ({ type: actionTypes.updateAutoBetSuccess, id, data }),
};

export function* saga() {
    yield takeLatest(actionTypes.getAutoBetsAction, function* getAutoBetsSaga() {
        try {
            const state = yield select((state) => state.autobets);
            const { data } = yield getAutoBets(state.currentPage);
            yield put(actions.getAutoBetsSuccess({ autobets: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getAutoBetsSuccess({ autobets: [], total: 0 }));
        }
    });
}
