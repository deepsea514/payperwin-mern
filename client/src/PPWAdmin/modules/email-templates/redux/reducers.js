import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getEmailTemplates } from "./services";

export const actionTypes = {
    getEmailTemplatesAction: "Get Email Templates [Action]",
    getEmailTemplatesSuccess: "Get Email Templates [Success]",
    getEmailTemplatesFailed: "Get Email Templates [Failed]",
};

const initialState = {
    email_templates: [],
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "email-templates", whitelist: [] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getEmailTemplatesAction:
                return { ...state, loading: false };
            case actionTypes.getEmailTemplatesSuccess:
                return { ...state, loading: false, email_templates: action.email_templates };
            case actionTypes.getEmailTemplatesFailed:
                return { ...state, loading: false, email_templates: [] };
            default:
                return state;
        }
    }
);

export const actions = {
    getEmailTemplatesAction: () => ({ type: actionTypes.getEmailTemplatesAction }),
    getEmailTemplatesSuccess: (email_templates) => ({ type: actionTypes.getEmailTemplatesSuccess, email_templates }),
    getEmailTemplatesFailed: () => ({ type: actionTypes.getEmailTemplatesFailed }),
};

export function* saga() {
    yield takeLatest(actionTypes.getEmailTemplatesAction, function* getEmailTemplatesSaga() {
        try {
            const { data } = yield getEmailTemplates();
            yield put(actions.getEmailTemplatesSuccess(data.email_templates));
        } catch (error) {
            yield put(actions.getEmailTemplatesFailed([]));
        }
    })
}
