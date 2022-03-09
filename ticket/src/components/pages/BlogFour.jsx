import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Common/Footer';
 
class BlogFour extends React.Component {
    render(){
        return (
            <React.Fragment>
                <div className="page-title-area item-bg3">
                    <div className="container">
                        <h1>Blog</h1>
                        <span>Our Latest News</span>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li>Blog</li>
                        </ul>
                    </div>
                </div> 

                <section className="blog-area ptb-120">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-lg-12 col-md-6">
                                        <div className="single-blog-card">
                                            <Link to="#"><img src={require("../../assets/images/blog1.jpg")} alt="blog" /></Link>

                                            <div className="post-tag">
                                                <Link to="#">Technology</Link>
                                            </div>

                                            <div className="blog-post-content">
                                                <h3><Link to="#">How To Setup Redux In React Next Application</Link></h3>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                                <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-6">
                                        <div className="single-blog-card">
                                            <Link to="#"><img src={require("../../assets/images/blog2.jpg")} alt="blog" /></Link>

                                            <div className="post-tag">
                                                <Link to="#">Agency</Link>
                                            </div>

                                            <div className="blog-post-content">
                                                <h3><Link to="#">How To Resubmit Rejected Item Into ThemeForest</Link></h3>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                                <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-12 col-md-6">
                                        <div className="single-blog-card">
                                            <Link to="#"><img src={require("../../assets/images/blog1.jpg")} alt="blog" /></Link>

                                            <div className="post-tag">
                                                <Link to="#">Technology</Link>
                                            </div>

                                            <div className="blog-post-content">
                                                <h3><Link to="#">How To The Active Menu Based On URL In Next.JS</Link></h3>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                                <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-6">
                                        <div className="single-blog-card">
                                            <Link to="#"><img src={require("../../assets/images/blog2.jpg")} alt="blog" /></Link>

                                            <div className="post-tag">
                                                <Link to="#">Agency</Link>
                                            </div>

                                            <div className="blog-post-content">
                                                <h3><Link to="#">Implementing Bootstrap Navwalker In WordPress</Link></h3>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                                <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-12 col-md-6">
                                        <div className="single-blog-card">
                                            <Link to="#"><img src={require("../../assets/images/blog1.jpg")} alt="blog" /></Link>

                                            <div className="post-tag">
                                                <Link to="#">Technology</Link>
                                            </div>

                                            <div className="blog-post-content">
                                                <h3><Link to="#">Top 10 Best CSS Frameworks For Front-End Develope</Link></h3>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum.</p>
                                                <Link to="#" className="read-more-btn">Read More <i className="icofont-double-right"></i></Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-6">
                                        <div className="single-blog-card">
                                            <Link to="#"><img src={require("../../assets/images/blog2.jpg")} alt="blog" /></Link>

                                            <div className="post-tag">
                                                <Link to="#">Agency</Link>
                                            </div>

                                            <div className="blog-post-content">
                                                <h3><Link to="#">Top 10 Best CSS Frameworks For Front-End Develope</Link></h3>
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
                                                    <li className="page-item"><Link className="page-link active" to="#">1</Link></li>
                                                    <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                                    <li className="page-item"><Link className="page-link" to="#">3</Link></li>
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

                            <div className="col-lg-4">
                                <div className="sidebar">
                                    <div className="widget widget_search">
                                        <form>
                                            <input type="text" className="form-control" placeholder="Search here..." />
                                            <button type="submit"><i className="icofont-search"></i></button>
                                        </form>
                                    </div>
                                    
                                    <div className="widget widget_categories">
                                        <h3 className="widget-title">
                                            Categories
                                        </h3>

                                        <ul>
                                            <li><Link to="#">AJAX</Link></li>
                                            <li><Link to="#">Apache</Link></li>
                                            <li><Link to="#">CSS</Link></li>
                                            <li><Link to="#">PHP</Link></li>
                                            <li><Link to="#">Django</Link></li>
                                            <li><Link to="#">Error</Link></li>
                                            <li><Link to="#">IIS</Link></li>
                                            <li><Link to="#">JavaScript</Link></li>
                                        </ul>
                                    </div>
                                    
                                    <div className="widget widget_recent_entries">
                                        <h3 className="widget-title">
                                            Recent Posts
                                        </h3>

                                        <ul>
                                            <li>
                                                <Link to="#">
                                                    <img src={require("../../assets/images/blog1.jpg")} alt="blog" />
                                                </Link>

                                                <h5><Link to="#">The Most Popular New top Business Apps</Link></h5>
                                                <p className="date">21 March, 2020</p>
                                            </li>

                                            <li>
                                                <Link to="#">
                                                    <img src={require("../../assets/images/blog2.jpg")} alt="blog" />
                                                </Link>

                                                <h5><Link to="#">3 WooCommerce Plugins to Boost Sales</Link></h5>
                                                <p className="date">20 March, 2020</p>
                                            </li>

                                            <li>
                                                <Link to="#">
                                                    <img src={require("../../assets/images/blog3.jpg")} alt="blog" />
                                                </Link>

                                                <h5><Link to="#">The Best Marketing top Management Tools</Link></h5>
                                                <p className="date">27 March, 2020</p>
                                            </li>

                                            <li>
                                                <Link to="#">
                                                    <img src={require("../../assets/images/blog4.jpg")} alt="blog" />
                                                </Link>

                                                <h5><Link to="#">How to Build Link Business Dashboard</Link></h5>
                                                <p className="date">27 January, 2020</p>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div className="widget widget_tag_cloud">
                                        <h3 className="widget-title">
                                            Tags
                                        </h3>

                                        <div className="tagcloud">
                                            <Link to="#">Error</Link>
                                            <Link to="#">Cake Bake</Link>
                                            <Link to="#">Dromzone</Link>
                                            <Link to="#">File</Link>
                                            <Link to="#">Yii</Link>
                                            <Link to="#">Yii2</Link>
                                            <Link to="#">UUID</Link>
                                            <Link to="#">Setup</Link>
                                            <Link to="#">Error</Link>
                                            <Link to="#">Cake Bake</Link>
                                            <Link to="#">Dromzone</Link>
                                            <Link to="#">File</Link>
                                            <Link to="#">Yii</Link>
                                            <Link to="#">Yii2</Link>
                                            <Link to="#">UUID</Link>
                                            <Link to="#">Setup</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="widget widget_archive">
                                        <h3 className="widget-title">
                                            Archives
                                        </h3>

                                        <ul>
                                            <li><Link to="#">December 2018</Link></li>
                                            <li><Link to="#">January 2020</Link></li>
                                            <li><Link to="#">February 2020</Link></li>
                                            <li><Link to="#">March 2020</Link></li>
                                        </ul>
                                    </div>
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
 
export default BlogFour;