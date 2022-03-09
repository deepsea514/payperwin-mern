import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/pages/Home";
import Navigation from "./components/Navigation/Navigation";
import Login from "./components/pages/Login";
import NotFound from "./components/pages/NotFound";

// Conditionally render Navigation
const renderNavigation = () => {
    if (!(window.location.pathname === '/login' ||
        window.location.pathname === '/signup' ||
        window.location.pathname === '/coming-soon' ||
        window.location.pathname === '/error-404')) {
        return <Navigation />;
    }
}

const AppRouter = () => {
    return (
        <Router>
            {renderNavigation()}
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" exact component={Login} />
                <Route path="/error-404" exact component={NotFound} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

export default AppRouter;