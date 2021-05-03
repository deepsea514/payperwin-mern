import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { setPreferences } from "./services";

export const actionTypes = {
    setPreference: "[Set Preference Action]",
    setLanguage: "[Set Language Action]",
    setOddsFormat: "[Set Odd Format Action]",
    setDateFormat: "[Set Date Format Action]",
    setTimezone: "[Set Timezone Action]",
};

const initialState = {
    lang: 'en',
    oddsFormat: 'american',
    dateFormat: 'DD-MM-YYYY',
    timezone: "-07:00",
};

export const reducer = persistReducer(
    { storage, key: "ppw-frontend", whitelist: ['lang', 'oddsFormat', 'timezone'] },
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

            case actionTypes.setTimezone:
                return { ...state, timezone: action.timezone };

            default:
                return state;
        }
    }
);

export const actions = {
    setPreference: (preference) => ({ type: actionTypes.setPreference, preference }),
    setLanguage: (lang = 'en') => ({ type: actionTypes.setLanguage, lang }),
    setOddsFormat: (oddsFormat = 'american') => ({ type: actionTypes.setOddsFormat, oddsFormat }),
    setTimezone: (timezone = -7) => ({ type: actionTypes.setTimezone, timezone }),
    setDateFormat: (dateFormat = -7) => ({ type: actionTypes.setDateFormat, dateFormat }),
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
}
