import React from 'react';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel3';

const options = {
    loop: true,
    nav: false,
    dots: true,
    margin: 30,
    autoplayHoverPause: true,
    autoplay: true,
    navText: [
        "<i class='icofont-rounded-left'></i>",
        "<i class='icofont-rounded-right'></i>"
    ],
    responsive:{
        0: {
            items:1,
        },
        768: {
            items:2,
        },
        1200: {
            items:3,
        }
    }
}
 
class LatestNews extends React.Component {
    render(){
        return (
            <section className="blog-area ptb-120 bg-image">
                <div className="container">
                    <div className="section-title">
                        <span>Info Update!</span>
                        <h2>Our Latest <b>News</b></h2>

                        <div className="bg-title lax" data-lax-preset="driftLeft">
                            Blog
                        </div>

                        <Link to="#" className="btn btn-primary">View All News</Link>

                        <div className="bar"></div>
                    </div>

                    <div className="row">
                        <OwlCarousel 
                            className="blog-slides owl-carousel owl-theme"
                            {...options}
                        >
                            <div className="col-lg-12 col-md-12">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog1.jpg")} alt="blog" /></Link>

                                        <div className="post-tag">
                                            <Link to="#">Technology</Link>
                                        </div>
                                    </div>

                                    <div className="blog-post-content">
                                        <span className="date">25 Feb, 2020</span>
                                        <h3><Link to="#">The Most Popular New top Business Apps</Link></h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                        <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog2.jpg")} alt="blog" /></Link>

                                        <div className="post-tag">
                                            <Link to="#">Agency</Link>
                                        </div>
                                    </div>

                                    <div className="blog-post-content">
                                        <span className="date">27 Feb, 2020</span>
                                        <h3><Link to="#">The Best Marketing top Management Tools</Link></h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                        <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog3.jpg")} alt="blog" /></Link>

                                        <div className="post-tag">
                                            <Link to="#">IT</Link>
                                        </div>
                                    </div>

                                    <div className="blog-post-content">
                                        <span className="date">28 Feb, 2020</span>
                                        <h3><Link to="#">3 WooCommerce Plugins to Boost Sales</Link></h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                        <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog4.jpg")} alt="blog" /></Link>

                                        <div className="post-tag">
                                            <Link to="#">IT</Link>
                                        </div>
                                    </div>

                                    <div className="blog-post-content">
                                        <span className="date">28 Feb, 2020</span>
                                        <h3><Link to="#">How To Setup Redux In React Next Application</Link></h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                        <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </OwlCarousel>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default LatestNews;