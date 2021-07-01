import React, { PureComponent } from 'react';
import axios from 'axios';
import { setMeta } from '../libs/documentTitleBuilder';
import sportNameIcon from '../helpers/sportNameIcon';
import dayjs from 'dayjs';
import DocumentMeta from 'react-document-meta';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

export default class OpenBetsSportsBook extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bets: [],
            error: null,
        };
    }

    componentDidMount() {
        const { settledBets } = this.props;
        const title = settledBets ? 'Bet History(SportsBook)' : 'Open Bets(SportsBook)';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })

        this.getBetHistory();
    }

    componentDidUpdate(prevProps) {
        const { openBets } = this.props;
        const { openBets: prevOpenBets } = prevProps;
        const betPageChanged = openBets !== prevOpenBets;

        if (betPageChanged) {
            this.setState({ error: null });
            this.getBetHistory();
        }
    }

    getBetHistory() {
        let url = `${serverUrl}/bets-sportsbook`;
        const { openBets, settledBets } = this.props;
        if (openBets) {
            url += '?openBets=true'
        } else if (settledBets) {
            url += '?settledBets=true'
        }
        axios({
            method: 'get',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }).then(({ data }) => {
            if (data) {
                this.setState({ bets: data })
            }
        }).catch((err) => {
            this.setState({ error: err });
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { bets, metaData } = this.state;
        const { settledBets } = this.props;
        return (
            <div className="col-in">
                {metaData && <DocumentMeta {...metaData} />}
                <h3>{settledBets ? 'Bet History(SportsBook)' : 'Open Bets(SportsBook)'}</h3>
                {bets.map(betObj => {
                    const {
                        _id,
                        WagerInfo,
                        createdAt,
                        updatedAt,
                        Name
                    } = betObj;

                    return (
                        <div className="open-bets" key={_id}>
                            <div className="open-bets-flex">
                                <div className="open-bets-col">
                                    <strong>Accepted</strong>
                                    <div>
                                        {dayjs(createdAt).format('YYYY/M/D HH:mm')}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>Bet Type</strong>
                                    <div>
                                        {WagerInfo.Type}
                                    </div>
                                    <div>
                                        {WagerInfo.SelectionType}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>Risk</strong>
                                    <div>
                                        {Number(WagerInfo.ToRisk).toFixed(2)}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>Odds</strong>
                                    <div>
                                        {WagerInfo.Odds}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>To win</strong>
                                    <div>
                                        {Number(WagerInfo.ToWin).toFixed(2)}
                                    </div>
                                </div>
                                {settledBets && <div className="open-bets-col">
                                    <strong>Profit And Loss</strong>
                                    <div>
                                        {Number(WagerInfo.ProfitAndLoss).toFixed(2)}
                                    </div>
                                </div>}
                                <div className="open-bets-col status">
                                    <strong>Status</strong>
                                    <div>
                                        {Name}
                                    </div>
                                </div>
                            </div>

                            {!WagerInfo.Legs && <div className="open-bets-event">
                                <i className={`${sportNameIcon(WagerInfo.Sport) || 'fas fa-trophy'}`} />
                                {WagerInfo.LeagueName}
                                <div>{WagerInfo.EventName}</div>
                                <div>Event Date: {dayjs(WagerInfo.EventDateFm).format('ddd, MMM DD, YYYY, HH:MM')}</div>
                            </div>}

                            {WagerInfo.Legs && WagerInfo.Legs.map((leg, index) => (
                                <div className="open-bets-event">
                                    <i className={`${sportNameIcon(leg.Sport) || 'fas fa-trophy'}`} />
                                    {leg.LeagueName}
                                    <div>{leg.EventName}</div>
                                    <div>Event Date: {dayjs(leg.EventDateFm).format('ddd, MMM DD, YYYY, HH:MM')}</div>
                                </div>
                            ))}

                        </div>
                    );
                })}
            </div>
        );
    }
}
