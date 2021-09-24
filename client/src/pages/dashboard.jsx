import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { Link } from 'react-router-dom';
import Highlights from '../components/highlights';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
        this._isMounted = false;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        const title = 'Peer to Peer Betting';
        setTitle({ pageTitle: title });

        const preference = JSON.parse(localStorage.getItem('frontend-preference'));
        if (!preference || !preference.p2pModal) {
            setTimeout(() => {
                this._isMounted && this.setState({ showModal: true });
            }, 1500);
        }
    }

    dontShowModal = () => {
        this.setState({ showModal: false });
        let preference = JSON.parse(localStorage.getItem('frontend-preference'));
        if (!preference) {
            preference = {};
        }
        preference.p2pModal = true;
        localStorage.setItem('frontend-preference', JSON.stringify(preference));
    }

    render() {
        const { showModal } = this.state;
        const { addBet, betSlip, removeBet } = this.props;

        return (
            <React.Fragment>
                {showModal && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.setState({ showModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ showModal: false })} />
                        <div>
                            <b>PEER 2 PEER BETTING</b>
                            <hr />
                            <p>
                                Here is where you beat the bookie.
                                The odds are better than anywhere else online, the only catch is you will need some patience.
                                You will need to wait for a peer to bet against you to make the bet complete.
                                PAYPER WIN will take 3% fee from the winner for facilitating the transaction and making sure you get paid.
                                PAYPER WIN Guarantees all winning bets will be paid.
                                If patience is not your virture, say no more; we suggest doing a instant bet and forward to the sportsbook for instant acceptance.
                            </p>
                            <div className="text-right">
                                <button className="form-button" onClick={this.dontShowModal}> Don't show again </button>
                                <button className="form-button ml-2" onClick={() => this.setState({ showModal: false })}> OK </button>
                            </div>
                        </div>
                    </div>
                </div>}
                <Carousel autoPlay={8000} animationSpeed={1800} infinite
                    stopAutoPlayOnHover={true}>
                    <Link to={{ pathname: '/how-it-works' }}>
                        <img src="/images/Banner 1.jpg" />
                    </Link>
                    <Link to={{ pathname: '/how-it-works' }}>
                        <img src="/images/Banner 2.png" />
                    </Link>
                </Carousel>
                <Highlights addBet={addBet} betSlip={betSlip}
                    removeBet={removeBet} />
            </React.Fragment>
        );
    }
}

export default Dashboard;
