import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

class SportsBreadcrumb extends Component {
    render() {
        const { sportName, league } = this.props;
        const displaySportName = sportName ? sportName.replace("_", " ") : ""

        return (
            <div className="contentBlock hide-mobile" style={{ background: 'url("/images/sports/soccer.jpg")' }}>
                <div className="dashboard_breadcrumb">
                    <div>
                        <ul>
                            <li><Link className="dashboard_breadcrumb_textLabel" to="/">Home</Link></li>
                            <span className="dashboard_breadcrumb_separator">/</span>
                            {!league && <li><span className="dashboard_breadcrumb_textLabel">{displaySportName}</span></li>}
                            {league && <li><Link className="dashboard_breadcrumb_textLabel" to={`/sport/${sportName}`}>{displaySportName}</Link></li>}
                            {league && <>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><span className="dashboard_breadcrumb_textLabel">{league.name}</span></li>
                            </>}
                        </ul>
                    </div>
                </div>
                <div className="dashboard_title">
                    <h3>
                        {!league && <span>{displaySportName} Odds</span>}
                        {league && <span>{league.name} Odds</span>}
                    </h3>
                    {league && <div className="dashboard_togglefav">
                        <div>
                            <a className="dashboard_starimg dashboard_starimg_light">
                                <img src="/images/sports/star-unselected.svg" alt="Favorite" className="dashboard_starimg_unselect" />
                            </a>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}

export default SportsBreadcrumb;