import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getCADRate, getUser, getHomeData } from "./services";
import categories from "../data/categories.json";
import regions from "../data/regions.json";
import localities_ca from "../data/localities_ca.json";
import localities_us from "../data/localities_us.json";

export const actionTypes = {
    getUserAction: "Get User Action",
    setUserAction: "Set User Action",
    getCADRateAction: "Get CAD Rate Action",
    setCADRateAction: "Set CAD Rate Action",
    getHomeDataAction: "Get Home Data Action",
    setHomeDataAction: "Set Home Data Action",
    addToCartAction: "Add To Cart Action",
    updateInCartAction: "Update In Cart Action",
    clearFromCartAction: "Clear From Cart Action",
};

const initialState = {
    user: null,
    categories: categories,
    country_options: [
        {
            value: 'ca',
            label: 'Canada'
        },
        {
            value: 'us',
            label: 'United States'
        }
    ],
    regions_ca: regions.CA,
    regions_us: regions.US,
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
    ],
    cad_rate: 1.2601734, // Default CAD Rate
    total_events: 0,
    total_venues: 0,
    total_performers: 0,
    cart: {
        count: 1,
        ticket_group: null,
    },
};

export const reducer = persistReducer(
    { storage, key: "ppw-ticket", whitelist: ['cart', 'user'] },
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

            case actionTypes.setCADRateAction:
                return {
                    ...state,
                    rate: action.rate
                }

            case actionTypes.setHomeDataAction:
                return {
                    ...state,
                    ...action.payload
                }

            case actionTypes.addToCartAction:
                return {
                    ...state,
                    cart: { count: action.payload.splits[0], ticket_group: action.payload }
                }

            case actionTypes.updateInCartAction:
                return {
                    ...state,
                    cart: {
                        ticket_group: state.cart.ticket_group,
                        count: action.payload.count
                    }
                }

            case actionTypes.clearFromCartAction:
                return {
                    ...state,
                    cart: { count: 0, ticket_group: null }
                }

            default:
                return state;
        }
    }
);

export const actions = {
    getUserAction: (callback = null) => ({ type: actionTypes.getUserAction, callback: callback }),
    setUserAction: (payload = null) => ({ type: actionTypes.setUserAction, payload }),
    getCADRateAction: () => ({ type: actionTypes.getCADRateAction }),
    setCADRateAction: (rate) => ({ type: actionTypes.setCADRateAction, rate }),
    getHomeDataAction: () => ({ type: actionTypes.getHomeDataAction }),
    setHomeDataAction: (payload) => ({ type: actionTypes.setHomeDataAction, payload }),
    addToCartAction: (ticket_group) => ({ type: actionTypes.addToCartAction, payload: ticket_group }),
    updateInCartAction: (count) => ({ type: actionTypes.updateInCartAction, payload: { count } }),
    clearFromCartAction: () => ({ type: actionTypes.clearFromCartAction }),
};

export function* saga() {
    yield takeLatest(actionTypes.getUserAction, function* getUserAction(action) {
        try {
            const { data: user } = yield getUser();
            yield put(actions.setUserAction(user));
            if (action.callback) {
                action.callback();
            }
        } catch (error) {
            yield put(actions.setUserAction(null));
        }
    });

    yield takeLatest(actionTypes.getCADRateAction, function* getCADRateAction() {
        try {
            const { data: { rate } } = yield getCADRate();
            yield put(actions.setCADRateAction(rate));
        } catch (error) { }
    });

    yield takeLatest(actionTypes.getHomeDataAction, function* getHomeDataAction() {
        try {
            const { data: { success, total_events, total_performers, total_venues } } = yield getHomeData();
            if (success) {
                yield put(actions.setHomeDataAction({ total_events, total_performers, total_venues }));
            }
        } catch (error) { }
    })
}