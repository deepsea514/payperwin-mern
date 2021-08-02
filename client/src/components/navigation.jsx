import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { setTitle } from '../libs/documentTitleBuilder';
const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[window.location.host].appUrl;

function logout(getUser, history) {
    const url = `${serverUrl}/logout`;
    axios(
        {
            method: 'get',
            url,
            withCredentials: true,
        },
    ).then((/* d */) => {
        getUser();
        history.replace({ pathname: '/' });
    });
}

function renderNavItem(navItem, getUser, history) {
    if (navItem.noNavDisplay) {
        return null;
    }
    let menuItem;
    if (navItem.path) {
        menuItem = (
            <Link
                to={navItem.path}
                onClick={navItem.path === '/' ? () => setTitle({ pageTitle: '' }) : null}
            >
                {navItem.name}
            </Link>
        );
    } else if (navItem.name === 'Logout') {
        menuItem = (
            <button type="button" onClick={() => logout(getUser, history)}>{navItem.name}</button>
        );
    } else {
        menuItem = navItem.name;
    }
    const subNavItems = navItem.subMenus ? (
        <ul>
            {navItem.subMenus.map(subNavItem => renderNavItem(subNavItem, getUser, history))}
        </ul>
    ) : null;
    return (
        <li
            key={navItem.name}
            className={navItem.name === 'Login' || navItem.name === 'Register' || navItem.path === '/profile' ? 'nav-right' : null}
        >
            {menuItem}
            {subNavItems}
        </li>
    );
}

const navigation = ({ navItems, loggedIn, user, getUser, history }) => {
    const conditionPassingNavItems = [];
    navItems.forEach((navItem) => {
        if (
            !navItem.condition
            || (navItem.condition === 'loggedIn' && loggedIn)
            || (navItem.condition === 'loggedOut' && !loggedIn)
        ) {
            if (navItem.name === 'Profile' && user) {
                conditionPassingNavItems.push({ ...navItem, name: user.username });
            } else {
                conditionPassingNavItems.push(navItem);
            }
        }
    });
    return (
        <nav>
            <ul>
                {
                    conditionPassingNavItems.map(navItem => renderNavItem(navItem, getUser, history))
                }
            </ul>
        </nav>
    );
};

navigation.propTypes = {
    // match: PropTypes.object.isRequired,
    // location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    navItems: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
    })).isRequired,
    getUser: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.shape({
        username: PropTypes.string,
    }),
};

navigation.defaultProps = {
    user: null,
};


export default withRouter(navigation);
