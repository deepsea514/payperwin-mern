import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/header';
import Affiliate from './pages/Affiliate';
import Dashboard from './pages/Dashboard';
import { connect } from 'react-redux';
import LoginModal from './components/loginModal';

import './style/style.css';
import './style/responsive.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModal: false
        }
    }

    render() {
        const { user, getUser } = this.props;
        const { loginModal } = this.state;

        return (
            <div className='affiliate-main'>
                <Header showLoginModalAction={() => this.setState({ loginModal: true })} />
                <section className='affiliate-section'>
                    <div className='container'>
                        {loginModal && <LoginModal closeModal={() => this.setState({ loginModal: false })}
                            getUser={getUser} />}
                        <Switch>
                            {user && <>
                                <Route path="/dashboard" component={Dashboard} />
                                <Redirect from="*" to="/dashboard" />
                            </>}
                            {!user && <>
                                <Route path="/" component={Affiliate} />
                                <Redirect from="*" to="/" />
                            </>}
                        </Switch>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    affiliateUser: state.affiliate.affiliateUser,
});

export default connect(mapStateToProps, null)(App);