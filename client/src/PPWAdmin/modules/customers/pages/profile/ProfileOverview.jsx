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
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";
import { WinPercentage } from "../../components/WinPercentage";
import { UsedCredit } from "../../components/UsedCredit";
import { InPlay } from "../../components/InPlay";
import { NetBalance } from "../../components/NetBalance";

class ProfileOverview extends React.Component {
    constructor(props) {
        super(props);
        const { customer } = props;
        this.state = {
            id: customer._id,
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
            averagebetafter2loss: 0,
            wins: 0,
            usedCredit: 0,
            credit: 0,
            inplay: 0
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
                    averagebetafter2loss,
                    wins,
                    usedCredit,
                    credit,
                    inplay
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
                    averagebetafter2loss,
                    wins,
                    usedCredit,
                    credit,
                    inplay
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
            averagebetloss, betsperday, betsperweek, averagebetafter2loss, id,
            wins, usedCredit, credit, inplay
        } = this.state;

        return (
            <div className="card card-custom">
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        Customer Overview
                    </h3>
                    <div className="card-toolbar">
                        <Dropdown className="dropdown-inline" drop="down" alignRight>
                            <Dropdown.Toggle
                                id="dropdown-toggle-top2"
                                variant="transparent"
                                className="btn btn-light-primary btn-sm font-weight-bolder dropdown-toggle">
                                View:
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                <DropdownMenuCustomer id={id} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <Balance
                                balance={Number(balance).toFixed(2)}
                                currency={currency}
                                className="mt-2" />
                        </div>
                        <div className="col-md-4">
                            <NetBalance
                                balance={(Number(balance) - Number(usedCredit)).toFixed(2)}
                                currency={currency}
                                className="mt-2" />
                        </div>
                        {/* <div className="col-md-4">
                            <WinLoss
                                className="mt-2"
                                winloss={winloss} />
                        </div> */}
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
                        <div className="col-md-4">
                            <WinPercentage
                                wins={wins}
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
                        <div className="col-md-4">
                            <UsedCredit
                                usedCredit={Number(usedCredit).toFixed(2)}
                                credit={Number(credit).toFixed(2)}
                                currency={currency}
                                className="mt-2" />
                        </div>
                        <div className="col-md-4">
                            <InPlay
                                inplay={Number(inplay).toFixed(2)}
                                currency={currency}
                                className="mt-2" />
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-12">
                            <Wagers
                                lastbets={lastbets}
                                lastsportsbookbets={lastsportsbookbets}
                                currency={currency}
                                className="mt-3 card-stretch gutter-b" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileOverview;