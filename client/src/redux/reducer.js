import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";

export const actionTypes = {
    setLanguage: "[Set Language Action]",
    setOddFormat: "[Set Odd Format Action]",
};

const initialState = {
    lang: 'en',
    oddFormat: 'american'
};

export const reducer = persistReducer(
    { storage, key: "ppw-frontend", whitelist: ['lang', 'oddFormat'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.setLanguage:
                return { ...state, lang: action.lang };

            case actionTypes.setOddFormat:
                return { ...state, oddFormat: action.oddFormat };

            default:
                return state;
        }
    }
);

export const actions = {
    setLanguage: (lang = 'en') => ({ type: actionTypes.setLanguage, lang }),
    setOddFormat: (oddFormat = 'american') => ({ type: actionTypes.setOddFormat, oddFormat }),
};

export function* saga() {
    //TODO: save settings to db
}
