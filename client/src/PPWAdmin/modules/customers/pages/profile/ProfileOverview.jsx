import React from "react";
import Wagers from "../../components/Wagers";
import { Balance } from "../../components/Balance";
import { WinLoss } from "../../components/WinLoss.jsx";
import { TotalWager } from "../../components/TotalWager";
import { TotalDeposit } from "../../components/TotalDeposit";
import { Fees } from "../../components/Fees";
import { AverageBet } from "../../components/AverageBet";
import { AverageBetWin } from "../../components/AverageBetWin";
import { AverageBetLoss } from "../../components/AverageBetLoss";
import { BetsPerDay } from "../../components/BetsPerDay";
import { BetsPerWeek } from "../../components/BetsPerWeek";
import { AverageBetAfter2Loss } from '../../components/AverageBetAfter2Loss';
import { getCustomerOverview } from "../../redux/services";

class ProfileOverview extends React.Component {
    constructor(props) {
        super(props);
        const { customer } = props;
        this.state = {
            lastbets: [],
            lastsportsbookbets: [],
            totalwagers: 0,
            totaldeposit: 0,
            balance: customer.balance,
            currency: customer.currency,
            winloss: 0,
            fees: 0,
            averagebet: 0,
            averagebetwin: 0,
            averagebetloss: 0,
            betsperday: 0,
            betsperweek: 0,
            averagebetafter2loss: 0
        };
        this._Mounted = false;
    }

    componentDidMount() {
        this._Mounted = true;
        const { customer } = this.props;
        getCustomerOverview(customer._id)
            .then(({ data }) => {
                const {
                    lastbets,
                    lastsportsbookbets,
                    totalwagers,
                    totaldeposit,
                    winloss,
                    fees,
                    averagebet,
                    averagebetwin,
                    averagebetloss,
                    betsperday,
                    betsperweek,
                    averagebetafter2loss
                } = data;
                this._Mounted && this.setState({
                    lastbets,
                    lastsportsbookbets,
                    totalwagers,
                    totaldeposit,
                    winloss,
                    fees,
                    averagebet,
                    averagebetwin,
                    averagebetloss,
                    betsperday,
                    betsperweek,
                    averagebetafter2loss
                });
            })
    }

    componentWillUnmount() {
        this._Mounted = false;
    }

    render() {
        const {
            lastbets, lastsportsbookbets, totalwagers, totaldeposit,
            balance, currency, winloss, fees, averagebet, averagebetwin,
            averagebetloss, betsperday, betsperweek,averagebetafter2loss
        } = this.state;
        return (
            <>
                <div className="row">
                    <div className="col-md-4">
                        <Balance
                            balance={Number(balance).toFixed(2)}
                            currency={currency}
                            className="mt-2" />
                    </div>
                    <div className="col-md-4">
                        <WinLoss
                            className="mt-2"
                            winloss={winloss} />
                    </div>
                    <div className="col-md-4">
                        <TotalWager
                            totalwagers={totalwagers}
                            currency={currency}
                            className="mt-2" />
                    </div>
                    <div className="col-md-4">
                        <TotalDeposit
                            totaldeposit={totaldeposit}
                            currency={currency}
                            className="mt-2" />
                    </div>
                    <div className="col-md-4">
                        <Fees
                            fees={fees}
                            currency={currency}
                            className="mt-2" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <AverageBet
                            averagebet={Number(averagebet).toFixed(2)}
                            currency={currency}
                            className="mt-2" />
                    </div>
                    <div className="col-md-4">
                        <AverageBetWin
                            averagebetwin={Number(averagebetwin).toFixed(2)}
                            currency={currency}
                            className="mt-2" />
                    </div>
                    <div className="col-md-4">
                        <AverageBetLoss
                            averagebetloss={Number(averagebetloss).toFixed(2)}
                            currency={currency}
                            className="mt-2" />
                    </div>
                    <div className="col-md-4">
                        <BetsPerDay
                            betsperday={Number(betsperday).toFixed(2)}
                            currency={currency}
                            className="mt-2" />
                    </div>
                    <div className="col-md-4">
                        <BetsPerWeek
                            betsperweek={Number(betsperweek).toFixed(2)}
                            currency={currency}
                            className="mt-2" />
                    </div>
                    <div className="col-md-4">
                        <AverageBetAfter2Loss
                            averagebetafter2loss={Number(averagebetafter2loss).toFixed(2)}
                            currency={currency}
                            className="mt-2" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Wagers
                            lastbets={lastbets}
                            lastsportsbookbets={lastsportsbookbets}
                            currency={currency}
                            className="mt-3 card-stretch gutter-b" />
                    </div>
                </div>
            </>
        );
    }
}

export default ProfileOverview;