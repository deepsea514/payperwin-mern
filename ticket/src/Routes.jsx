import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Navigation from "./components/Navigation/Navigation";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import Help from "./pages/Help";
import Performers from "./pages/Performers";
import Venues from "./pages/Venues";
import Event from "./pages/Event";
import Performer from "./pages/Performer";
import Venue from "./pages/Venue";
import GoToTop from "./pages/GoToTop";
import { connect } from 'react-redux';
import { actions } from "./redux/reducers";

const renderNavigation = () => {
    if (!(window.location.pathname === '/login' ||
        window.location.pathname === '/error-404')) {
        return <Navigation />;
    }
}

const AppRouter = ({ getUserAction, getCADRateAction, getHomeDataAction }) => {
    useEffect(() => {
        getUserAction();
        getCADRateAction();
        getHomeDataAction();
    }, [getUserAction, getCADRateAction, getHomeDataAction]);

    return (
        <Router>
            {renderNavigation()}
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/event/:event_id" exact component={Event} />
                <Route path="/search" exact component={Events} />
                <Route path="/categories/:category_slug" exact component={Events} />
                <Route path="/places/:country/:region/:locality" exact component={Events} />
                <Route path="/places/:country/:region" exact component={Events} />
                <Route path="/places/:country" exact component={Events} />
                <Route path="/venues/:venue_slug" exact component={Venue} />
                <Route path="/venues" exact component={Venues} />
                <Route path="/performers/:performer_slug" exact component={Performer} />
                <Route path="/performers" exact component={Performers} />
                <Route path="/help" exact component={Help} />
                <Route path="/login" exact component={Login} />
                <Route path="/error-404" exact component={NotFound} />
                <Route component={NotFound} />
            </Switch>
            <GoToTop />
        </Router>
    );
};

export default connect(null, actions)(AppRouter);