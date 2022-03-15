import React from 'react';
import { Link } from 'react-router-dom';

class Footer extends React.Component {
    render() {
        return (
            <footer className="footer-area">
                <div className="container a">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="single-footer-widget">
                                <h3>PAYPER WIN</h3>
                                {/* <span>
                                    <i className="icofont-calendar"></i> 23-27 January, 2020
                                </span> */}

                                <p className="location">
                                    <i className="icofont-google-map"></i> 37459 Kilgard Rd #111, Abbotsford, BC V3G 2H6,
                                </p>

                                <Link to="/contact" className="contact-authority">
                                    <i className="icofont-email"></i> hello@payperwin.com
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                            <div className="single-footer-widget">
                                <h3>Social Connection</h3>
                                <p>Don't miss Link thing! Receive daily news You should connect social area for Any Proper Updates Anytime.</p>

                                <ul className="social-links">
                                    {/* <li>
                                        <a href="https://www.facebook.com/" className="facebook" target="_blank">
                                            <i className="icofont-facebook"></i>
                                        </a>
                                    </li> */}
                                    <li>
                                        <a href="https://twitter.com/payperwin" rel="noopener noreferrer" className="twitter" target="_blank">
                                            <i className="icofont-twitter"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://ca.linkedin.com/company/payperwin" rel="noopener noreferrer" className="linkedin" target="_blank">
                                            <i className="icofont-linkedin"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.instagram.com/payperwin/?hl=en" rel="noopener noreferrer" className="instagram" target="_blank">
                                            <i className="icofont-instagram"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="copyright-area">
                                <ul>
                                    <li><a target="_blank" href='https://payperwin.com/contact' rel="noopener noreferrer">Contact</a></li>
                                    <li><Link to="#">Ticket</Link></li>
                                    <li><Link to="#">Venue</Link></li>
                                    <li><a target="_blank" href='https://payperwin.com/terms-and-conditions' rel="noopener noreferrer">Terms & Conditions</a></li>
                                </ul>
                                <p>
                                    Copyright <i className="icofont-copyright"></i> 2021 PAYPER WIN. All rights reserved
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;