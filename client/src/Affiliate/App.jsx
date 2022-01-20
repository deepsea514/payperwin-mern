import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/header';

export default class App extends Component {
    render() {
        return (
            <div className='background dark-theme'>
                <Header />
                <Switch>
                    {/* <Route path={`/login`} component={Login} /> */}
                    {/* <Route path="/" component={App} /> */}
                </Switch>
            </div>
        );
    }
}
