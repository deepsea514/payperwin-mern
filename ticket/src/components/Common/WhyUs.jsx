import React from 'react';
import { Link } from 'react-router-dom';
 
class WhyUs extends React.Component {
    render(){
        return (
            <section className="why-choose-us">
                <div className="row m-0">
                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-box">
                            <div className="d-table">
                                <div className="d-table-cell">
                                    <div className="content">
                                        <div className="icon">
                                            <i className="icofont-headphone-alt-1"></i>
                                        </div>
                                        <h3>Great Speakers</h3>
                                        <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
            
                                        <Link to="#" className="btn btn-primary">Read More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-box">
                            <div className="d-table">
                                <div className="d-table-cell">
                                    <div className="content">
                                        <div className="icon">
                                            <i className="icofont-network-tower"></i>
                                        </div>
                                        <h3>Networking</h3>
                                        <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
            
                                        <Link to="#" className="btn btn-primary">Read More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-box">
                            <div className="d-table">
                                <div className="d-table-cell">
                                    <div className="content">
                                        <div className="icon">
                                            <i className="icofont-users-social"></i>
                                        </div>
                                        <h3>New People</h3>
                                        <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
            
                                        <Link to="#" className="btn btn-primary">Read More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-box">
                            <div className="d-table">
                                <div className="d-table-cell">
                                    <div className="content">
                                        <div className="icon">
                                            <i className="icofont-wink-smile"></i>
                                        </div>
                                        <h3>Have Fun</h3>
                                        <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
            
                                        <Link to="#" className="btn btn-primary">Read More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className='slideshow'>
                    <li><span></span></li>
                    <li><span></span></li>
                    <li><span></span></li>
                    <li><span></span></li>
                </ul>
            </section>
        );
    }
}
 
export default WhyUs;