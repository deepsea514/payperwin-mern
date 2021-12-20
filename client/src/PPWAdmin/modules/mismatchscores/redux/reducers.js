import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getMismatchScores } from "./services";

export const actionTypes = {
    getMismatchScoresAction: "[Get Mismatch Scores Action]",
    getMismatchScoresSuccess: "[Get Mismatch Scores Success]",
};

const initialState = {
    mismatch_scores: [],
    total: 0,
    currentPage: 1,
    loading: false,
    filter: {},
};

export const reducer = persistReducer(
    { storage, key: "wager-feeds", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getMismatchScoresAction:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getMismatchScoresSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            default:
                return state;
        }
    }
);

export const actions = {
    getMismatchScoresAction: (page = 1) => ({ type: actionTypes.getMismatchScoresAction, page }),
    getMismatchScoresSuccess: (data) => ({ type: actionTypes.getMismatchScoresSuccess, data }),
};

export function* saga() {
    yield takeLatest(actionTypes.getMismatchScoresAction, function* getMismatchScoresSaga() {
        try {
            const state = yield select((state) => state.mismatch_scores);
            const { data } = yield getMismatchScores(state.currentPage);
            yield put(actions.getMismatchScoresSuccess({ mismatch_scores: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getMismatchScoresSuccess({ mismatch_scores: [], total: 0 }));
        }
    });
}
