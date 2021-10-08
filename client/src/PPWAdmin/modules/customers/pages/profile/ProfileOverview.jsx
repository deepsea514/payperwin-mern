import React from "react";
import OverviewBet from "../../components/OverviewBet";
import OverviewBalance from "../../components/OverviewBalance";
import { WinLoss } from "../../components/WinLoss.jsx";
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
            winloss: 0
        };
    }

    componentDidMount() {
        const { customer } = this.props;
        getCustomerOverview(customer._id)
            .then(({ data }) => {
                const { lastbets, lastsportsbookbets, totalwagers, totaldeposit, winloss } = data;
                this.setState({ lastbets, totalwagers, totaldeposit, lastsportsbookbets, winloss });
            })
    }

    render() {
        const { lastbets, lastsportsbookbets, totalwagers, totaldeposit, balance, currency, winloss } = this.state;
        return (
            <div className="row">
                <div className="col-md-3">
                    <OverviewBalance
                        balance={Number(balance).toFixed(2)}
                        currency={currency}
                        className="mt-1" />
                </div>
                <div className="col-md-3">
                    <WinLoss className="mt-1" winloss={winloss} />
                </div>
                <div className="col-md-3">
                    <OverviewTotalWager
                        totalwagers={totalwagers}
                        currency={currency}
                        className="mt-1" />
                </div>
                <div className="col-md-3">
                    <OverviewTotalDeposit
                        totaldeposit={totaldeposit}
                        currency={currency}
                        className="mt-1" />
                </div>
                <div className="col-md-12">
                    <OverviewBet
                        lastbets={lastbets}
                        lastsportsbookbets={lastsportsbookbets}
                        currency={currency}
                        className="card-stretch gutter-b mt-3" />
                </div>
            </div>
        );
    }
}

export default ProfileOverview;