import React from "react";
import OverviewBet from "../../components/OverviewBet";
import OverviewBalance from "../../components/OverviewBalance";
import { LifeTimeValue } from "../../components/LifeTimeValue.jsx";
import OverviewTotalWager from "../../components/OverviewTotalWager";
import OverviewTotalDeposit from "../../components/OverviewTotalDeposit";
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
        };
    }

    componentDidMount() {
        const { customer } = this.props;
        getCustomerOverview(customer._id)
            .then(({ data }) => {
                const { lastbets, lastsportsbookbets, totalwagers, totaldeposit } = data;
                this.setState({ lastbets, totalwagers, totaldeposit, lastsportsbookbets });
            })
    }

    render() {
        const { lastbets, lastsportsbookbets, totalwagers, totaldeposit, balance, currency } = this.state;
        return (
            <div className="row">
                <div className="col-lg-5">
                    <OverviewBet
                        lastbets={lastbets}
                        lastsportsbookbets={lastsportsbookbets}
                        currency={currency}
                        className="card-stretch gutter-b" />
                </div>
                <div className="col-lg-7">
                    <OverviewBalance
                        balance={Number(balance).toFixed(2)}
                        currency={currency}
                        className="" />
                    <LifeTimeValue className="mt-3" />
                    <div className="mt-3">
                        <div className="row">
                            <div className="col-lg-6">
                                <OverviewTotalWager
                                    totalwagers={totalwagers}
                                    currency={currency}
                                    className="card-stretch gutter-b" />
                            </div>
                            <div className="col-lg-6">
                                <OverviewTotalDeposit
                                    totaldeposit={totaldeposit}
                                    currency={currency}
                                    className="card-stretch gutter-b" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileOverview;