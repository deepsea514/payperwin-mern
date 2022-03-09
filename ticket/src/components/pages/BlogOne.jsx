import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Common/Footer';
 
class BlogOne extends React.Component {
    render(){
        return (
            <React.Fragment>
                <div className="page-title-area item-bg2">
                    <div className="container">
                        <h1>Blog</h1>
                        <span>Our Latest News</span>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li>Blog</li>
                        </ul>
                    </div>
                </div> 

                <section className="blog-area ptb-120 bg-image">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-6">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog1.jpg")} alt="blog" /></Link>

                                        <div className="post-tag">
                                            <Link to="#">Technology</Link>
                                        </div>
                                    </div>

                                    <div className="blog-post-content">
                                        <span className="date">25 Feb, 2020</span>
                                        <h3><Link to="#">How To Setup Redux In React Next Application</Link></h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                        <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog2.jpg")} alt="blog" /></Link>

                                        <div className="post-tag">
                                            <Link to="#">Agency</Link>
                                        </div>
                                    </div>

                                    <div className="blog-post-content">
                                        <span className="date">27 Feb, 2020</span>
                                        <h3><Link to="#">How To Resubmit Rejected Item Into ThemeForest</Link></h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                        <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog3.jpg")} alt="blog" /></Link>

                                        <div className="post-tag">
                                            <Link to="#">IT</Link>
                                        </div>
                                    </div>

                                    <div className="blog-post-content">
                                        <span className="date">28 Feb, 2020</span>
                                        <h3><Link to="#">Implementing Bootstrap Navwalker In WordPress</Link></h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                        <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog4.jpg")} alt="blog" /></Link>

                                        <div className="post-tag">
                                            <Link to="#">IT</Link>
                                        </div>
                                    </div>

                                    <div className="blog-post-content">
                                        <span className="date">28 Feb, 2020</span>
                                        <h3><Link to="#">How To The Active Menu Based On URL In Next.JS</Link></h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                        <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog5.jpg")} alt="blog" /></Link>

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

                            <div className="col-lg-4 col-md-6">
                                <div className="single-blog-post">
                                    <div className="blog-image">
                                        <Link to="#"><img src={require("../../assets/images/blog6.jpg")} alt="blog" /></Link>

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
                                <div className="pagination-area">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination justify-content-center">
                                            <li className="page-item">
                                                <Link className="page-link" to="#">
                                                    <i className="icofont-double-left"></i>
                                                </Link>
                                            </li>
                                            <li className="page-item">
                                                <Link className="page-link active" to="#">1</Link>
                                            </li>
                                            <li className="page-item">
                                                <Link className="page-link" to="#">2</Link>
                                            </li>
                                            <li className="page-item">
                                                <Link className="page-link" to="#">3</Link>
                                            </li>
                                            <li className="page-item">
                                                <Link className="page-link" to="#">
                                                    <i className="icofont-double-right"></i>
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default BlogOne;