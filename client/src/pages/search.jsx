import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import _env from '../env.json';
import resObjPath from '../libs/resObjPath';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import sportNameImage from '../helpers/sportNameImage';
const serverUrl = _env.appUrl;

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            results: []
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.getSearchResult();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps) {
        const { match } = this.props;
        const param = resObjPath(match, 'params.param');
        const { match: prevMatch } = prevProps;
        const prevParam = resObjPath(prevMatch, 'params.param');
        if (prevParam != param) {
            this.getSearchResult();
        }
    }

    getSearchResult = () => {
        const { match } = this.props;
        const param = resObjPath(match, 'params.param');
        this.setState({ loading: true });
        axios.get(`${serverUrl}/search`, { params: { param } })
            .then(({ data }) => {
                this.setState({ results: data, loading: false });
            })
            .catch(() => {
                this.setState({ results: [], loading: false });
            })
    }

    renderSearchResult = () => {
        const { loading, results } = this.state;
        if (loading) {
            return (
                <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>
            )
        }
        if (results.length == 0) {
            return (
                <ul className="leagues-list">
                    <li className="league-list-letter no-result">No Result</li>
                    <li>Try to search again with a different league or team name.</li>
                </ul>
            )
        }
        return (
            <ul className="leagues-list">
                <li className="league-list-letter">{results.length} Results</li>
                {results.map((result, index) => {
                    if (result.type == 'league') {
                        return (
                            <li key={index}>
                                <Link
                                    to={{ pathname: `/sport/${result.sportName ? result.sportName.replace(" ", "_") : ""}/league/${result.leagueId}` }}>
                                    <span style={{ float: 'initial' }}>
                                        <img src={sportNameImage(result.sportName)} width="16" height="16" className="mr-2" />
                                        {result.leagueName}
                                    </span>
                                    <span><i className="fas fa-chevron-right" /></span>
                                </Link>
                            </li>
                        )
                    } else if (result.type == 'team') {
                        return (
                            <li key={index}>
                                <Link
                                    to={{ pathname: `/sport/${result.sportName ? result.sportName.replace(" ", "_") : ""}/league/${result.leagueId}/team/${result.team}` }}>
                                    <span style={{ float: 'initial' }}>
                                        <img src={sportNameImage(result.sportName)} width="16" height="16" className="mr-2" />
                                        {result.team} ({result.leagueName})
                                    </span>
                                    <span><i className="fas fa-chevron-right" /></span>
                                </Link>
                            </li>
                        )
                    }
                    return null;
                })}
            </ul>
        )
    }

    render() {
        const { match } = this.props;
        const param = resObjPath(match, 'params.param');
        const { loading, results } = this.state;
        return (
            <>
                <div className="highlights">
                    <h3>Search Result for "{param}"</h3>
                    <div className="content">
                        {this.renderSearchResult()}
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(Search);