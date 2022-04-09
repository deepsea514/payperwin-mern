import React from 'react';
import { Link } from 'react-router-dom';
import LaxDiv from '../Shared/LaxDiv';

class TopPlaces extends React.Component {
    render() {
        return (
            <section className="top-places-area ptb-120 pb-0">
                <div className="container">
                    <div className="section-title">
                        <span>Browse Popular Location</span>
                        <h2>MOST VISITED PLACES</h2>
                        <div className="bar"></div>
                        <LaxDiv text="POPULAR PLACES" dataPreset="driftRight" />
                        <Link to="/places" className="btn btn-primary">View More Places</Link>
                    </div>
                </div>

                <div className="row m-0">
                    <div className="col-md-6 px-2 pe-md-1">
                        <Link className="top-places place-vancouver" to="/places/ca/british-columbia/vancouver">
                            <div className="speakers-content">
                                <h3>Vancouver</h3>
                            </div>
                        </Link>
                    </div>
                    <div className='col-md-6 row px-2 mt-2 mx-0 mt-md-0 ps-md-1'>
                        <div className="col-12 px-0">
                            <Link className="top-places place-toronto" to="/places/ca/ontario/toronto">
                                <div className="speakers-content">
                                    <h3>Toronto</h3>
                                </div>
                            </Link>
                        </div>

                        <div className='col-12 row m-0 p-0 mt-2'>
                            <div className="col-sm-6 p-0 pe-sm-1">
                                <Link className="top-places place-montreal" to="/places/ca/quebec/montreal">
                                    <div className="speakers-content">
                                        <h3>Montreal</h3>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-sm-6 mt-2 mt-sm-0 p-0 ps-sm-1">
                                <Link className="top-places place-calgary" to="/places/ca/alberta/calgary">
                                    <div className="speakers-content">
                                        <h3>Calgary</h3>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default TopPlaces;