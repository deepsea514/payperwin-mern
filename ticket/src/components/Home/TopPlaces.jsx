import React from 'react';
import lax from 'lax.js';
import { Link } from 'react-router-dom';
import LaxDiv from '../Shared/LaxDiv';

class TopPlaces extends React.Component {

    constructor(props) {
        super(props)
        lax.setup()

        document.addEventListener('scroll', function (x) {
            lax.update(window.scrollY)
        }, false)

        lax.update(window.scrollY)
    }

    render() {
        return (
            <section className="speakers-area ptb-120 pb-0">
                <div className="container">
                    <div className="section-title">
                        <span>Browse Popular Location</span>
                        <h2>MOST VISITED PLACES</h2>
                        <div className="bar"></div>
                        <LaxDiv text="POPULAR PLACES" dataPreset="driftRight" />
                        <Link to="#" className="btn btn-primary">View More Places</Link>
                    </div>
                </div>

                <div className="row m-0">
                    <div className="col-md-6 pe-0">
                        <div className="top-places">
                            <img src="/images/places/vancouver.jpeg" alt="Speaker" />

                            <div className="speakers-content">
                                <h3><Link to="#">Vancouver</Link></h3>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 p-0 m-0 row'>
                        <div className="col-12">
                            <div className="top-places">
                                <img src="/images/places/toronto.jpeg" alt="Speaker" />

                                <div className="speakers-content">
                                    <h3><Link to="#">Toronto</Link></h3>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 row m-0 p-0 mt-3'>
                            <div className="col-sm-6 pe-2">
                                <div className="top-places">
                                    <img src="/images/places/montreal.jpeg" alt="Speaker" />

                                    <div className="speakers-content">
                                        <h3><Link to="#">Montreal</Link></h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 ps-2">
                                <div className="top-places">
                                    <img src="/images/places/calgary.jpeg" alt="Speaker" />

                                    <div className="speakers-content">
                                        <h3><Link to="#">Calgary</Link></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default TopPlaces;