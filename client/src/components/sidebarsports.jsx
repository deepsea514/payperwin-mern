import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SportsList from './sportsList';

class SidebarSports extends Component {
    render() {
        const { sidebarShowAccountLinks, toggleField, sportsMenuMobileOpen } = this.props;
        return (
            <div className={`col-sm-2 responsive-v ${sidebarShowAccountLinks ? 'hide' : ''}`}
                style={sportsMenuMobileOpen ? { display: 'block' } : null} onClick={() =>
                    toggleField('sportsMenuMobileOpen', false)}>
                <div className="fabrt-d">
                    <h3 className="cat-heading">Favorites</h3>
                    <div className="fabrte">
                        <Link to={{ pathname: '/login' }}>Log in</Link> or
                        <Link to={{ pathname: '/signup' }}>Join</Link> to change your <br />favorites.
                    </div>
                </div>
                <h3 className="cat-heading">TOP SPORTS</h3>
                <SportsList showleagues={true} />
                <h3 className="cat-heading">A-Z SPORTS</h3>
                <SportsList showNoEvents={true} showleagues={false} />
            </div>
        );
    }
}

export default SidebarSports;