import React, { PureComponent } from 'react';
import axios from 'axios';
import { setTitle } from '../libs/documentTitleBuilder';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dayjs from 'dayjs';
import sportNameImage from "../helpers/sportNameImage";
import CreateCustomBetModal from '../components/createCustomBetModal';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

export default class CustomBets extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: false,
            bets: [],
            createModal: false,
        };
    }

    componentDidMount() {
        const title = 'Custom Bets';
        setTitle({ pageTitle: title });
        this.getCustomBetsHistory();
    }

    componentDidUpdate(prevProps) {
        const { user } = this.props;
        const { user: prevUser } = prevProps;

        if (!prevUser && user) {
            this.setState({ error: null });
            this.getCustomBetsHistory();
        }
    }

    getCustomBetsHistory = () => {
        this.setState({ loading: true });

        let url1 = `${serverUrl}/bets?custom=true`;
        axios({
            method: 'get',
            url: url1,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
            .then(({ data }) => {
                if (data) {
                    this.setState({ bets: data, loading: false })
                }
            }).catch((err) => {
                this.setState({ error: err, loading: false });
            });
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getStatusClass = (status, outcome) => {
        switch (status) {
            // p2p
            case 'Pending':
                return 'pending';
            case 'Matched':
                return 'matched';
            case 'Partial Match':
                return 'partialmatched';
            case 'Cancelled':
                return 'cancelled'
            case 'Settled - Lose':
                return 'loss';
            case 'Settled - Win':
                return 'win';
        }
    }

    render() {
        const { loading, error, bets, createModal } = this.state;

        return (
            <div className="col-in px-3">
                <div className="d-flex justify-content-between">
                    <h3>Custom Bets</h3>
                    <button className="form-button"
                        onClick={() => this.setState({ createModal: true })}>
                        <i className="fas fa-plus-square" /> Create a Bet
                    </button>
                </div>
                {createModal && <CreateCustomBetModal closeModal={() => this.setState({ createModal: false })} />}
                <br />
                <div>
                    {loading && <center><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                    </center>}
                    {error && <p>Error...</p>}
                    {bets.map(betObj => {
                        const {
                            _id,
                            bet,
                            toWin,
                            matchStartDate,
                            pickName,
                            pickOdds,
                            createdAt,
                            status,
                            credited,
                            payableToWin,
                            matchingStatus,
                            lineQuery,
                        } = betObj;
                        const type = "moneyline";
                        const sportName = "Other";
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
                                            {this.capitalizeFirstLetter(type)} @ {`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                        </div>
                                        <div>
                                            {pickName}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong>Risk</strong>
                                        <div>
                                            {bet.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong>To win</strong>
                                        {matchingStatus === 'Partial Match' && <div>
                                            {toWin.toFixed(2)}
                                            <br />
                                            {payableToWin.toFixed(2)} Matched
                                            <br />
                                            {(toWin - payableToWin).toFixed(2)} Pending
                                        </div>}
                                        {matchingStatus !== 'Partial Match' && <div>
                                            {toWin.toFixed(2)} {matchingStatus}
                                        </div>}
                                    </div>
                                    <div className="open-bets-col status">
                                        <strong>Status</strong>
                                        <div className={this.getStatusClass(status)}>
                                            {status ? status : 'Accepted'}
                                        </div>
                                    </div>
                                </div>
                                <div className="open-bets-event">
                                    <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} />
                                    {lineQuery.eventName}
                                    <div>
                                        Event Date: {dayjs(matchStartDate).format('ddd, MMM DD, YYYY, HH:mm')}
                                        <strong className="float-right bg-primary">Peer To Peer</strong>
                                    </div>
                                    {credited ? (<div><strong>Credited: ${(credited).toFixed(2)}</strong></div>) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
