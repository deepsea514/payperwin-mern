import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import Home from "./pages/Home";
import Navigation from "./components/Navigation/Navigation";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import Help from "./pages/Help";
import { connect } from 'react-redux';
import { actions } from "./redux/reducers";

const renderNavigation = () => {
    if (!(window.location.pathname === '/login' ||
        window.location.pathname === '/error-404')) {
        return <Navigation />;
    }
}

const AppRouter = ({ getUserAction }) => {
    useEffect(() => {
        getUserAction();
    }, [getUserAction]);

    return (
        <Router>
            {renderNavigation()}
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/search" exact component={Events} />
                <Route path="/categories/:category_slug" exact component={Events} />
                <Route path="/places/:region/:locality" exact component={Events} />
                <Route path="/places/:region" exact component={Events} />
                <Route path="/help" exact component={Help} />
                <Route path="/login" exact component={Login} />
                <Route path="/error-404" exact component={NotFound} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

export default connect(null, actions)(AppRouter);