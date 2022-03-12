import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/header';
import Affiliate from './pages/Affiliate';
import Dashboard from './pages/Dashboard';
import { connect } from 'react-redux';
import LoginModal from './components/loginModal';
import Menu from './components/menu';

import './style/style.css';
import './style/responsive.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModal: false,
            menuOpen: false,
        }
    }

    toggleField = (fieldName, forceState) => {
        if (typeof this.state[fieldName] !== 'undefined') {
            this.setState({
                [fieldName]: typeof forceState === 'boolean' ? forceState : !this.state[fieldName]
            });
        }
    }

    render() {
        const { user, getUser } = this.props;
        const { loginModal, menuOpen } = this.state;

        return (
            <div className='affiliate-main'>
                <Header showLoginModalAction={() => this.setState({ loginModal: true })}
                    user={user}
                    toggleField={this.toggleField} />
                {menuOpen && <Menu user={user}
                    getUser={getUser}
                    showLoginModalAction={() => this.setState({ loginModal: true })}
                    toggleField={this.toggleField} />}
                <section className='affiliate-section main-section dark'>
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
    user: state.affiliate.affiliateUser,
});

export default connect(mapStateToProps, null)(App);