import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

const Footer = (props) => {
    const [show, setShow] = useState(false);
    const { user, display_mode } = props;
    return (
        <footer className={`${display_mode == 'light' ? 'light' : 'dark'}`}>
            <div className="container">
                <div className='d-flex d-sm-none justify-content-center toggle mb-3'>
                    <i className={`fas fa-chevron-${show ? 'up' : 'down'}`}
                        style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }}
                        onClick={() => setShow(!show)} />
                </div>
                <div className={`footer-main not-mobile ${show ? 'show' : ''}`}>
                    <div className="d-flex flex-wr justify-content-between">
                        <div className="footer-inner">
                            <h3 className="footer-heading"><FormattedMessage id="COMPONENTS.ABOUT.PPW" /> </h3>
                            <ul>
                                <li><Link to="/privacy-policy"><FormattedMessage id="COMPONENTS.PRIVACY_POLICY" /> </Link></li>
                                <li><Link to="/terms-and-conditions"><FormattedMessage id="COMPONENTS.TERMS_CONDITIONS" /> </Link></li>
                                <li><Link to="/about-us"><FormattedMessage id="COMPONENTS.ABOUTUS" /> </Link></li>
                            </ul>
                        </div>
                        <div className="footer-inner">
                            <h3 className="footer-heading"><FormattedMessage id="COMPONENTS.HELP" /></h3>
                            <ul>
                                <li><Link to="/payment-options"><FormattedMessage id="COMPONENTS.PAYMENT.OPTIONS" /> </Link></li>
                                <li><Link to="/betting-rules"><FormattedMessage id="COMPONENTS.BETTING.RULES" /> </Link></li>
                                <li><Link to="/support"><FormattedMessage id="COMPONENTS.CONTACTUS" /></Link></li>
                                <li><Link to="/faq"><FormattedMessage id="COMPONENTS.CASHBACK.FAQ" /> </Link></li>
                            </ul>
                        </div>
                        {user && <div className="footer-inner">
                            <h3 className="footer-heading"><FormattedMessage id="COMPONENTS.SUPPORT" /> </h3>
                            <ul>
                                <li><a href="https://wa.me/message/TICMRPXRFQRCN1" target="_blank"><i className="fab fa-whatsapp"></i> WhatsApp </a></li>
                            </ul>
                        </div>}
                        <div className="footer-inner">
                            <h3 className="footer-heading"><FormattedMessage id="COMPONENTS.SOCIAL" /> </h3>
                            <ul>
                                <li><a href="https://www.instagram.com/payperwin/?hl=en"><i className="fab fa-instagram"></i><FormattedMessage id="COMPONENTS.INSTAGRAM" /></a></li>
                                <li><a href="https://twitter.com/payperwin"><i className="fab fa-twitter"></i><FormattedMessage id="COMPONENTS.TWITTER" /></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="glambing">
                        <a href="#" className="min-age">19+</a><FormattedMessage id="COMPONENTS.GAMBLING.CANBE.ADDICTIVE" />
                    </div>
                    {/* <div className="payment_container">
                        <span><img alt="Visa, Master Card" title="Visa, Master Card" src="/images/credit-card-gray.png" /></span>
                        <span><img alt="Etransfer" title="Etransfer" src="/images/eTransfer-gray.png" /></span>
                        <span><img alt="Bitcoin" title="Bitcoin" src="/images/bitcoin-gray.png" /></span>
                        <span><img alt="Ethereum" title="Ethereum" src="/images/Ethereum-gray.png" /></span>
                        <span><img alt="Tether" title="Tether" src="/images/USDT-gray.png" /></span>
                    </div> */}
                    <p>©2021 PAYPER WIN</p>
                    {/* <div className="d-flex justify-content-between pt-3">
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
                    </div> */}
                </div>
            </div>
        </footer>
    );
};

export default injectIntl(Footer);
