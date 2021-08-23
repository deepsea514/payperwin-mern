import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import BetActivities from "../../bet_activities/pages/BetActivities";
import ActiveUsers from '../../active_users/pages/ActiveUsers';
import DepositLog from '../../depositlogs/pages/DepositLog';
import WithdrawLog from '../../withdrawlogs/pages/WithdrawLog';
import ProfitReport from "./ProfitReport";

export default class ReportsModule extends Component {
    render() {
        return (
            <Switch>
                <Route path="/reports/wager" component={BetActivities} />
                <Route path="/reports/users" component={ActiveUsers} />
                <Route path="/reports/deposit" render={(props => <DepositLog {...props} report={true} />)} />
                <Route path="/reports/withdraw" render={(props => <WithdrawLog {...props} report={true} />)} />
                <Route path="/reports/profit" component={ProfitReport} />
            </Switch>
        )
    }
}