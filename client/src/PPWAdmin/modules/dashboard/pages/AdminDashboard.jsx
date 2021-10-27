import React from "react";
import { TotalDeposit } from "../components/TotalDeposit";
import { TotalWager } from "../components/TotalWager";
import { TotalWagerSportsBook } from "../components/TotalWagerSportsBook";
import { Players } from "../components/Players";
import FeesCollected from "../components/FeesCollected";
import { LastDeposits } from "../components/LastDeposits";
import { LastWithdraws } from "../components/LastWithdraws";
import { LastBets } from "../components/LastBets";
import { BotOverview } from '../components/BotOverview';
import { connect } from "react-redux";
import * as dashboard from "../redux/reducers";
import DashboardCard from "../components/DashboardCard";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

class AdminDashboard extends React.Component {
    componentDidMount() {
        const { getDashboardData } = this.props;
        getDashboardData();
    }
    render() {
        const {
            history,
            lastbets, loadingbets,
            lastsportsbookbets, loadingsportsbookbets,
            lastwithdraws, loadingwithdraws,
            lastdeposits, loadingdeposits,
            bots, loadingbots,
            loadingdashboarddata, categories,
            dashboarddeposit, dashboardwager, dashboardwagersportsbook,
            dashboardplayer, dashboardfees
        } = this.props;
        return (
            <>
                <div className="row">
                    <div className="col-lg-6 col-xl-4 col-xxl-4">
                        <TotalDeposit
                            loadingdashboarddata={loadingdashboarddata}
                            categories={categories}
                            dashboarddeposit={dashboarddeposit}
                            className="card-stretch gutter-b" />
                    </div>
                    <div className="col-lg-6 col-xl-4 col-xxl-4">
                        <TotalWager
                            loadingdashboarddata={loadingdashboarddata}
                            categories={categories}
                            dashboardwager={dashboardwager}
                            className="card-stretch gutter-b" />
                    </div>
                    <div className="col-lg-6 col-xl-4 col-xxl-4">
                        <TotalWagerSportsBook
                            loadingdashboarddata={loadingdashboarddata}
                            categories={categories}
                            dashboardwagersportsbook={dashboardwagersportsbook}
                            className="card-stretch gutter-b" />
                    </div>
                    <Players
                        loadingdashboarddata={loadingdashboarddata}
                        dashboardplayer={dashboardplayer}
                        className="card-stretch gutter-b"
                    />
                    <div className="col-lg-6 col-xl-4 col-xxl-4">
                        <FeesCollected
                            loadingdashboarddata={loadingdashboarddata}
                            categories={categories}
                            dashboardfees={dashboardfees}
                            symbolShape="circle"
                        />
                    </div>
                    <div className="col-lg-12 col-md-12 col-xxl-12 order-2 order-xxl-1">
                        <div className="d-flex flex-row">
                            <BrowserRouter basename={`/RP1021/dashboard`}>
                                <DashboardCard />
                                <div className="flex-row-fluid ml-lg-8">
                                    <Switch>
                                        <Redirect from="/" exact={true} to="/lastdeposits" />
                                        <Route
                                            path="/lastdeposits"
                                            render={(props) => <LastDeposits
                                                {...props}
                                                roothistory={history}
                                                lastdeposits={lastdeposits}
                                                loadingdeposits={loadingdeposits}
                                                className="card-stretch gutter-b" />}
                                        />
                                        <Route
                                            path="/lastwithdraws"
                                            render={(props) => <LastWithdraws
                                                {...props}
                                                roothistory={history}
                                                lastwithdraws={lastwithdraws}
                                                loadingwithdraws={loadingwithdraws}
                                                className="card-stretch gutter-b" />}
                                        />
                                        <Route
                                            path="/lastbets"
                                            render={(props) => <LastBets
                                                {...props}
                                                roothistory={history}
                                                loadingbets={loadingbets}
                                                lastbets={lastbets}
                                                lastsportsbookbets={lastsportsbookbets}
                                                loadingsportsbookbets={loadingsportsbookbets}
                                                className="card-stretch gutter-b" />}
                                        />
                                        <Route path="/bots"
                                            render={(props) => <BotOverview
                                                {...props}
                                                loadingbots={loadingbots}
                                                bots={bots}
                                                symbolShape="card-stretch gutter-b"
                                            />}
                                        />
                                    </Switch>
                                </div>
                            </BrowserRouter>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    lastbets: state.dashboard.lastbets,
    loadingbets: state.dashboard.loadingbets,
    lastsportsbookbets: state.dashboard.lastsportsbookbets,
    loadingsportsbookbets: state.dashboard.loadingsportsbookbets,
    lastwithdraws: state.dashboard.lastwithdraws,
    loadingwithdraws: state.dashboard.loadingwithdraws,
    lastdeposits: state.dashboard.lastdeposits,
    loadingdeposits: state.dashboard.loadingdeposits,
    loadingdashboarddata: state.dashboard.loadingdashboarddata,
    categories: state.dashboard.categories,
    dashboarddeposit: state.dashboard.dashboarddeposit,
    dashboardwager: state.dashboard.dashboardwager,
    dashboardwagersportsbook: state.dashboard.dashboardwagersportsbook,
    dashboardplayer: state.dashboard.dashboardplayer,
    dashboardactiveplayer: state.dashboard.dashboardactiveplayer,
    dashboardfees: state.dashboard.dashboardfees,
    bots: state.dashboard.bots,
    loadingbots: state.dashboard.loadingbots,
})

export default connect(mapStateToProps, dashboard.actions)(AdminDashboard)