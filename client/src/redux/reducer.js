import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { setPreferences } from "./services";
import Cookie from 'js-cookie';

export const actionTypes = {
    setPreference: "[Set Preference Action]",
    setLanguage: "[Set Language Action]",
    setOddsFormat: "[Set Odd Format Action]",
    setDateFormat: "[Set Date Format Action]",
    setDisplayMode: "[Set Display Mode Action]",
    setTimezone: "[Set Timezone Action]",
    setSearch: "[Set Search Action]",
    acceptCookieAction: "[Accept Cookie Action]",
    require2FAAction: "[Require 2FA Action]",
};

const initialState = {
    lang: 'en',
    oddsFormat: 'american',
    dateFormat: 'DD-MM-YYYY',
    timezone: null,
    display_mode: 'light',
    search: '',
    acceptCookie: Cookie.get('acceptCookie'),
    require_2fa: false,
};

export const reducer = persistReducer(
    { storage, key: "ppw-frontend", whitelist: ['lang', 'oddsFormat', 'acceptCookie', 'timezone'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.setPreference:
                if (action.preference)
                    return { ...state, ...action.preference };
                return initialState;

            case actionTypes.setLanguage:
                return { ...state, lang: action.lang };

            case actionTypes.setOddsFormat:
                return { ...state, oddsFormat: action.oddsFormat };

            case actionTypes.setDateFormat:
                return { ...state, dateFormat: action.dateFormat };

            case actionTypes.setDisplayMode:
                return { ...state, display_mode: action.display_mode };

            case actionTypes.setTimezone:
                return { ...state, timezone: action.timezone };

            case actionTypes.setSearch:
                return { ...state, search: action.search };

            case actionTypes.acceptCookieAction:
                Cookie.set('acceptCookie', true);
                return { ...state, acceptCookie: true };

            case actionTypes.require2FAAction:
                return { ...state, require_2fa: action.require_2fa };

            default:
                return state;
        }
    }
);

export const actions = {
    setPreference: (preference) => ({ type: actionTypes.setPreference, preference }),
    setLanguage: (lang = 'en') => ({ type: actionTypes.setLanguage, lang }),
    setOddsFormat: (oddsFormat = 'american') => ({ type: actionTypes.setOddsFormat, oddsFormat }),
    setTimezone: (timezone) => ({ type: actionTypes.setTimezone, timezone }),
    setDisplayMode: (display_mode) => ({ type: actionTypes.setDisplayMode, display_mode }),
    setDateFormat: (dateFormat) => ({ type: actionTypes.setDateFormat, dateFormat }),
    setSearch: (search = '') => ({ type: actionTypes.setSearch, search }),
    acceptCookieAction: () => ({ type: actionTypes.acceptCookieAction }),
    require2FAAction: (require_2fa = true) => ({ type: actionTypes.require2FAAction, require_2fa }),
};

export function* saga() {
    yield takeLatest(actionTypes.setOddsFormat, function* setOddsFormatSaga() {
        try {
            const oddsFormat = yield select((state) => state.frontend.oddsFormat);
            yield setPreferences({ oddsFormat });
        } catch (error) {
            console.log('error', error);
        }
    });

    yield takeLatest(actionTypes.setDisplayMode, function* setDisplayModeSaga() {
        try {
            const display_mode = yield select((state) => state.frontend.display_mode);
            yield setPreferences({ display_mode });
        } catch (error) {
            console.log('error', error);
        }
    });
}
