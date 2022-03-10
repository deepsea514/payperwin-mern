import React from 'react';
import { Link } from 'react-router-dom';
 
class Cta extends React.Component {
    render(){
        return (
            <section className="cta-area">
                <div className="container">
                    <div className="row h-100 align-items-center">
                        <div className="col-lg-8">
                            <h3>Build Your Dream Brain Today!</h3>
                            <span>We're professional with experience of more than a decade</span>
                        </div>

                        <div className="col-lg-4 text-right">
                            <Link to="#" className="btn btn-secondary">Buy Ticket!</Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default Cta;