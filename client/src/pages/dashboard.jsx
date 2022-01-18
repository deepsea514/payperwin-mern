import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { Link } from 'react-router-dom';
import Highlights from '../components/highlights';
import { FormattedMessage } from 'react-intl';

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

        // const preference = JSON.parse(localStorage.getItem('frontend-preference'));
        // if (!preference || !preference.p2pModal) {
        //     setTimeout(() => {
        //         this._isMounted && this.setState({ showModal: true });
        //     }, 1500);
        // }
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
        const { addBet, betSlip, removeBet, toggleField } = this.props;

        return (
            <React.Fragment>
                {/* {showModal && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.setState({ showModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ showModal: false })} />
                        <div>
                            <b><FormattedMessage id="COMPONENTS.PEERTOPEER.BETTING" /></b>
                            <hr />
                            <p>
                                <FormattedMessage id="PAGES.DASHBOARD.MODAL.CONTENT" />
                            </p>
                            <div className="text-right">
                                <button className="form-button" onClick={this.dontShowModal}> <FormattedMessage id="COMPONENTS.DONOTSHOW" /> </button>
                                <button className="form-button ml-2" onClick={() => this.setState({ showModal: false })}> OK </button>
                            </div>
                        </div>
                    </div>
                </div>} */}
                {/* <Carousel autoPlay={8000}
                    animationSpeed={1800}
                    infinite>
                    <Link to={{ pathname: '/how-it-works' }}>
                        <img src="/images/Banner 1.jpg" />
                    </Link>
                    <Link to={{ pathname: '/' }}>
                        <img src="/images/Banner 2.png" />
                    </Link>
                </Carousel> */}
                <Highlights addBet={addBet}
                    toggleField={toggleField}
                    betSlip={betSlip}
                    removeBet={removeBet} />
            </React.Fragment>
        );
    }
}

export default Dashboard;
