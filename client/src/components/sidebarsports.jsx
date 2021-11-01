import React, { Component } from 'react';
import SportsList from './sportsList';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Favorites from './favorites';

class SidebarSports extends Component {
    render() {
        const { sidebarShowAccountLinks, toggleField, sportsMenuMobileOpen, user, getUser, showLoginModal } = this.props;
        return (
            <div className={`col-md-2 col-sm-6 responsive-v ${sidebarShowAccountLinks ? 'hide' : ''}`}
                style={sportsMenuMobileOpen ? { display: 'block' } : null} onClick={() =>
                    toggleField('sportsMenuMobileOpen', false)}>
                <div className="fabrt-d">
                    <h3 className="cat-heading">Favorites</h3>
                    {!user && <div className="favorites">
                        <a className="cursor-pointer fav-link" onClick={showLoginModal}><b>Log in</b></a> or <Link to={{ pathname: '/signup' }} className="fav-link"><b>Join</b></Link> to change your <br />favorites.
                    </div>}
                    {user && <Favorites user={user} getUser={getUser} />}
                </div>
                <h3 className="cat-heading"><FormattedMessage id="COMPONENTS.TOP.SPORTS" /></h3>
                <SportsList showleagues={true} topSports={true} />
                <h3 className="cat-heading"><FormattedMessage id="COMPONENTS.AZ.SPORTS" /></h3>
                <SportsList showNoEvents={true} showleagues={false} />
            </div>
        );
    }
}

export default SidebarSports;