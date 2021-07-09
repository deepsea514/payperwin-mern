import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getArticleDrafts, getCategories } from "./services";

export const actionTypes = {
    getArticlesAction: "Get Articles Action",
    getArticlesSuccess: "Get Articles Success",
    getArticleCategoriesAction: "Get Article Categories Action",
    getArticleCategoriesSuccess: "Get Article Categories Success",
};

const initialState = {
    article_drafts: [],
    total_drafts: 0,
    currentPage_drafts: 1,
    loading_drafts: false,

    categories: [],
    loading_categories: false,
};

export const reducer = persistReducer(
    { storage, key: "articles", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getArticlesAction:
                return { ...state, loading_drafts: true, currentPage_drafts: action.page }
            case actionTypes.getArticlesSuccess:
                return { ...state, ...action.payload, loading_drafts: false }
            case actionTypes.getArticleCategoriesAction:
                return { ...state, loading_categories: true, }
            case actionTypes.getArticleCategoriesSuccess:
                return { ...state, ...action.payload, loading_categories: false }
            default:
                return state;
        }
    }
);

export const actions = {
    getArticlesAction: (page = 1) => ({ type: actionTypes.getArticlesAction, page }),
    getArticlesSuccess: (payload) => ({ type: actionTypes.getArticlesSuccess, payload }),
    getArticleCategoriesAction: () => ({ type: actionTypes.getArticleCategoriesAction }),
    getArticleCategoriesSuccess: (payload) => ({ type: actionTypes.getArticleCategoriesSuccess, payload })
};

export function* saga() {
    yield takeLatest(actionTypes.getArticleCategoriesAction, function* getArticleCategoriesActionSaga() {
        try {
            const { data } = yield getCategories();
            yield put(actions.getArticleCategoriesSuccess({ categories: data }));
        } catch (error) {
            yield put(actions.getArticleCategoriesSuccess({ categories: [] }));
        }
    });

    yield takeLatest(actionTypes.getArticlesAction, function* getArticlesActionSaga() {
        try {
            const state = yield select((state) => state.articles);
            const { data } = yield getArticleDrafts(state.currentPage_drafts);
            yield put(actions.getArticlesSuccess({ article_drafts: data.data, total_drafts: data.total }));
        } catch (error) {
            yield put(actions.getArticlesSuccess({ article_drafts: [], total_drafts: 0 }));
        }
    })
}
