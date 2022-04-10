import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getPrize, postPrize } from '../redux/services';
import Wheel from './wheel';
import Confetti from 'react-confetti'
import { showSuccessToast } from '../libs/toast';

class PrizeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pool: [
                { label: "$1", text: "$1 Credit", Score: 17, id: 1, textColor: '#2df3e9', textColor2: '#73e6f7' },
                { label: "$11", text: "$11 Credit", Score: 1.49, id: 2, textColor: '#FF14D8', textColor2: '#FF14D8' },
                { label: "+2,000", text: "+2,000 Reward Points", Score: 28, id: 3, textColor: '#FFF', textColor2: '#888' },
                { label: "$8", text: "$8 Credit", Score: 2.5, id: 4, textColor: '#00aaff', textColor2: '#ea636e' },
                { label: "$3", text: "$3 Credit", Score: 17, id: 5, textColor: '#2df3e9', textColor2: '#73e6f7' },
                { label: "$88", text: "$88 Credit", Score: 0.01, id: 6, textColor: '#BEF001', textColor2: '#f0c329' },
                { label: "+5,000", text: "+5,000 Reward Points", Score: 8, id: 7, textColor: '#FFF', textColor2: '#888' },
                { label: "$25", text: "$25 Credit", Score: 1.49, id: 8, textColor: '#FF14D8', textColor2: '#FF14D8' },
                { label: "$5", text: "$5 Credit", Score: 17, id: 9, textColor: '#2df3e9', textColor2: '#73e6f7' },
                { label: "$10", text: "$10 Credit", Score: 2.5, id: 10, textColor: '#00aaff', textColor2: '#ea636e' },
                { label: "+8,000", text: "+8,000 Reward Points", Score: 5, id: 11, textColor: '#FFF', textColor2: '#888' },
                { label: "$100", text: "$100 Credit", Score: 0.01, id: 12, textColor: '#BEF001', textColor2: '#f0c329' },
            ],
            used: false,
            remainingTimer: null,
            remainingTime: '',
            winMessage: null,
            error: false,
        };
    }

    componentDidMount() {
        const { user } = this.props;
        if (user) {
            this.getPrizeData();
        }
    }

    getPrizeData = () => {
        this.setState({ loading: true });
        getPrize()
            .then(({ data }) => {
                if (data.used) {
                    this.remainingTimeHandler();
                    const remainingTimer = setInterval(this.remainingTimeHandler, 60 * 1000);
                    this.setState({ loading: false, error: false, used: true, remainingTimer });
                } else {
                    this.setState({ loading: false, error: false, used: false });
                }
            })
            .catch(() => {
                this.setState({ loading: false, error: true });
            })
    }

    componentWillUnmount() {
        const { remainingTimer } = this.state;
        if (remainingTimer) clearInterval(remainingTimer);
    }

    remainingTimeHandler = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();
        const tomorrow = new Date(year, month, date + 1);
        let remaining = tomorrow.getTime() - today.getTime();
        remaining = parseInt(remaining / 1000 / 60);
        const hour = parseInt(remaining / 60);
        const min = remaining % 60;
        this.setState({ remainingTime: `${hour} Hours ${min} Minutes` })
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.user && this.props.user) {
            this.getPrizeData();
        }
    }

    savePrize = (selectedItem) => {
        const { pool } = this.state;
        this.remainingTimeHandler();
        const remainingTimer = setInterval(this.remainingTimeHandler, 1000);
        this.setState({ used: true, remainingTimer, winMessage: 'You have won ' + pool[selectedItem].text });
        postPrize(pool[selectedItem].id)
            .then(({ data: { newClaims } }) => {
                if (newClaims)
                    showSuccessToast(`${newClaims} loyalty milestone unlocked `);
            })
            .catch(() => { });
    }

    render() {
        const { loading, error, used, winMessage, remainingTime, pool } = this.state;
        const { onClose, showLoginModalAction, user } = this.props;

        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className={`col-in prize${used ? '-used' : ''}`}>
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div>
                        <br />
                    </div>
                    {loading && <center>
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </center>}
                    {error && <h3>Sorry, can't load data.</h3>}
                    {!loading && !error && used && !winMessage && <>
                        <center>
                            <p style={{ fontSize: '20px' }}><b>{remainingTime}</b> remaining until next turn.</p>
                        </center>
                    </>}
                    <div style={{ display: !loading && !error && !used ? 'block' : 'none' }}>
                        <h2 className='text-center mb-3'>Tap the wheel to spin!</h2>
                        <p className='text-center'>You get 1 FREE spin each day to win a prize.</p>
                        <Wheel user={user}
                            showLoginModalAction={showLoginModalAction}
                            onClose={onClose}
                            items={pool}
                            onSelectItem={this.savePrize} />
                    </div>

                    <div className={winMessage ? 'd-block' : 'd-none'}>
                        <Confetti style={{ marginTop: '-10vh' }} />
                        <p style={{ fontSize: '28px' }} className='text-center'>Congratulations!</p>
                        <p style={{ fontSize: '20px' }} className='text-center'>{winMessage}</p>
                        <div className="text-right">
                            <button className="form-button ml-2" onClick={onClose}> DISMISS </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(PrizeModal);