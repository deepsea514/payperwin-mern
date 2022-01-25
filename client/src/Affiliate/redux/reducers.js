import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    setAffiliateUserAction: "Set Affiliate User Action",
};

const initialState = {
    affiliateUser: null,
};

export const reducer = persistReducer(
    { storage, key: "affiliate-user", whitelist: ['affiliateUser'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.setAffiliateUserAction:
                return { affiliateUser: action.payload }

            default:
                return state;
        }
    }
);

export const actions = {
    setAffiliateUserAction: (payload = null) => ({ type: actionTypes.setAffiliateUserAction, payload }),
};

export function* saga() {
}
