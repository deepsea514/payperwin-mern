import React from 'react';
import { Link } from 'react-router-dom';
 
class BuyTicket extends React.Component {
    render(){
        return (
            <section className="buy-tickets-area ptb-120">
                <div className="buy-tickets">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="section-title">
                                    <span>Hurry Up!</span>
                                    <h2>Book Your Seat</h2>
                            
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.</p>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="buy-ticket-btn">
                                    <Link to="#" className="btn btn-primary">Buy Ticket!</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default BuyTicket;