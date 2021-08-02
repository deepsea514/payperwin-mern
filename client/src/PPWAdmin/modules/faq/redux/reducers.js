import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getFAQSubjects } from "./services";

export const actionTypes = {
    getFAQSubjects: "Get FAQ Subjects Action",
    getFAQSubjectsSuccess: "Get FAQ Subjects Success",
};

const initialState = {
    faq_subjects: [],
    total: 0,
    currentPage: 1,
    loading: false,
};

export const reducer = persistReducer(
    { storage, key: "faq", whitelist: [] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getFAQSubjects:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getFAQSubjectsSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            default:
                return state;
        }
    }
);

export const actions = {
    getFAQSubjects: (page = 1) => ({ type: actionTypes.getFAQSubjects, page }),
    getFAQSubjectsSuccess: (data) => ({ type: actionTypes.getFAQSubjectsSuccess, data }),
};

export function* saga() {
    yield takeLatest(actionTypes.getFAQSubjects, function* getFAQSubjectsSaga() {
        try {
            const state = yield select((state) => state.depositlog);
            const { data } = yield getFAQSubjects(state.currentPage);
            yield put(actions.getFAQSubjectsSuccess({ faq_subjects: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getFAQSubjectsSuccess({ faq_subjects: [], total: 0 }));
        }
    });

}
