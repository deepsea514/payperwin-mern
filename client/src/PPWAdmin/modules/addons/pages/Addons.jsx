import React from "react"
import Pinnacle from "../components/Pinnacle";
import PinnacleSandbox from "../components/PinnacleSandbox";
import PremierPay from "../components/PremierPay";
import TheRundown from "../components/TheRundown";
import TripleA from "../components/TripleA";
import SendGrid from "../components/SendGrid";
import Twilio from "../components/Twilio";

class Addons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Addons</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 col-12">
                                    <Pinnacle />
                                    <hr />
                                </div>
                                <div className="col-md-6 col-12">
                                    <SendGrid />
                                    <hr />
                                </div>
                                <div className="col-md-6 col-12">
                                    <PinnacleSandbox />
                                    <hr />
                                </div>
                                <div className="col-md-6 col-12">
                                    <PremierPay />
                                    <hr />
                                </div>
                                <div className="col-md-6 col-12">
                                    <TheRundown />
                                    <hr />
                                    <Twilio />
                                    <hr />
                                </div>
                                <div className="col-md-6 col-12">
                                    <TripleA />
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