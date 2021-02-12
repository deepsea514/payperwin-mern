import React from "react";
import { TotalDeposit } from "../components/TotalDeposit";
import { TotalWager } from "../components/TotalWager";
import { TotalPlayers } from "../components/TotalPlayers";
import { ActivePlayers } from "../components/ActivePlayers";
import { FeesCollected } from "../components/FeesCollected";
import { LastDeposits } from "../components/LastDeposits";
import { LastWithdraws } from "../components/LastWithdraws";
import { LastBets } from "../components/LastBets";
import { connect } from "react-redux";
import * as dashboard from "../redux/reducers";

class AdminDashboard extends React.Component {
    componentDidMount() {
        const { getDashboardData } = this.props;
        getDashboardData();
    }
    render() {
        const { lastbets, loadingbets,
            lastwithdraws,
            loadingwithdraws,
            lastdeposits, loadingdeposits,
            loadingdashboarddata, categories,
            dashboarddeposit, dashboardwager, dashboardplayer, dashboardactiveplayer, dashboardfees
        } = this.props;
        return (
            <>
                <div className="row">
                    <div className="col-lg-6 col-xxl-4">
                        <TotalDeposit
                            loadingdashboarddata={loadingdashboarddata}
                            categories={categories}
                            dashboarddeposit={dashboarddeposit}
                            className="card-stretch gutter-b" />
                    </div>
                    <div className="col-lg-6 col-xxl-4">
                        <TotalWager
                            loadingdashboarddata={loadingdashboarddata}
                            categories={categories}
                            dashboardwager={dashboardwager}
                            className="card-stretch gutter-b" />
                    </div>
                    <div className="col-lg-6 col-xxl-4">
                        <TotalPlayers
                            loadingdashboarddata={loadingdashboarddata}
                            categories={categories}
                            dashboardplayer={dashboardplayer}
                            className="card-stretch card-stretch-half gutter-b"
                            symbolShape="circle"
                            baseColor="success"
                        />
                        <FeesCollected
                            loadingdashboarddata={loadingdashboarddata}
                            categories={categories}
                            dashboardfees={dashboardfees}
                            symbolShape="circle"
                            baseColor="warning"
                            className="card-stretch card-stretch-half gutter-b" />
                    </div>
                    <div className="col-lg-6 col-xxl-4">
                        <ActivePlayers
                            loadingdashboarddata={loadingdashboarddata}
                            categories={categories}
                            dashboardactiveplayer={dashboardactiveplayer}
                            symbolShape="circle"
                            baseColor="info"
                            className="card-stretch card-stretch-half gutter-b" />
                    </div>

                    <div className="col-lg-12 col-md-12 col-xxl-12 order-2 order-xxl-1">
                        <LastDeposits lastdeposits={lastdeposits} loadingdeposits={loadingdeposits} className="card-stretch gutter-b" />
                    </div>
                    <div className="col-lg-12 col-md-12 col-xxl-12 order-2 order-xxl-1">
                        <LastWithdraws lastwithdraws={lastwithdraws} loadingwithdraws={loadingwithdraws} className="card-stretch gutter-b" />
                    </div>
                    <div className="col-lg-12 col-md-12 col-xxl-12 order-2 order-xxl-1">
                        <LastBets loadingbets={loadingbets} lastbets={lastbets} className="card-stretch gutter-b" />
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    lastbets: state.dashboard.lastbets,
    loadingbets: state.dashboard.loadingbets,
    lastwithdraws: state.dashboard.lastwithdraws,
    loadingwithdraws: state.dashboard.loadingwithdraws,
    lastdeposits: state.dashboard.lastdeposits,
    loadingdeposits: state.dashboard.loadingdeposits,
    loadingdashboarddata: state.dashboard.loadingdashboarddata,
    categories: state.dashboard.categories,
    dashboarddeposit: state.dashboard.dashboarddeposit,
    dashboardwager: state.dashboard.dashboardwager,
    dashboardplayer: state.dashboard.dashboardplayer,
    dashboardactiveplayer: state.dashboard.dashboardactiveplayer,
    dashboardfees: state.dashboard.dashboardfees,
})

export default connect(mapStateToProps, dashboard.actions)(AdminDashboard)