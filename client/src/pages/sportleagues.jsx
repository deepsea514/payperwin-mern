import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
// import sportNameIcon from '../helpers/sportNameIcon';
import sportNameImage from "../helpers/sportNameImage";
const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;
import '../style/all.min.css';

const sportNameSpanStyle = {
    float: 'initial',
};

class SportsLeagues extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            leagues: [],
            letters: [
                '[0-9]',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                'Y', 'Z',
            ],
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getLeagues();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getLeagues = () => {
        const { sportName } = this.props;
        const url = `${serverUrl}/sportleague?name=${sportName}`;
        axios({
            method: 'get',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(({ data }) => {
            this.setState({ leagues: data });
        });
    }

    componentDidUpdate(prevProps) {
        const { sportName } = this.props;
        const { sportName: prevsportName } = prevProps;
        const sportChanged = (sportName !== prevsportName);
        if (sportChanged) {
            this.getLeagues();
        }
    }

    render() {
        const { leagues, letters } = this.state;
        const { sportName } = this.props;

        return (
            <>
                <div className="highlights">
                    <div className="bet-slip-header">TOP LEAGUES</div>
                    <div className="content">
                        {leagues && leagues.length && <ul className="leagues-list">
                            {leagues.slice(0, 6).map(league => (
                                <li key={league.name}
                                    style={!league.eventCount ? { opacity: 0.5, pointerEvents: 'none' } : null} >
                                    <Link
                                        to={{ pathname: `/sport/${sportName}/league/${league.originId}` }}
                                    >
                                        <span style={sportNameSpanStyle}>{league.name}</span>
                                        <span>{league.eventCount}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>}
                        <br />
                        {letters.map(letter => {
                            const filteredLeagues = leagues.filter(league => {
                                const searchPattern = new RegExp('^' + letter, 'i');
                                return searchPattern.test(league.name);
                            });
                            if (!filteredLeagues.length) return null;
                            return (
                                <ul className="leagues-list" key={letter}>
                                    <li className="league-list-letter">{letter == '[0-9]' ? '#' : letter}</li>
                                    {filteredLeagues.map(league => (
                                        <li key={`${letter}-${league.name}`}
                                            style={!league.eventCount ? { opacity: 0.5, pointerEvents: 'none' } : null} >
                                            <Link
                                                to={{ pathname: `/sport/${sportName}/league/${league.originId}` }}
                                            >
                                                <span style={sportNameSpanStyle}>{league.name}</span>
                                                <span>{league.eventCount}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(SportsLeagues);