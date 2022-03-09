import React from 'react';
import LaxButton from '../Shared/LaxButton';
 
class About extends React.Component {
    render(){
        return (
            <section className="about-area-three ptb-120 bg-image">
                <div className="container">
                    <div className="row h-100 align-items-center">
                        <div className="col-lg-6">
                            <div className="about-image">
                                <img 
                                    src={require("../../assets/images/about4.jpg")}
                                    className="about-img1" 
                                    alt="about" 
                                />
                                
                                <LaxButton />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="about-content">
                                <span>Join The Event</span>
                                <h2>We Create and <b>Turn</b> Into Reality</h2>
                                <h6>We Work With Organisations To Craft Immersive Customer Experiences.</h6>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                
                                <ul>
                                    <li>
                                        <i className="icofont-long-arrow-right"></i> 
                                        Curabitur blandit tempus porttitor.
                                    </li>
                                    <li>
                                        <i className="icofont-long-arrow-right"></i> 
                                        Maecenas sed diam eget risus varius blandit sit amet non magna.
                                    </li>
                                    <li>
                                        <i className="icofont-long-arrow-right"></i> 
                                        Fusce dapibus, tellus ac cursus commodo, tortor mauris.
                                    </li>
                                    <li>
                                        <i className="icofont-long-arrow-right"></i> 
                                        Condimentum nibh, ut fermentum massa justo sit amet risus nibh.
                                    </li>
                                </ul>

                                <div className="signature">
                                    <img src={require("../../assets/images/signature.png")} alt="about" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default About;