import React, { Component } from 'react';
import QRCode from "react-qr-code";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { FormattedMessage } from 'react-intl';
import sportNameImage from "../helpers/sportNameImage";
import dateformat from 'dateformat'

class BetShareModal extends Component {
    state = { show: true }

    getBetType = (bet) => {
        switch (bet.lineQuery.type) {
            case 'moneyline':
                return 'Moneyline';
            case 'total':
            case 'alternative_total':
                return 'Total';
            case 'spread':
            case 'alternative_spread':
                return 'Spread';
            case 'home_total':
                return bet.teamA.name + ' Total';
            case 'away_total':
                return bet.teamB.name + ' Total';
            default:
                return null;
        }
    }

    render() {
        const { lineUrl, loadingUrl, onClose, bet } = this.props;
        const { show } = this.state;
        return (
            <div className="modal confirmation">
                <div className="background-closer" onClick={onClose} />
                <div className="col-in">
                    <div className='d-flex flex-column'>
                        <img src='/images/logo-white.png' style={{ width: '50%', height: 'auto', display: 'block' }} />
                        <h3 className='text-gradient'>BET WITH OR AGAINST ME</h3>
                        {loadingUrl && <center>
                            <Preloader use={ThreeDots}
                                size={100}
                                strokeWidth={10}
                                strokeColor="#F0AD4E"
                                duration={800} />
                        </center>}
                        {!loadingUrl && !lineUrl && <h4><FormattedMessage id="PAGES.OPENBETS.CANNOT_GENERATE_URL" /> </h4>}
                        {!loadingUrl && lineUrl && <>
                            <div className="share-modal-info">
                                <div className='row'>
                                    <div className='col-12'>
                                        <strong>Game</strong>
                                        <div>
                                            <img src={sportNameImage(bet.origin == 'custom' ? 'Side Bet' : bet.lineQuery.sportName)}
                                                width="14"
                                                height="14"
                                                style={{ marginRight: '6px' }}
                                                className="my-0" />&nbsp;
                                            {bet.origin == 'custom' ? bet.lineQuery.eventName :
                                                `${bet.teamA.name} vs ${bet.teamB.name}`}
                                        </div>
                                        <div>{dateformat(bet.startDate, 'ddd, mmm dd, yyyy, HH:MM')}</div>
                                    </div>
                                    <div className='col-6 mt-2'>
                                        <strong>Bet Type</strong>
                                        <div>{this.getBetType(bet)} @{Number(bet.pickOdds) > 0 ? '+' : ''}{bet.pickOdds}</div>
                                    </div>
                                    <div className='col-6 mt-2'>
                                        <strong>Pick</strong>
                                        <div>{bet.pickName}</div>
                                    </div>
                                    <div className='col-6 mt-2'>
                                        <strong>Bet&nbsp;&nbsp;&nbsp;<i className={'cursor-pointer fas fa-eye' + (show ? '' : '-slash')}
                                            onClick={() => this.setState({ show: !show })} /></strong>
                                        <div>{show ? '$' + Number(bet.bet).toFixed(2) : '-'}</div>
                                    </div>
                                    <div className='col-6 mt-2'>
                                        <strong>Win</strong>
                                        <div>{show ? '$' + Number(bet.toWin).toFixed(2) : '-'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex my-3 pl-3'>
                                <QRCode value={lineUrl}
                                    level='M'
                                    size={window.innerWidth > 768 ? 80 : 50} />
                                <div className='ml-3 share-odds-info'>
                                    {bet.oldOdds && !bet.sportsbook && <>
                                        <div>Payper Win Odds: {Number(bet.pickOdds) > 0 ? '+' : ''}{bet.pickOdds}</div>
                                        <div><i>Other Sportsbooks Odds: {Number(bet.oldOdds) > 0 ? '+' : ''}{bet.oldOdds}</i></div>
                                    </>}
                                    <div className='risk-less-win-more'>Risk less, Win more!</div>
                                </div>
                            </div>
                        </>}
                        <div className="text-right">
                            <button className="form-button ml-2" onClick={onClose}> Close </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BetShareModal
