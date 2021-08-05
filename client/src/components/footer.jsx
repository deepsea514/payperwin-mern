import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Footer = (props) => {
    const { user, display_mode } = props;
    return (
        <footer className={display_mode == 'light' ? 'light' : 'dark'}>
            <div className="container">
                <div className="foooter-main">
                    <div className="d-flex flex-wr justify-content-between">
                        <div className="footer-inner" style={{ display: 'none' }}>
                            <h3 className="footer-heading">Sports Betting </h3>
                            <ul>
                                <li><Link to={{ pathname: '/sport/Soccer' }}>Soccer betting</Link></li>
                                <li><Link to={{ pathname: '/sport/Basketball' }}>Basketball betting</Link></li>
                                <li><Link to={{ pathname: '/sport/Baseball' }}>Baseball betting</Link></li>
                                <li><Link to={{ pathname: '/sport/Football' }}>Football betting</Link></li>
                                <li><Link to={{ pathname: '/sport/Table%20Tennis' }}>Table Tennis betting</Link></li>
                                <li><Link to={{ pathname: '/sport/Mixed%20Martial%20Arts' }}>Mixed Martial Arts betting</Link></li>
                                <li><Link to={{ pathname: '/sport/Boxing' }}>Boxing betting</Link></li>
                            </ul>
                        </div>
                        <div className="footer-inner">
                            <h3 className="footer-heading">About PAYPER WIN </h3>
                            <ul>
                                <li><Link to="/privacy-policy">Privacy Policy </Link></li>
                                <li><Link to="/terms-and-conditions">Terms & Conditions </Link></li>
                            </ul>
                        </div>
                        <div className="footer-inner" style={{ display: 'none' }}>
                            <h3 className="footer-heading">Policies</h3>
                            <ul>
                                <li><a href="#">Responsible Gaming </a></li>
                                <li><a href="#">Terms &amp; Conditions </a></li>
                                <li><a href="#">Privacy Policy </a></li>
                                <li><a href="#">Cookie Policy </a></li>
                            </ul>
                        </div>
                        <div className="footer-inner">
                            <h3 className="footer-heading">Help</h3>
                            <ul>
                                <li><Link to="/payment-options">Payment Options </Link></li>
                                <li><Link to="/betting-rules">Betting Rules </Link></li>
                                <li><Link to="/support">Contact Us</Link></li>
                                <li><Link to="/faq">FAQ </Link></li>
                            </ul>
                        </div>
                        {user && <div className="footer-inner">
                            <h3 className="footer-heading">Support </h3>
                            <ul>
                                <li><a href="https://wa.me/message/TICMRPXRFQRCN1" target="_blank"><i className="fab fa-whatsapp"></i> WhatsApp </a></li>
                            </ul>
                        </div>}
                        <div className="footer-inner">
                            <h3 className="footer-heading">Social </h3>
                            <ul>
                                <li><a href="https://www.instagram.com/payperwin/?hl=en"><i className="fab fa-instagram"></i>Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="glambing">
                        <a href="#" className="min-age">18+</a>Gambling can be addictive. Please know your limits and gamble responsibly.
                    </div>
                    <div className="payment_container">
                        <span><img alt="Visa, Master Card" title="Visa, Master Card" src="/images/credit-card-gray.png" /></span>
                        <span><img alt="Etransfer" title="Etransfer" src="/images/eTransfer-gray.png" /></span>
                        <span><img alt="Bitcoin" title="Bitcoin" src="/images/bitcoin-gray.png" /></span>
                        <span><img alt="Ethereum" title="Ethereum" src="/images/Ethereum-gray.png" /></span>
                        <span><img alt="Tether" title="Tether" src="/images/USDT-gray.png" /></span>
                    </div>
                    <p>©2021 PAYPER WIN</p>
                    <div className="d-flex justify-content-between pt-3">
                        <a href="#" >
                            <img alt="eCogra" src="/images/ecogra.png" style={{ maxHeight: '32px' }} />
                        </a>
                        <a href="#">
                            <img alt="Antillephone" src="/images/antillephone.png" style={{ maxHeight: '32px' }} />
                        </a>
                        <a href="#">
                            <img alt="Gamecare" src="/images/gamcare.png" style={{ maxHeight: '32px' }} />
                        </a>
                        <a href="#">
                            <img alt="Network Solution" src="/images/networksolution.png" style={{ maxHeight: '32px' }} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
