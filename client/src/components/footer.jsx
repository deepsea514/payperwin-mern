import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Footer = (props) => {
    return (
        <footer>
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
                            <h3 className="footer-heading">Help &amp; Support </h3>
                            <ul>
                                <li><Link to="/payment-options">Payment Options </Link></li>
                                <li><Link to="/betting-rules">Betting Rules </Link></li>
                                <li><Link to="/support">Contact Us</Link></li>
                                <li><Link to="/faq">FAQ </Link></li>
                            </ul>
                        </div>
                        <div className="footer-inner">
                            <h3 className="footer-heading">Social </h3>
                            <ul>
                                <li><a href="#"><i className="fab fa-facebook"></i>Facebook</a></li>
                                <li><a href="#"><i className="fab fa-twitter"></i>Twitter</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="glambing">
                        <a href="#" className="min-age">18+</a>Gambling can be addictive. Please know your limits and gamble responsibly.
                    </div>
                    <div className="logo-c">
                        <img src="/images/c-logo.jpg" />
                    </div>
                    <p>©2021 PAYPER WIN</p>
                    <div className="logo-c">
                        <img src="/images/footer-logo.jpg" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
