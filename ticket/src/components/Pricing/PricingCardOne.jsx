import React from 'react';
import { Link } from 'react-router-dom';
 
class PricingCardOne extends React.Component {
    render(){
        return (
            <section className="pricing-area ptb-120 bg-image">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="pricing-table-box">
                                <div className="pricingTable-header">
                                    <h3 className="title">BASIC PASS</h3>
                                    <div className="price-value"><sup>$</sup>59</div>
                                </div>
                                
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
                            <div className="pricing-table-box">
                                <div className="pricingTable-header">
                                    <h3 className="title">STANDARD PASS</h3>
                                    <div className="price-value"><sup>$</sup>89</div>
                                </div>
                                
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
                            <div className="pricing-table-box">
                                <div className="pricingTable-header">
                                    <h3 className="title">SILVER PASS</h3>
                                    <div className="price-value"><sup>$</sup>99</div>
                                </div>
                                
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
 
export default PricingCardOne;