import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { setTitle } from '../libs/documentTitleBuilder'
import resObjPath from '../libs/resObjPath'
import leaguesData from '../../public/data/leagues.json';
import oddsData from '../../public/data/odds.json';
import fixturesData from '../../public/data/fixtures.json';
import getLineFromSportData from '../libs/getLineFromSportData';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

class BetForward extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            confirmationOpen: false,
            error: null,
        };
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Forward Bet' });
        this.getBet();
    }

    getBet() {
        const { match } = this.props;
        const { betId } = match.params;
        if (betId) {
            const url = `${serverUrl}/line?betId=${betId}`;
            axios({
                method: 'get',
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }).then(({ data }) => {
                this.setState({ data });
            }).catch((err) => {
                this.setState({ error: err });
            });
        }
    }

    forwardBet() {
        const { match } = this.props;
        const { betId } = match.params;
        if (betId) {
            const url = `${serverUrl}/betforward?betId=${betId}`;
            axios({
                method: 'get',
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }).then(({ data }) => {
                // this.setState({ data });
            }).catch((err) => {
                this.setState({ error: err });
            });
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { match } = this.props;
        const { error } = this.state;
        if (error) {
            return <div>Error getting line.</div>;
        }
        const { data } = this.state;
        if (!data) {
            return <div>Loading...</div>;
        }

        const { sportName, leagueName, teamA, teamB, startDate, line, type, oldOdds, pickOdds, pickName } = data;
        return (
            <div className="col-in">
                <p>Forwarding your bet will place the remaining unmatched portion of your bet at sportsbook, your odds will generally be slightly worse by using this method but highly likely to have full bet played if you are having a hard time being matched.</p>
                <div>{teamA} vs {teamB}</div>
                <div>Event Date: {dayjs(startDate).format('ddd, MMM DD, YYYY, HH:MM')}</div>
                <div>Bet Type: {type}</div>
                <div>Pick: {pickName}</div>
                <div><strong>Sportsbook Odds: {oldOdds}</strong> (PAYPER Win odds: {pickOdds})</div>
                <button className="form-button">Forward Bet to SportsBook</button>
            </div>
        );
    }
}

export default withRouter(BetForward);
