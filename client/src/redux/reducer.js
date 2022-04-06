import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { setPreferences, getUser, getAdminMessage, getBetStatus } from "./services";
import Cookie from 'js-cookie';
import { setLanguage } from '../PPWAdmin/_metronic/i18n/Metronici18n';

export const actionTypes = {
    getUser: "[Get User Action]",
    getUserSuccess: "[Get User Success]",
    updateUser: "[Update User Action]",
    setPreference: "[Set Preference Action]",
    setLanguage: "[Set Language Action]",
    setOddsFormat: "[Set Odd Format Action]",
    setDateFormat: "[Set Date Format Action]",
    setTimezone: "[Set Timezone Action]",
    setProMode: "[Set Pro Mode Action]",
    setSearch: "[Set Search Action]",
    acceptCookieAction: "[Accept Cookie Action]",
    hideTourAction: "[Hide Tour Action]",
    require2FAAction: "[Require 2FA Action]",
    setLoginFailedAction: "[Set Login Failed Action]",
    showLoginModalAction: "[Show Login Modal Action]",
    showForgotPasswordModalAction: "[Show Forgot Password Modal Action]",
    setMaxBetLimitTierAction: "[Set Max Bet Limit Tier Action]",
    enableBetAction: "[Enable Bet Action]",
    getAdminMessageAction: "[Get Admin Message Action]",
    getAdminMessageSuccess: "[Get Admin Message Success]",
    dismissAdminMessage: "[Dismiss Admin Message]",
    getBetStatusAction: "[Get Bet Status Action]",
    getBetStatusSuccess: "[Get Bet Status Success]",
    setCollapsedLeagues: '[Set Collapsed Leagues]',
    toggleCollapseLeague: '[Toggle Collapse League]',
    showPromotionAction: '[Show Promotion Action]',
};
const showedTourTimes = Cookie.get('showedTourTimes');
const initialState = {
    user: null,
    lang: 'en',
    oddsFormat: 'american',
    dateFormat: 'DD-MM-YYYY',
    timezone: null,
    pro_mode: true,
    search: '',
    acceptCookie: Cookie.get('acceptCookie'),
    showedTourTimes: showedTourTimes ? showedTourTimes : 0,
    showTour: true,
    loginFailed: 0,
    require_2fa: false,
    notification_settings: {
        win_confirmation: { email: true, sms: true },
        lose_confirmation: { email: false, sms: false },
        wager_matched: { email: true, sms: true },
        bet_accepted: { email: true, sms: true },
        no_match_found: { email: true, sms: true },
        bet_forward_reminder: { email: true, sms: true },
        deposit_confirmation: { email: true, sms: true },
        withdraw_confirmation: { email: true, sms: true },
        other: { email: true, sms: true },
    },
    showLoginModal: false,
    showForgotPasswordModal: false,
    maxBetLimitTier: 2000,
    betEnabled: null,
    adminMessage: null,
    adminMessageDismiss: null,
    collapsedLeague: [],
    showPromotion: false,
};

