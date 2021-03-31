import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getBetActivities } from "../../bet_activities/redux/services";
import { getDepositLog } from "../../depositlogs/redux/services";
import { getWithdrawLog } from "../../withdrawlogs/redux/services";
import { getDashboardData } from "./services";

export const actionTypes = {
    getDashboardData: "Get Dashboard Data Action",
    getLastBets: "Get Last Bets Action",
    getLastBetsSuccess: "Get Last Bets Success",
    getLastSportsBookBets: "Get Last SportsBook Bets Action",
    getLastSportsBookBetsSuccess: "Get Last SportsBook Bets Success",
    getLastWithdraws: "Get Last Withdraws Action",
    getLastWithdrawsSuccess: "Get Last Withdraw Success",
    getLastDeposits: "Get Last Deposits Action",
    getLastDepositsSuccess: "Get Last Deposits Success",
    changeDateRange: "Change Date Range",
    getDashboardDataDetails: "Get Dashboard Data",
    getDashboardDataDetailsSuccess: "Get Dashboard Data Success",
};

const initialState = {
    lastbets: [],
    loadingbets: false,
    lastsportsbookbets: [],
    loadingportsbookbets: [],
    lastwithdraws: [],
    loadingwithdraws: false,
    lastdeposits: [],
    loadingdeposits: false,
    selectedDate: 'today',
    loadingdashboarddata: false,
    categories: [],
    dashboarddeposit: {
        totaldeposit: 0,
        deposits: []
    },
    dashboardwager: {
        totalwager: 0,
        wagers: []
    },
    dashboardplayer: {
        totalplayer: 0,
        players: [],
    },
    dashboardactiveplayer: {
        totalactiveplayer: 0,
        activeplayers: [],
    },
    dashboardfees: {
        totalfees: 0,
        fees: [],
    }
};

export const reducer = persistReducer(
    { storage, key: "dashboard", whitelist: ['selectedDate'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getLastBets:
                return { ...state, ...{ loadingbets: true } };

            case actionTypes.getLastBetsSuccess:
                return { ...state, ...{ loadingbets: false, lastbets: action.data } };

            case actionTypes.getLastSportsBookBets:
                return { ...state, ...{ loadingportsbookbets: true } };

            case actionTypes.getLastSportsBookBetsSuccess:
                return { ...state, ...{ loadingportsbookbets: false, lastsportsbookbets: action.data } };

            case actionTypes.getLastWithdraws:
                return { ...state, ...{ loadingwithdraws: true } };

            case actionTypes.getLastWithdrawsSuccess:
                return { ...state, ...{ loadingwithdraws: false, lastwithdraws: action.data } };

            case actionTypes.getLastDeposits:
                return { ...state, ...{ loadingdeposits: true } };

            case actionTypes.getLastDepositsSuccess:
                return { ...state, ...{ loadingdeposits: false, lastdeposits: action.data } };

            case actionTypes.changeDateRange:
                return { ...state, ...{ selectedDate: action.range } };

            case actionTypes.getDashboardDataDetails:
                return { ...state, ...{ loadingdashboarddata: true } };

            case actionTypes.getDashboardDataDetailsSuccess:
                return { ...state, ...{ loadingdashboarddata: false }, ...action.data };

            default:
                return state;
        }
    }
);

export const actions = {
    getDashboardData: () => ({ type: actionTypes.getDashboardData }),
    getLastBets: () => ({ type: actionTypes.getLastBets }),
    getLastBetsSuccess: (data) => ({ type: actionTypes.getLastBetsSuccess, data }),
    getLastSportsBookBets: () => ({ type: actionTypes.getLastSportsBookBets }),
    getLastSportsBookBetsSuccess: (data) => ({ type: actionTypes.getLastSportsBookBetsSuccess, data }),
    getLastWithdraws: () => ({ type: actionTypes.getLastWithdraws }),
    getLastWithdrawsSuccess: (data) => ({ type: actionTypes.getLastWithdrawsSuccess, data }),
    getLastDeposits: () => ({ type: actionTypes.getLastDeposits }),
    getLastDepositsSuccess: (data) => ({ type: actionTypes.getLastDepositsSuccess, data }),
    changeDateRange: (range) => ({ type: actionTypes.changeDateRange, range }),
    getDashboardDataDetails: () => ({ type: actionTypes.getDashboardDataDetails }),
    getDashboardDataDetailsSuccess: (data) => ({ type: actionTypes.getDashboardDataDetailsSuccess, data }),
};

export function* saga() {
    yield takeLatest(actionTypes.getDashboardData, function* getDashboardDataSaga() {
        yield put(actions.getLastBets());
        yield put(actions.getLastSportsBookBets());
        yield put(actions.getLastWithdraws());
        yield put(actions.getLastDeposits());
        yield put(actions.getDashboardDataDetails());
    });

    yield takeLatest(actionTypes.getLastBets, function* getLastBetsSaga() {
        try {
            const { data } = yield getBetActivities(1, {}, 10);
            yield put(actions.getLastBetsSuccess(data.data));
        } catch (error) {
            yield put(actions.getLastBetsSuccess([]));
        }
    });

    yield takeLatest(actionTypes.getLastBets, function* getLastBetsSaga() {
        try {
            const { data } = yield getBetActivities(1, { house: 'pinnacle' }, 10);
            yield put(actions.getLastSportsBookBetsSuccess(data.data));
        } catch (error) {
            yield put(actions.getLastSportsBookBetsSuccess([]));
        }
    });

    yield takeLatest(actionTypes.getLastWithdraws, function* getLastWithdrawsSaga() {
        try {
            const { data } = yield getWithdrawLog(1, {}, 10);
            yield put(actions.getLastWithdrawsSuccess(data.data));
        } catch (error) {
            yield put(actions.getLastWithdrawsSuccess([]));
        }
    });

    yield takeLatest(actionTypes.getLastDeposits, function* getLastDepositsSaga() {
        try {
            const { data } = yield getDepositLog(1, {}, 10);
            yield put(actions.getLastDepositsSuccess(data.data));
        } catch (error) {
            yield put(actions.getLastDepositsSuccess([]));
        }
    });

    yield takeLatest(actionTypes.getDashboardDataDetails, function* getDashboardDataDetailsSaga() {
        try {
            const state = yield select((state) => state.dashboard);
            const { data } = yield getDashboardData(state.selectedDate);
            const {
                totaldeposit, deposits,
                totalwager, wagers,
                totalplayer, players,
                totalactiveplayer, activeplayers,
                totalfees, fees,
                categories
            } = data;
            yield put(actions.getDashboardDataDetailsSuccess({
                dashboarddeposit: { totaldeposit, deposits },
                dashboardwager: { totalwager, wagers },
                dashboardplayer: { totalplayer, players, },
                dashboardactiveplayer: { totalactiveplayer, activeplayers, },
                dashboardfees: { totalfees, fees },
                categories
            }));
        } catch (error) {
            yield put(actions.getDashboardDataDetailsSuccess({
                dashboarddeposit: { totaldeposit: 0, deposits: [] },
                dashboardwager: { totalwager: 0, wagers: [] },
                dashboardplayer: { totalplayer: 0, players: [], },
                dashboardactiveplayer: { totalactiveplayer: 0, activeplayers: [], },
                dashboardfees: { totalfees: 0, fees: [], },
                categories: [],
            }));
        }
    });

    yield takeLatest(actionTypes.changeDateRange, function* changeDateRangeSaga() {
        yield put(actions.getDashboardDataDetails());
    });
}
