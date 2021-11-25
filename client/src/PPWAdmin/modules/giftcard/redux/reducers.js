import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getGiftCards } from "./services";

export const actionTypes = {
    getGiftCardsAction: "[Get Gift Cards Action]",
    getGiftCardsSuccess: "[Get Gift Cards Success]",
    filterGiftCardChange: "[Filter Gift Card Change]",
};

const initialState = {
    gift_cards: [],
    total: 0,
    currentPage: 1,
    loading: false,
    filter: {
        status: 'all'
    },
};

export const reducer = persistReducer(
    { storage, key: "gift-cards", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getGiftCardsAction:
                return { ...state, loading: true, currentPage: action.page };

            case actionTypes.getGiftCardsSuccess:
                return { ...state, loading: false, ...action.payload };

            case actionTypes.filterGiftCardChange:
                return { ...state, filter: { ...state.filter, ...action.filter } };
            default:
                return state;
        }
    }
);

export const actions = {
    getGiftCardsAction: (page = 1) => ({ type: actionTypes.getGiftCardsAction, page }),
    getGiftCardsSuccess: (payload) => ({ type: actionTypes.getGiftCardsSuccess, payload }),
    filterGiftCardChange: (filter) => ({ type: actionTypes.filterGiftCardChange, filter }),
};

export function* saga() {
    yield takeLatest(actionTypes.getGiftCardsAction, function* getGiftCardsSaga() {
        try {
            const state = yield select((state) => state.gift_cards);
            const { data } = yield getGiftCards(state.currentPage, state.filter);
            yield put(actions.getGiftCardsSuccess({ gift_cards: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getGiftCardsSuccess({ gift_cards: [], total: 0 }));
        }
    });

    yield takeLatest(actionTypes.filterGiftCardChange, function* filterChangeSaga() {
        yield put(actions.getGiftCardsAction());
    });
}
