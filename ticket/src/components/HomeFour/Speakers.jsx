import React from 'react';
import lax from 'lax.js';
import { Link } from 'react-router-dom';
import LaxDiv from '../Shared/LaxDiv';
 
class Speakers extends React.Component {

    constructor(props) {
        super(props)
        lax.setup()
    
        document.addEventListener('scroll', function(x) {
            lax.update(window.scrollY)
        }, false)
    
        lax.update(window.scrollY)
    }

    render(){
        return (
            <section className="speakers-area ptb-120 pb-0">
                <div className="container">
                    <div className="section-title">
                        <span>Listen to the Event Speakers</span>
                        <h2>Who's Speaking</h2>
                        <div className="bar"></div>
                        <LaxDiv text="Speakers" dataPreset="driftRight" />
                        <Link to="#" className="btn btn-primary">View More Speakers</Link>
                    </div>
                </div>

                <div className="row m-0">
                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-speakers">
                            <img src={require("../../assets/images/speakers1.jpg")} alt="Speaker" />

                            <div className="speakers-content">
                                <h3><Link to="#">James Anderson</Link></h3>
                                <span>Founder & CEO</span>
                            </div>
                            <ul>
                                <li><Link to="#" target="_blank" className="facebook"><i className="icofont-facebook"></i></Link></li>
                                <li><Link to="#" target="_blank" className="twitter"><i className="icofont-twitter"></i></Link></li>
                                <li><Link to="#" target="_blank" className="instagram"><i className="icofont-instagram"></i></Link></li>
                                <li><Link to="#" target="_blank" className="linkedin"><i className="icofont-linkedin"></i></Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-speakers">
                            <img src={require("../../assets/images/speakers2.jpg")} alt="Speaker" />

                            <div className="speakers-content">
                                <h3><Link to="#">Steven Smith</Link></h3>
                                <span>Lead Designer</span>
                            </div>
                            <ul>
                                <li><Link to="#" target="_blank" className="facebook"><i className="icofont-facebook"></i></Link></li>
                                <li><Link to="#" target="_blank" className="twitter"><i className="icofont-twitter"></i></Link></li>
                                <li><Link to="#" target="_blank" className="instagram"><i className="icofont-instagram"></i></Link></li>
                                <li><Link to="#" target="_blank" className="linkedin"><i className="icofont-linkedin"></i></Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-speakers">
                            <img src={require("../../assets/images/speakers3.jpg")} alt="Speaker" />

                            <div className="speakers-content">
                                <h3><Link to="#">Lucy Mandana</Link></h3>
                                <span>Developer Expert</span>
                            </div>
                            <ul>
                                <li><Link to="#" target="_blank" className="facebook"><i className="icofont-facebook"></i></Link></li>
                                <li><Link to="#" target="_blank" className="twitter"><i className="icofont-twitter"></i></Link></li>
                                <li><Link to="#" target="_blank" className="instagram"><i className="icofont-instagram"></i></Link></li>
                                <li><Link to="#" target="_blank" className="linkedin"><i className="icofont-linkedin"></i></Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-speakers">
                            <img src={require("../../assets/images/speakers4.jpg")} alt="Speaker" />

                            <div className="speakers-content">
                                <h3><Link to="#">David Warner</Link></h3>
                                <span>Senio Visual Designer</span>
                            </div>
                            <ul>
                                <li><Link to="#" target="_blank" className="facebook"><i className="icofont-facebook"></i></Link></li>
                                <li><Link to="#" target="_blank" className="twitter"><i className="icofont-twitter"></i></Link></li>
                                <li><Link to="#" target="_blank" className="instagram"><i className="icofont-instagram"></i></Link></li>
                                <li><Link to="#" target="_blank" className="linkedin"><i className="icofont-linkedin"></i></Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-speakers">
                            <img src={require("../../assets/images/speakers5.jpg")} alt="Speaker" />

                            <div className="speakers-content">
                                <h3><Link to="#">Alberta Amelia</Link></h3>
                                <span>Lead Designer</span>
                            </div>
                            <ul>
                                <li><Link to="#" target="_blank" className="facebook"><i className="icofont-facebook"></i></Link></li>
                                <li><Link to="#" target="_blank" className="twitter"><i className="icofont-twitter"></i></Link></li>
                                <li><Link to="#" target="_blank" className="instagram"><i className="icofont-instagram"></i></Link></li>
                                <li><Link to="#" target="_blank" className="linkedin"><i className="icofont-linkedin"></i></Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-speakers">
                            <img src={require("../../assets/images/speakers6.jpg")} alt="Speaker" />

                            <div className="speakers-content">
                                <h3><Link to="#">Abbie Edie</Link></h3>
                                <span>Lead Designer</span>
                            </div>
                            <ul>
                                <li><Link to="#" target="_blank" className="facebook"><i className="icofont-facebook"></i></Link></li>
                                <li><Link to="#" target="_blank" className="twitter"><i className="icofont-twitter"></i></Link></li>
                                <li><Link to="#" target="_blank" className="instagram"><i className="icofont-instagram"></i></Link></li>
                                <li><Link to="#" target="_blank" className="linkedin"><i className="icofont-linkedin"></i></Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-speakers">
                            <img src={require("../../assets/images/speakers7.jpg")} alt="Speaker" />

                            <div className="speakers-content">
                                <h3><Link to="#">Steven Garrad</Link></h3>
                                <span>Developer Expert</span>
                            </div>
                            <ul>
                                <li><Link to="#" target="_blank" className="facebook"><i className="icofont-facebook"></i></Link></li>
                                <li><Link to="#" target="_blank" className="twitter"><i className="icofont-twitter"></i></Link></li>
                                <li><Link to="#" target="_blank" className="instagram"><i className="icofont-instagram"></i></Link></li>
                                <li><Link to="#" target="_blank" className="linkedin"><i className="icofont-linkedin"></i></Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 p-0">
                        <div className="single-speakers">
                            <img src={require("../../assets/images/speakers8.jpg")} alt="Speaker" />

                            <div className="speakers-content">
                                <h3><Link to="#">David Wiley</Link></h3>
                                <span>Senio Visual Designer</span>
                            </div>
                            <ul>
                                <li><Link to="#" target="_blank" className="facebook"><i className="icofont-facebook"></i></Link></li>
                                <li><Link to="#" target="_blank" className="twitter"><i className="icofont-twitter"></i></Link></li>
                                <li><Link to="#" target="_blank" className="instagram"><i className="icofont-instagram"></i></Link></li>
                                <li><Link to="#" target="_blank" className="linkedin"><i className="icofont-linkedin"></i></Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default Speakers;