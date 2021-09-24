import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";
import { getCustomers, getReason } from "./services"
import config from "../../../../../../config.json";
const FinancialStatus = config.FinancialStatus;

export const actionTypes = {
    getCustomers: 'Get Customer Action',
    getCustomersSuccess: "Get Customer Success",
    deleteCustomer: 'Delete Customer Action',
    deleteCustomerSuccess: "Delete Customer Success",
    filterCustomerChange: "Filter Customer Change",
    getReason: "Get Reason Action",
    getReasonSuccess: "Get Reason Success",
    addDepositSuccess: "Add Deposit Success",
    addWithdrawSuccess: "Add Withdraw Success",
};

const initialState = {
    customers: [],
    total: 0,
    currentPage: 1,
    loading: false,
    filter: {
        email: '',
        name: '',
        balancemin: '',
        balancemax: '',
        sortby: 'joined_date',
        sort: 'asc'
    },
    reasons: []
};

export const reducer = persistReducer(
    { storage, key: "customers", whitelist: [] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.getCustomers:
                return { ...state, ...{ loading: true, currentPage: action.page } };

            case actionTypes.getCustomersSuccess:
                return { ...state, ...action.data, ...{ loading: false } };

            case actionTypes.deleteCustomerSuccess:
                const customers = state.customers.filter(customer => customer._id != action.id);
                return { ...state, ...{ customers: customers } };

            case actionTypes.filterCustomerChange:
                if (action.filter.sortby) {
                    if (action.filter.sortby == state.filter.sortby) {
                        action.filter.sort = state.filter.sort == 'asc' ? 'desc' : 'asc';
                    } else {
                        action.filter.sort = 'asc';
                    }
                }
                return { ...state, ...{ filter: { ...state.filter, ...action.filter } } };

            case actionTypes.getReasonSuccess:
                return { ...state, ...{ reasons: action.reasons } };

            case actionTypes.addDepositSuccess:
                if (action.deposit.status != FinancialStatus.success) return state;

                const depositCustomers = state.customers.map(customer => {
                    if (customer._id == action.deposit.user) {
                        return { ...customer, ...{ balance: parseInt(customer.balance) + parseInt(action.deposit.amount) } };
                    }
                    else return customer;
                });
                return { ...state, ...{ customers: depositCustomers } };

            case actionTypes.addWithdrawSuccess:
                if (action.withdraw.status != FinancialStatus.success) return state;

                const withdrawCustomers = state.customers.map(customer => {
                    if (customer._id == action.withdraw.user) {
                        return { ...customer, ...{ balance: parseInt(customer.balance) - parseInt(action.withdraw.amount) - parseInt(action.withdraw.fee) } };
                    }
                    else return customer;
                });
                return { ...state, ...{ customers: withdrawCustomers } };

            default:
                return state;
        }
    }
);

export const actions = {
    getCustomers: (page = 1) => ({ type: actionTypes.getCustomers, page }),
    getCustomersSuccess: (data) => ({ type: actionTypes.getCustomersSuccess, data }),
    deleteCustomerSuccess: (id) => ({ type: actionTypes.deleteCustomerSuccess, id }),
    filterCustomerChange: (filter) => ({ type: actionTypes.filterCustomerChange, filter }),
    getReason: () => ({ type: actionTypes.getReason }),
    getReasonSuccess: (reasons) => ({ type: actionTypes.getReasonSuccess, reasons }),
    addDepositSuccess: (deposit) => ({ type: actionTypes.addDepositSuccess, deposit }),
    addWithdrawSuccess: (withdraw) => ({ type: actionTypes.addWithdrawSuccess, withdraw }),
};

export function* saga() {
    yield takeLatest(actionTypes.getCustomers, function* getCustomersSaga() {
        try {
            const state = yield select((state) => state.customer);
            const { data } = yield getCustomers(state.currentPage, state.filter);
            yield put(actions.getCustomersSuccess({ customers: data.data, total: data.total }));
        } catch (error) {
            yield put(actions.getCustomersSuccess({ customers: [], total: 0 }));
        }
    });

    yield takeLatest(actionTypes.filterCustomerChange, function* filterChangeSaga() {
        yield put(actions.getCustomers());
    });

    yield takeLatest(actionTypes.getReason, function* getReasonSaga() {
        try {
            const { data } = yield getReason();
            yield put(actions.getReasonSuccess(data));
        } catch (error) {
            yield put(actions.getReasonSuccess([]));
        }
    })
}
