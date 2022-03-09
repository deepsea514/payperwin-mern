import React from 'react';
import lax from 'lax.js';
import LaxButton from '../Shared/LaxButton';
 
class About extends React.Component {

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
            <section className="about-area-two ptb-120 bg-image">
                <div className="container">
                    <div className="row h-100 align-items-center">
                        <div className="col-lg-6">
                            <div className="about-content">
                                <span>Join The Event</span>
                                <h2>We Create and <b>Turn</b> Into Reality</h2>

                                <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>

                                <div className="signature">
                                    <img src={require("../../assets/images/signature.png")} alt="about" />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="about-image">
                                <img src={require("../../assets/images/about3.jpg")} className="about-img1" alt="about" />

                                <LaxButton />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default About;