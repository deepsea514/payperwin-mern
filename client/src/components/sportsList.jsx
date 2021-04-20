import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import sportNameIcon from '../helpers/sportNameIcon';
const config = require('../../../config.json');
const serverUrl = config.appUrl;
import '../style/all.min.css';

class SportsList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sports: null,
            error: null,
        };
    }

    componentDidMount() {
        this.getSports();
    }

    getSports() {
        const url = `${serverUrl}/sportsdir`;
        axios({
            method: 'get',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(({ data }) => {
            if (data) {
                this.setState({ sports: data })
            }
        }).catch((err) => {
            this.setState({ error: err });
        });
    }

    render() {
        const { showNoEvents } = this.props;
        const { sports } = this.state;
        if (!sports) {
            return null;
        }
        return (
            <ul className="left-cat top-cls-sport">
                {
                    sports.sort((a, b) => b.eventCount - a.eventCount).map(sport => {
                        const { name } = sport;
                        const hasEvents = sport.eventCount > 0;
                        return hasEvents || showNoEvents ? (
                            <li key={name}>
                                <Link
                                    to={{ pathname: `/sport/${sport.name}` }}
                                    style={!hasEvents ? { opacity: 0.25, pointerEvents: 'none' } : null}
                                >
                                    <i className={`${sportNameIcon(name) || 'fas fa-trophy'}`} />{name}<span>{sport.eventCount}</span>
                                </Link>
                            </li>
                        ) : null;
                    }
                    )
                }
            </ul>
        );
    }
}

export default withRouter(SportsList);
