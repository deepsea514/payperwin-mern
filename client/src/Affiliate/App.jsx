import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/header';
import Affiliate from './pages/Affiliate';
import Dashboard from './pages/Dashboard';
import './style/style.css';
import './style/responsive.css';

export default class App extends Component {
    render() {
        return (
            <div className='affiliate-main'>
                <Header />
                <section className='affiliate-section'>
                    <div className='container'>
                        <Switch>
                            <Route path="/" component={Affiliate} />
                            <Route path="/dashboard" component={Dashboard} />
                        </Switch>
                    </div>
                </section>
            </div>
        );
    }
}
