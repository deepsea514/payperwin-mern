import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    setCurrentUserAction: "Set Current User Action",
};

const initialState = {
    currentUser: null,
};

export const reducer = persistReducer(
    { storage, key: "admin-user", whitelist: ['filter'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.setCurrentUserAction:
                return { currentUser: action.payload }

            default:
                return state;
        }
    }
);

export const actions = {
    setCurrentUserAction: (payload = null) => ({ type: actionTypes.setCurrentUserAction, payload }),
};

export function* saga() {
}
