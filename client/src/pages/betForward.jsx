import React, { PureComponent } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { setTitle } from '../libs/documentTitleBuilder'
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

    forwardSportsbook = () => {
        axios.get(`${serverUrl}/getPinnacleLogin`, { withCredentials: true })
            .then(({ data }) => {
                const { loginInfo } = data;
                const { token } = loginInfo;
                const { history } = this.props;
                // console.log(data);
                history.push(`/sportsbook/${token}`);
            })
            .catch(() => {
                console.log('error');
            });
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
            <>
                <div className="col-in">
                    <p>Forwarding your bet will place the remaining unmatched portion of your bet at sportsbook, your odds will generally be slightly worse by using this method but highly likely to have full bet played if you are having a hard time being matched.</p>
                    <div><strong>{sportName}</strong>&nbsp;&nbsp;&nbsp;{leagueName}</div>
                    <div>{teamA} vs {teamB}</div>
                    <div>Event Date: {dayjs(startDate).format('ddd, MMM DD, YYYY, HH:MM')}</div>
                    <div>Bet Type: {type}</div>
                    <div>Pick: {pickName}</div>
                    <div><strong>Sportsbook Odds: {oldOdds}</strong> (PAYPER Win odds: {pickOdds})</div>
                    <button className="form-button" onClick={this.forwardSportsbook}>Forward Bet to SportsBook</button>
                </div>
            </>
        );
    }
}

export default withRouter(BetForward);
