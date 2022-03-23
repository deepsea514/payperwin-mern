import React from "react"
import PremierPay from "../components/PremierPay";
import TripleA from "../components/TripleA";
import SendGrid from "../components/SendGrid";
import Twilio from "../components/Twilio";
import Bet365 from "../components/Bet365";
import TicketEvolution from '../components/TicketEvolution';
import CurrencyGetGeoAPI from "../components/CurrencyGetGeoAPI";

class Addons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">API Settings</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 col-12">
                                    <SendGrid />
                                    <hr />
                                    <TripleA />
                                    <hr />
                                    <CurrencyGetGeoAPI />
                                    <hr />
                                </div>
                                <div className="col-md-6 col-12">
                                    <Bet365 />
                                    <hr />
                                    <PremierPay />
                                    <hr />
                                    <Twilio />
                                    <hr />
                                    <TicketEvolution />
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Addons