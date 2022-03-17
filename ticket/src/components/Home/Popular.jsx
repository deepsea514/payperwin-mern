import React from 'react';
import { Link } from 'react-router-dom';
import LaxDiv from '../Shared/LaxDiv';

class Popular extends React.Component {
    render() {
        return (
            <>
                <section className="speakers-area ptb-120 pb-0">
                    <div className="container">
                        <div className="section-title">
                            <h2>Popular Categories</h2>
                            <div className="bar"></div>
                            <LaxDiv text="Categories" dataPreset="driftRight" />
                            <Link to="#" className="btn btn-primary">Explore More Categories</Link>
                        </div>
                    </div>
                </section>
                <section className="why-choose-us">
                    <div className="row m-0">
                        <div className="col-lg-3 col-sm-6 p-0">
                            <div className="single-box">
                                <div className="content">
                                    <div className="icon">
                                        <i className="icofont-football-american"></i>
                                    </div>
                                    <h3>Sports</h3>
                                    <Link to="/categories/sports" className="btn btn-primary">Explore</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 p-0">
                            <div className="single-box">
                                <div className="content">
                                    <div className="icon">
                                        <i className="icofont-ui-music"></i>
                                    </div>
                                    <h3>Concerts</h3>
                                    <Link to="/categories/concerts" className="btn btn-primary">Explore</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-sm-6 p-0">
                            <div className="single-box">
                                <div className="content">
                                    <div className="icon">
                                        <i className="icofont-music-notes"></i>
                                    </div>
                                    <h3>Theatre</h3>
                                    <Link to="/categories/theatre" className="btn btn-primary">Explore</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-sm-6 p-0">
                            <div className="single-box">
                                <div className="content">
                                    <div className="icon">
                                        <i className="icofont-thunder-light"></i>
                                    </div>
                                    <h3>Special Events</h3>
                                    <Link to="/categories/special-events" className="btn btn-primary">Explore</Link>
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
            </>
        );
    }
}

export default Popular;