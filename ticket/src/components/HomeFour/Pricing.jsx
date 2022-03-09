import React from 'react';
import { Link } from 'react-router-dom';
 
class Pricing extends React.Component {
    render(){
        return (
            <section className="pricing-area ptb-120 bg-image">
                <div className="container">
                    <div className="section-title">
                        <span>Pricing Plan</span>
                        <h2>Get Your <b>Tickets</b></h2>

                        <div className="bg-title lax" data-lax-preset="driftLeft">
                            Pricing
                        </div>

                        <div className="bar"></div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="pricing-plan">
                                <h3>BASIC PASS <span><sup>$</sup>59</span></h3>
                                    
                                <ul className="pricing-content">
                                    <li>Regular Seating</li>
                                    <li>Comfortable Seat</li>
                                    <li>Coffee Break</li>
                                    <li>One Workshop</li>
                                    <li>Certificate</li>
                                    <li>Custom Badge</li>
                                    <li>Access to Artists Meeting</li>
                                </ul>
                                
                                <Link to="#" className="btn btn-primary">Buy Ticket Now</Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="pricing-plan">
                                <h3>STANDARD PASS <span><sup>$</sup>89</span></h3>
                                    
                                <ul className="pricing-content">
                                    <li>Regular Seating</li>
                                    <li>Comfortable Seat</li>
                                    <li>Coffee Break</li>
                                    <li>One Workshop</li>
                                    <li>Certificate</li>
                                    <li>Custom Badge</li>
                                    <li>Access to Artists Meeting</li>
                                </ul>
                                
                                <Link to="#" className="btn btn-primary">Buy Ticket Now</Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 offset-lg-0 offset-md-3">
                            <div className="pricing-plan">
                                <h3>SILVER PASS <span><sup>$</sup>99</span></h3>
                                    
                                <ul className="pricing-content">
                                    <li>Regular Seating</li>
                                    <li>Comfortable Seat</li>
                                    <li>Coffee Break</li>
                                    <li>One Workshop</li>
                                    <li>Certificate</li>
                                    <li>Custom Badge</li>
                                    <li>Access to Artists Meeting</li>
                                </ul>
                                
                                <Link to="#" className="btn btn-primary">Buy Ticket Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default Pricing;