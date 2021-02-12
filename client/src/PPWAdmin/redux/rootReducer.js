import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as customer from "../modules/customers/redux/reducers";
import * as bet_activities from "../modules/bet_activities/redux/reducers";
import * as depositlog from "../modules/depositlogs/redux/reducers";
import * as withdrawlog from "../modules/withdrawlogs/redux/reducers";
import * as dashboard from "../modules/dashboard/redux/reducers";

export const rootReducer = combineReducers({
    customer: customer.reducer,
    bet_activities: bet_activities.reducer,
    depositlog: depositlog.reducer,
    withdrawlog: withdrawlog.reducer,
    dashboard: dashboard.reducer,
});

export function* rootSaga() {
    yield all([
        customer.saga(),
        depositlog.saga(),
        bet_activities.saga(),
        withdrawlog.saga(),
        dashboard.saga(),
    ]);
}
