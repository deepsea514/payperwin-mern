import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/pages/Home";
import Navigation from "./components/Navigation/Navigation";
import Login from "./components/pages/Login";
import NotFound from "./components/pages/NotFound";
import Events from "./components/pages/Events";
import { connect } from 'react-redux';
import { actions } from "./redux/reducers";

// Conditionally render Navigation
const renderNavigation = () => {
    if (!(window.location.pathname === '/login' ||
        window.location.pathname === '/signup' ||
        window.location.pathname === '/coming-soon' ||
        window.location.pathname === '/error-404')) {
        return <Navigation />;
    }
}

const AppRouter = ({ getUserAction, getCategoriesAction }) => {
    useEffect(() => {
        getUserAction();
        getCategoriesAction();
    }, [getUserAction, getCategoriesAction]);

    return (
        <Router>
            {renderNavigation()}
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/events" exact component={Events} />
                <Route path="/login" exact component={Login} />
                <Route path="/error-404" exact component={NotFound} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

export default connect(null, actions)(AppRouter);