import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getCategories, getUser } from "./services";

export const actionTypes = {
    getUserAction: "Get User Action",
    setUserAction: "Set User Action",
    getCategoriesAction: "Get Categories Action",
    setCategoriesAction: "Set Categories Action",

};

const initialState = {
    user: null,
    categories: [],
};

export const reducer = persistReducer(
    { storage, key: "ppw-ticket", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.setUserAction:
                return {
                    ...state,
                    user: action.payload
                }

            case actionTypes.setCategoriesAction:
                return {
                    ...state,
                    categories: action.payload
                }

            default:
                return state;
        }
    }
);

export const actions = {
    getUserAction: () => ({ type: actionTypes.getUserAction }),
    setUserAction: (payload = null) => ({ type: actionTypes.setUserAction, payload }),
    getCategoriesAction: () => ({ type: actionTypes.getCategoriesAction }),
    setCategoriesAction: (categories) => ({ type: actionTypes.setCategoriesAction, payload: categories }),
};

export function* saga() {
    yield takeLatest(actionTypes.getUserAction, function* getUserAction() {
        try {
            const { data: user } = yield getUser();
            yield put(actions.setUserAction(user))
        } catch (error) {
            yield put(actions.setUserAction(null));
        }
    });

    yield takeLatest(actionTypes.getCategoriesAction, function* getCategoriesAction() {
        try {
            const { data: { success, categories } } = yield getCategories();
            if (success) {
                yield put(actions.setCategoriesAction(categories))
            } else {
                yield put(actions.setCategoriesAction([]));
            }
        } catch (error) {
            yield put(actions.setCategoriesAction([]));
        }
    });
}