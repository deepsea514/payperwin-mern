import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUser } from "./services";
import categories from "../data/categories.json";
import regions from "../data/regions.json";
import localities_ca from "../data/localities_ca.json";
import localities_us from "../data/localities_us.json";

export const actionTypes = {
    getUserAction: "Get User Action",
    setUserAction: "Set User Action",
};

const initialState = {
    user: null,
    categories: categories,
    regions: regions.CA,
    localities_ca: localities_ca,
    localities_us: localities_us,
    time_options: [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'tomorrow', label: 'Tomorrow' },
        { value: 'this_week', label: 'This Week' },
        { value: 'next_week', label: 'Next Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'next_month', label: 'Next Month' },
        { value: 'this_year', label: 'This Year' },
    ]
};

export const reducer = persistReducer(
    { storage, key: "ppw-ticket", whitelist: [] },
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
}