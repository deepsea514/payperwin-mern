import React from 'react';
import { Link } from 'react-router-dom';
import lax from 'lax.js';
import LaxDiv from '../Shared/LaxDiv';
 
class LatesNews extends React.Component {
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
            <section className="blog-area blog-section ptb-120 bg-image">
                <div className="container">
                    <div className="section-title">
                        <span>Info Update!</span>
                        <h2>Our Latest <b>News</b></h2>

                        <LaxDiv text="Blog" dataPreset="driftLeft" />

                        <Link to="#" className="btn btn-primary">View All News</Link>

                        <div className="bar"></div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="single-blog-card">
                                <Link to="#">
                                    <img src={require("../../assets/images/blog1.jpg")} alt="blog" />
                                </Link>

                                <div className="post-tag">
                                    <Link to="#">Technology</Link>
                                </div>

                                <div className="blog-post-content">
                                    <h3>
                                        <Link to="#">How To Setup Redux In React Next Application</Link>
                                    </h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                    <Link to="#" className="read-more-btn">
                                        Read More 
                                        <i className="icofont-double-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                            <div className="single-blog-card">
                                <Link to="#">
                                    <img src={require("../../assets/images/blog2.jpg")} alt="blog" />
                                </Link>

                                <div className="post-tag">
                                    <Link to="#">Agency</Link>
                                </div>

                                <div className="blog-post-content">
                                    <h3>
                                        <Link to="#">How To Resubmit Rejected Item Into ThemeForest</Link>
                                    </h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                    <Link to="#" className="read-more-btn">
                                        Read More 
                                        <i className="icofont-double-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default LatesNews;