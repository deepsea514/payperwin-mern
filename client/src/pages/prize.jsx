import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder'
import { withRouter } from 'react-router-dom';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import rouletteSelection from '../libs/rouletteSelection';
import { getPrize, postPrize } from '../redux/services';
import Wheel from '../components/wheel';

class Prize extends Component {
    constructor(props) {
        super(props);
        const tadaSound = new Audio('/media/tada.wav');
        this.state = {
            pool: [
                { text: "$5 Credit", Score: 17, id: 1, background: '#0F0' },
                { text: "$25 Credit", Score: 1.49, id: 2, background: '#0F0' },
                { text: "+2,000 Loyalty", Score: 28, id: 3, background: '#0F0' },
                { text: "$10 Credit", Score: 2.5, id: 4, background: '#0F0' },
                { text: "$5 Credit", Score: 17, id: 5, background: '#0F0' },
                { text: "$100 Credit", Score: 0.01, id: 6, background: '#0F0' },
                { text: "+5,000 Loyalty", Score: 8, id: 7, background: '#0F0' },
                { text: "$25 Credit", Score: 1.49, id: 8, background: '#0F0' },
                { text: "$5 Credit", Score: 17, id: 9, background: '#0F0' },
                { text: "$10 Credit", Score: 2.5, id: 10, background: '#0F0' },
                { text: "+10,000 Loyalty", Score: 5, id: 11, background: '#0F0' },
                { text: "$100 Credit", Score: 0.01, id: 12, background: '#0F0' },
            ],
            used: false,
            remainingTimer: null,
            remainingTime: '',
            winMessage: null,
            error: false,
            tadaSound: tadaSound
        };
    }

    componentDidMount() {
        const title = 'Prize';
        setTitle({ pageTitle: title });
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
        const { pool, tadaSound } = this.state;
        if (tadaSound) {
            tadaSound.pause();
            tadaSound.currentTime = 0;
            tadaSound.play();
        }
        this.remainingTimeHandler();
        const remainingTimer = setInterval(this.remainingTimeHandler, 1000);
        this.setState({ used: true, remainingTimer, winMessage: 'Congratulations! You have won ' + pool[selectedItem].text });
        postPrize(pool[selectedItem].id)
    }

    render() {
        const { loading, error, used, winMessage, remainingTime, pool } = this.state;
        const { user } = this.props;

        return (
            <div className="col-in">
                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}
                {error && <h3>Sorry, can't load data.</h3>}
                {!loading && !error && used && <>
                    <center>
                        <p style={{ fontSize: '24px' }}><b>{remainingTime}</b> remaining until next turn.</p>
                    </center>
                </>}
                <div style={{ display: user && !loading && !error && !used ? 'block' : 'none' }}>
                    <Wheel items={pool} onSelectItem={this.savePrize} />
                </div>

                {winMessage && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.setState({ winMessage: null })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ winMessage: null })} />
                        <div>
                            <b>Congratulations!</b>
                            <hr />
                            <p>
                                {winMessage}
                            </p>
                            <div className="text-right">
                                <button className="form-button ml-2" onClick={() => this.setState({ winMessage: null })}> OK </button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

export default withRouter(Prize);