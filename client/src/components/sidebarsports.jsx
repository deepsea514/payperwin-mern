import React, { Component } from 'react';
import SportsList from './sportsList';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Favorites from './favorites';
import Search from './search';

class SidebarSports extends Component {
    render() {
        const { sidebarShowAccountLinks, toggleField, sportsMenuMobileOpen, user, getUser, showLoginModalAction } = this.props;
        return (
            <div className={`col-md-2 col-sm-6 responsive-v ${sidebarShowAccountLinks ? 'hide' : ''}`}
                style={sportsMenuMobileOpen ? { display: 'block' } : null} onClick={() =>
                    toggleField('sportsMenuMobileOpen', false)}>
                <Search />
                <div className="fabrt-d">
                    <h3 className="cat-heading">Favorites</h3>
                    {!user && <div className="favorites">
                        <a className="cursor-pointer fav-link" onClick={showLoginModalAction}><b>Log in</b></a> or <Link to={{ pathname: '/signup' }} className="fav-link"><b>Join</b></Link> to change your <br />favorites.
                    </div>}
                    {user && <Favorites user={user} getUser={getUser} />}
                </div>
                <h3 className="cat-heading"><FormattedMessage id="COMPONENTS.TOP.SPORTS" /></h3>
                <SportsList topSports={true} />
                <h3 className="cat-heading"><FormattedMessage id="COMPONENTS.AZ.SPORTS" /></h3>
                <SportsList showNoEvents={true} />
            </div>
        );
    }
}

export default SidebarSports;