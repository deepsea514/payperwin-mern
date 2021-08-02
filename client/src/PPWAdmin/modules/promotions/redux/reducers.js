import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getPromotions } from "./services";

export const actionTypes = {
    getPromotionsAction: "Get Promotions [Action]",
    getPromotionSuccess: "Get Promotions [Success]",
};

const initialState = {
    promotions: [],
    total: 0,
    currentPage: 1,
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "promotions", whitelist: [] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getPromotionsAction:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getPromotionSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            default:
                return state;
        }
    }
);

export const actions = {
    getPromotionsAction: (page = 1) => ({ type: actionTypes.getPromotionsAction, page }),
    getPromotionSuccess: (data) => ({ type: actionTypes.getPromotionSuccess, data }),
};

export function* saga() {
    yield takeLatest(actionTypes.getPromotionsAction, function* getPromotionsSaga() {
        try {
            const state = yield select((state) => state.promotions);
            const { data } = yield getPromotions(state.currentPage);
            yield put(actions.getPromotionSuccess({ promotions: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getPromotionSuccess({ promotions: [], total: 0 }));
        }
    });
}
