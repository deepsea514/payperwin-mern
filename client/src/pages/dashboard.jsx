import React, { PureComponent } from 'react';
import { setMeta } from '../libs/documentTitleBuilder';
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { Link } from 'react-router-dom';
import Highlights from '../components/highlights';
import DocumentMeta from 'react-document-meta';

class Dashboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            metaData: null
        };
    }

    componentDidMount() {
        const title = 'Peer to Peer Betting';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })

        const preference = JSON.parse(localStorage.getItem('frontend-preference'));
        if (!preference || !preference.p2pModal) {
            setTimeout(() => {
                this.setState({ showModal: true });
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
        const { showModal, metaData } = this.state;
        const { addBet, betSlip, removeBet } = this.props;

        return (
            <React.Fragment>
                {metaData && <DocumentMeta {...metaData} />}
                {showModal && <div className="modal confirmation">
                    <div className="background-closer" onClick={() => this.setState({ showModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ showModal: false })} />
                        <div>
                            <br />
                            <b>PEER 2 PEER BETTING</b>
                            <hr />
                            <p>
                                Here is where you beat the bookie.
                                The odds are even and better than you will find anywhere else online.
                                The only catch is you need some patience, you will need wait for peer to bet the opposite of you to make the bet complete.
                                Payper win will take 3% from only the winner for facilitating the transaction and making sure you get paid.
                                Payper win gurantees all winning bets will be paid.
                                If patience isn't your virtue, say no more; we suggest doing an Instant bet.
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
