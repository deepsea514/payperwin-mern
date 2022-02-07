import React from "react";
import { connect } from "react-redux";
import * as customers from "../redux/reducers";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getCustomerDetail, updateCustomer } from "../redux/services";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import ProfileCard from "../components/ProfileCard";
import ProfileOverview from "./profile/ProfileOverview.jsx";
import PersonaInformation from "./profile/PersonaInformation";
import LoginHistory from "./profile/LoginHistory";
import Deposit from "./profile/Deposit";
import Withdraw from "./profile/Withdraw";
import BetLog from "./profile/BetLog";
import Preference from "./profile/Preference";
import Credit from "./profile/Credit";
import CustomerTier from "./profile/CustomerTier";
import TransactionHistory from "./profile/TransactionHistory";
import Referral from "./profile/Referral";

class CustomerProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            loading: false,
            customer: null,
        }
    }

    componentDidMount() {
        const { id } = this.state;
        this.setState({ loading: true });
        getCustomerDetail(id)
            .then(({ data }) => {
                this.setState({ customer: data, loading: false });
            })
            .catch(err => {
                this.setState({ customer: null, loading: false });
            });
    }

    render() {
        const { customer, loading, id } = this.state;
        const { history } = this.props;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-11 order-xxl-12 text-center">
                    {!loading && customer == null && <h1>No data available</h1>}
                    {loading && <center className="mt-5"><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} /></center>}
                    {!loading && customer &&
                        <>
                            <div className="d-flex flex-row">
                                {/* <BrowserRouter basename={`/RP1021/users/${id}/profile`}> */}
                                <ProfileCard customer={customer} history={history}></ProfileCard>
                                <div className="flex-row-fluid ml-lg-8">
                                    <Switch>
                                        <Route
                                            path={`/users/${id}/profile/overview`}
                                            component={(props) => <ProfileOverview {...props} customer={customer} />}
                                        />
                                        <Route
                                            path={`/users/${id}/profile/information`}
                                            component={(props) => <PersonaInformation {...props} customer={customer} />}
                                        />
                                        <Route
                                            path={`/users/${id}/profile/preference`}
                                            component={(props) => <Preference {...props} customer={customer} />}
                                        />
                                        <Route
                                            path={`/users/${id}/profile/login-history`}
                                            component={(props) => <LoginHistory {...props} customer={customer} />}
                                        />
                                        <Route
                                            path={`/users/${id}/profile/deposit`}
                                            component={(props) => <Deposit {...props} customer={customer} />}
                                        />
                                        <Route
                                            path={`/users/${id}/profile/withdraw`}
                                            component={(props) => <Withdraw {...props} customer={customer} />}
                                        />
                                        <Route
                                            path={`/users/${id}/profile/bet-log`}
                                            component={(props) => <BetLog {...props} customer={customer} />}
                                        />
                                        <Route
                                            path={`/users/${id}/profile/credit`}
                                            component={(props) => <Credit {...props} customer={customer} />}
                                        />
                                        <Route
                                            path={`/users/${id}/profile/tier`}
                                            component={(props) => <CustomerTier {...props} customer={customer} />}
                                        />
                                        <Route
                                            path={`/users/${id}/profile/transactions`}
                                            component={(props) => <TransactionHistory {...props} customer={customer} />}
                                        />
                                        <Route path={`/users/${id}/profile/referral`}
                                            component={(props) => <Referral {...props} customer={customer} />}
                                        />
                                        <Redirect
                                            to={`/users/${id}/profile/overview`}
                                        />
                                    </Switch>
                                </div>
                                {/* </BrowserRouter > */}
                            </div>
                        </>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, customers.actions)(CustomerProfile)