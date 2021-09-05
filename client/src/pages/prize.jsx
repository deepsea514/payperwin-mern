import React, { PureComponent } from 'react';
import { setTitle } from '../libs/documentTitleBuilder'
import { Link, withRouter } from 'react-router-dom';
import WinWheel from '../libs/WinWheel';
import axios from 'axios';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import rouletteSelection from '../libs/rouletteSelection';

import config from '../../../config.json';
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class Prize extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            prizeWheel: null,
            isSpinning: false,
            pool: [
                { Id: "$5 Credit", Score: 17 },
                { Id: "$25 Credit", Score: 1.49 },
                { Id: "+2,000 Loyalty", Score: 28 },
                { Id: "$10 Credit", Score: 2.5 },
                { Id: "$5 Credit", Score: 17 },
                { Id: "$100 Credit", Score: 0.01 },
                { Id: "+5,000 Loyalty", Score: 8 },
                { Id: "$25 Credit", Score: 1.49 },
                { Id: "$5 Credit", Score: 17 },
                { Id: "$10 Credit", Score: 2.5 },
                { Id: "+10,000 Loyalty", Score: 5 },
                { Id: "$100 Credit", Score: 0.01 },
            ],
            used: false,
            remainingTimer: null,
            remainingTime: '',
            winMessage: null,
            error: false,
        };
    }

    componentDidMount() {
        const title = 'Prize';
        setTitle({ pageTitle: title });

        let prizeWheel = new WinWheel({
            canvasId: "prize-canvas",
            'outerRadius': 200,
            'innerRadius': 0,
            'textFontSize': 24,
            'responsive': true,
            'textOrientation': 'vertical',
            'textAlignment': 'outer',
            'numSegments': 12,
            'segments': [
                { 'fillStyle': '#00aef0', 'text': '$5 Credit', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 1 },
                { 'fillStyle': '#fff200', 'text': '$25 Credit', 'textFontSize': 14, 'textFillStyle': '#000', 'id': 2 },
                { 'fillStyle': '#ee1c24', 'text': '+2,000 Loyalty', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 3 },
                { 'fillStyle': '#e70697', 'text': '$10 Credit', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 4 },
                { 'fillStyle': '#00aef0', 'text': '$5 Credit', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 5 },
                { 'fillStyle': '#f26522', 'text': '$100 Credit', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 6 },
                { 'fillStyle': '#3cb878', 'text': '+5,000 Loyalty', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 7 },
                { 'fillStyle': '#fff200', 'text': '$25 Credit', 'textFontSize': 14, 'textFillStyle': '#000', 'id': 8 },
                { 'fillStyle': '#00aef0', 'text': '$5 Credit', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 9 },
                { 'fillStyle': '#e70697', 'text': '$10 Credit', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 10 },
                { 'fillStyle': '#f6989d', 'text': '+10,000 Loyalty', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 11 },
                { 'fillStyle': '#f26522', 'text': '$100 Credit', 'textFontSize': 14, 'textFillStyle': '#ffffff', 'id': 12 },
            ],
            'animation': {
                'type': 'spinToStop',
                'duration': 12,
                'spins': 6,
                'callbackFinished': this.finishPrize.bind(this),
                // 'callbackAfter': function drawTriangle() {
                //     let ctx = prizeWheel.ctx;

                //     ctx.strokeStyle = 'navy';
                //     ctx.fillStyle = 'aqua';
                //     ctx.lineWidth = 2;
                //     ctx.beginPath();
                //     ctx.moveTo(170, 5);
                //     ctx.lineTo(230, 5);
                //     ctx.lineTo(200, 40);
                //     ctx.lineTo(171, 5);
                //     ctx.stroke();
                //     ctx.fill();
                // }
                // 'soundTrigger': 'pin',
            },
            'pins': {
                'number': 12,
                'fillStyle': '#000000',
                'outerRadius': 4,
                'responsive': true,
            }
        });

        this.setState({
            prizeWheel: prizeWheel,
            isSpinning: false,
        });

        const { user } = this.props;
        if (user) {
            this.getPrizeData();
        }
    }

    getPrizeData = () => {
        this.setState({ loading: true });
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();
        axios.get(`${serverUrl}/prize`, {
            withCredentials: true,
            params: {
                date: new Date(year, month, date)
            }
        })
            .then(({ data }) => {
                if (data.used) {
                    this.remainingTimeHandler();
                    const remainingTimer = setInterval(this.remainingTimeHandler.bind(this), 60 * 1000);
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

    startWheel = () => {
        const { prizeWheel, pool } = this.state;
        this.setState({ isSpinning: true });
        const winner = rouletteSelection(pool);
        const stopAt = prizeWheel.getRandomForSegment(winner + 1);
        prizeWheel.animation.stopAngle = stopAt;
        prizeWheel.startAnimation();
    }

    resetWheel = () => {
        const { prizeWheel } = this.state;
        if (prizeWheel) {
            prizeWheel.stopAnimation(false);
            prizeWheel.rotationAngle = 0;
            prizeWheel.draw();
        }
        this.setState({ isSpinning: false });
    }

    finishPrize = (indicatedSegment) => {
        this.setState({ winMessage: 'Congratulations! You have won ' + indicatedSegment.text });
        setTimeout(() => {
            this.resetWheel();
            this.savePrize(indicatedSegment);
        }, 1000);
    }

    savePrize = (indicatedSegment) => {
        this.remainingTimeHandler();
        const remainingTimer = setInterval(this.remainingTimeHandler.bind(this), 60 * 1000);
        this.setState({ used: true, remainingTimer });
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();
        axios.post(`${serverUrl}/prize`,
            { prize: indicatedSegment.id, date: new Date(year, month, date) },
            { withCredentials: true },
        );
    }

    render() {
        const { isSpinning, loading, error, used, winMessage, remainingTime } = this.state;
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
                <div className="" style={{ display: user && !loading && !error && !used ? 'block' : 'none' }}>
                    <div className="d-flex justify-content-center">
                        <canvas id="prize-canvas" width="420" height="420"
                            data-responsiveminwidth="150"
                            data-responsivescaleheight="true"
                            data-responsivemargin="50"
                        >
                            <p align="center">Sorry, your browser doesn't support canvas. Please try another.</p>
                        </canvas>
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                        <div style={{ width: '50%' }}>
                            <button disabled={isSpinning} className='spin_button' onClick={this.startWheel}>Play <b>SPIN</b></button>
                        </div>
                    </div>
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