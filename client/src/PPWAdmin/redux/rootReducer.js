import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as customer from "../modules/customers/redux/reducers";
import * as bet_activities from "../modules/bet_activities/redux/reducers";
import * as depositlog from "../modules/depositlogs/redux/reducers";
import * as withdrawlog from "../modules/withdrawlogs/redux/reducers";
import * as dashboard from "../modules/dashboard/redux/reducers";
import * as wager_feeds from "../modules/wager-feed/redux/reducers";
import * as autobets from "../modules/autobet/redux/reducers";
import * as email_templates from "../modules/email-templates/redux/reducers";
import * as promotions from "../modules/promotions/redux/reducers";
import * as kyc from "../modules/kyc/redux/reducers";
import * as tickets from "../modules/tickets/redux/reducers";
import * as faq from "../modules/faq/redux/reducers";
import * as messages from "../modules/message-center/redux/reducers";
import * as events from "../modules/events/redux/reducers";
import * as active_users from "../modules/active_users/redux/reducers";

import * as frontend from "../../redux/reducer";

export const rootReducer = combineReducers({
    customer: customer.reducer,
    bet_activities: bet_activities.reducer,
    depositlog: depositlog.reducer,
    withdrawlog: withdrawlog.reducer,
    dashboard: dashboard.reducer,
    wager_feeds: wager_feeds.reducer,
    autobets: autobets.reducer,
    email_templates: email_templates.reducer,
    promotions: promotions.reducer,
    kyc: kyc.reducer,
    tickets: tickets.reducer,
    faq: faq.reducer,
    events: events.reducer,
    messages: messages.reducer,
    active_users: active_users.reducer,

    frontend: frontend.reducer,
});

export function* rootSaga() {
    yield all([
        customer.saga(),
        depositlog.saga(),
        bet_activities.saga(),
        withdrawlog.saga(),
        dashboard.saga(),
        wager_feeds.saga(),
        autobets.saga(),
        email_templates.saga(),
        promotions.saga(),
        kyc.saga(),
        tickets.saga(),
        faq.saga(),
        events.saga(),
        messages.saga(),
        active_users.saga(),

        frontend.saga(),
    ]);
}