export const reducer = persistReducer(
    {
        storage, key: "ppw-frontend", whitelist: ['lang', 'oddsFormat', 'acceptCookie', 'pro_mode',
            'timezone', 'showedTourTimes', 'loginFailed', 'user', 'betEnabled', 'adminMessageDismiss']
    },
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

            case actionTypes.setProMode:
                return { ...state, pro_mode: action.pro_mode == undefined || action.pro_mode == null ? true : action.pro_mode };

            case actionTypes.setSearch:
                return { ...state, search: action.search };

            case actionTypes.acceptCookieAction:
                return { ...state, acceptCookie: true };

            case actionTypes.require2FAAction:
                return { ...state, require_2fa: action.require_2fa };

            case actionTypes.hideTourAction:
                return { ...state, showedTourTimes: state.showedTourTimes + 1, showTour: false };

            case actionTypes.setLoginFailedAction:
                return { ...state, loginFailed: action.times };

            case actionTypes.showLoginModalAction:
                return { ...state, showLoginModal: action.showLoginModal };

            case actionTypes.showForgotPasswordModalAction:
                return { ...state, showForgotPasswordModal: action.showForgotPasswordModal };

            case actionTypes.setMaxBetLimitTierAction:
                return { ...state, maxBetLimitTier: action.maxBetLimitTier };

            case actionTypes.getUserSuccess:
                return { ...state, user: action.user };

            case actionTypes.updateUser:
                return { ...state, user: { ...state.user, ...action.payload } };

            case actionTypes.getAdminMessageSuccess:
                return { ...state, adminMessage: action.message };

            case actionTypes.dismissAdminMessage:
                return { ...state, adminMessageDismiss: action.date };

            case actionTypes.getBetStatusSuccess:
                return { ...state, betEnabled: action.betEnabled };

            case actionTypes.toggleCollapseLeague:
                const collapsed = state.collapsedLeague.find(leagueId => leagueId == action.leagueId);
                return {
                    ...state,
                    collapsedLeague: collapsed ?
                        state.collapsedLeague.filter(leagueId => leagueId != action.leagueId) :
                        [...state.collapsedLeague, action.leagueId]
                }

            case actionTypes.setCollapsedLeagues:
                return { ...state, collapsedLeague: action.leagueIds }

            case actionTypes.showPromotionAction:
                return { ...state, showPromotion: action.show }

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
    setDateFormat: (dateFormat) => ({ type: actionTypes.setDateFormat, dateFormat }),
    setProMode: (pro_mode) => ({ type: actionTypes.setProMode, pro_mode }),
    setSearch: (search = '') => ({ type: actionTypes.setSearch, search }),
    acceptCookieAction: () => ({ type: actionTypes.acceptCookieAction }),
    require2FAAction: (require_2fa = true) => ({ type: actionTypes.require2FAAction, require_2fa }),
    hideTourAction: () => ({ type: actionTypes.hideTourAction }),
    setLoginFailedAction: (times) => ({ type: actionTypes.setLoginFailedAction, times }),
    showLoginModalAction: (showLoginModal) => ({ type: actionTypes.showLoginModalAction, showLoginModal }),
    showForgotPasswordModalAction: (showForgotPasswordModal) => ({ type: actionTypes.showForgotPasswordModalAction, showForgotPasswordModal }),
    setMaxBetLimitTierAction: (maxBetLimitTier) => ({ type: actionTypes.setMaxBetLimitTierAction, maxBetLimitTier }),
    getUser: (callback) => ({ type: actionTypes.getUser, callback }),
    getUserSuccess: (user) => ({ type: actionTypes.getUserSuccess, user }),
    updateUser: (field, value) => ({ type: actionTypes.updateUser, payload: { [field]: value } }),
    getAdminMessageAction: () => ({ type: actionTypes.getAdminMessageAction }),
    getAdminMessageSuccess: (message) => ({ type: actionTypes.getAdminMessageSuccess, message }),
    dismissAdminMessage: (date) => ({ type: actionTypes.dismissAdminMessage, date }),
    getBetStatusAction: () => ({ type: actionTypes.getBetStatusAction }),
    getBetStatusSuccess: (betEnabled) => ({ type: actionTypes.getBetStatusSuccess, betEnabled }),
    toggleCollapseLeague: (leagueId) => ({ type: actionTypes.toggleCollapseLeague, leagueId }),
    setCollapsedLeagues: (leagueIds) => ({ type: actionTypes.setCollapsedLeagues, leagueIds }),
    showPromotionAction: (show) => ({ type: actionTypes.showPromotionAction, show }),
};

export function* saga() {
    yield takeLatest(actionTypes.getUser, function* getUserSaga(action) {
        try {
            const { data: user } = yield getUser();
            if (action.callback) {
                action.callback(user);
            }
            if (user) {
                yield put(actions.getUserSuccess(user));
                yield put(actions.setPreference({
                    maxBetLimitTier: user.maxBetLimitTier,
                    dateFormat: user.preference.dateFormat,
                    timezone: user.preference.timezone,
                    oddsFormat: user.preference.oddsFormat,
                    pro_mode: user.preference.pro_mode,
                }));

                const lang = yield select((state) => state.frontend.lang);
                if (lang != user.preference.lang) {
                    yield put(actions.setLanguage(user.preference.lang));
                }
            } else {
                yield put(actions.getUserSuccess(null));
            }

        } catch (error) {

        }
    })

    yield takeLatest(actionTypes.setOddsFormat, function* setOddsFormatSaga() {
        try {
            const oddsFormat = yield select((state) => state.frontend.oddsFormat);
            const user = yield select((state) => state.frontend.user);
            if (user) {
                yield setPreferences({ oddsFormat });
            }
        } catch (error) {
        }
    });

    yield takeLatest(actionTypes.setProMode, function* setOddsFormatSaga() {
        try {
            const pro_mode = yield select((state) => state.frontend.pro_mode);
            const user = yield select((state) => state.frontend.user);
            if (user) {
                yield setPreferences({ pro_mode });
            }
        } catch (error) {
        }
    });

    yield takeLatest(actionTypes.setLanguage, function* setLanguageSaga() {
        const lang = yield select((state) => state.frontend.lang);
        const user = yield select((state) => state.frontend.user);
        if (user) {
            try {
                yield setPreferences({ lang });
            } catch (error) {
            }
        }
        setLanguage(lang);
    });

    yield takeLatest(actionTypes.setMaxBetLimitTierAction, function* setMaxBetLimitTierSaga() {
        const maxBetLimitTier = yield select((state) => state.frontend.maxBetLimitTier);
        try {
            // yield setMaxBetLimitTierAction({ maxBetLimitTier });
            actions.setMaxBetLimitTierAction(maxBetLimitTier);
        } catch (error) {
        }
    });

    yield takeLatest(actionTypes.getAdminMessageAction, function* getAdminMessageSaga() {
        try {
            const { data } = yield getAdminMessage();
            yield put(actions.getAdminMessageSuccess(data));
        } catch (error) {
            yield put(actions.getAdminMessageSuccess(null));
        }
    });

    yield takeLatest(actionTypes.getBetStatusAction, function* getBetStatusSaga() {
        try {
            const { data } = yield getBetStatus();
            if (data && data.value) {
                yield put(actions.getBetStatusSuccess(data.value));
            } else {
                yield put(actions.getBetStatusSuccess(null));
            }
        } catch (error) {
            yield put(actions.getBetStatusSuccess(null));
        }
    })
}
