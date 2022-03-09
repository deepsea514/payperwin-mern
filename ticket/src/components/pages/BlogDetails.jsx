import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Common/Footer';
 
class BlogDetails extends React.Component {
    render(){
        return (
            <React.Fragment>
                <div className="page-title-area item-bg1">
                    <div className="container">
                        <h1>Blog Details</h1>
                        <span>Our Latest News</span>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li>Blog Details</li>
                        </ul>
                    </div>
                </div>

                <section className="blog-details-area ptb-120">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="blog-details">
                                    <div className="post-image">
                                        <img src={require("../../assets/images/blog1.jpg")} alt="blog" />
                                    </div>

                                    <h3>The Most Popular New top Business Apps</h3>

                                    <div className="blog-meta">
                                        <ul>
                                            <li><i className="icofont-ui-user"></i> <Link to="#">Admin</Link></li>
                                            <li><i className="icofont-clock-time"></i> June 20, 2020</li>
                                            <li><i className="icofont-comment"></i> <Link to="#">6 Comments</Link></li>
                                            <li><i className="icofont-ui-folder"></i> <Link to="#">Event</Link></li>
                                        </ul>
                                    </div>
                                    
                                    <p>There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in that some form by injected humour or randomised words which don’t look even slightly believable. If you are going to use Link passage of Lorem Ipsum you need to be sure there isn’t anything of embarrassing. There are many that an variations of passages of Lorem Ipsum available but the majority have suffered alteration in that some form by Link injected humour or randomised words which don’t look even of slightly believable. If you are going to use Link the passage of Lorem Ipsum you need to be sure there isn’t anything embarrassing.</p>

                                    <blockquote className="blockquote">
                                        <p>There are many variations of passages of Lorem the Ipsum available but the that as that majority have is suffered alteration.</p>
                                    </blockquote>

                                    <p>There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in that some form by injected humour or randomised words which don’t look even slightly believable. If you are going to use Link passage of Lorem Ipsum you need to be sure there isn’t anything of embarrassing.</p>

                                    <p>There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in that some form by injected humour or randomised words which don’t look even slightly believable. If you are going to use Link passage of Lorem Ipsum you need to be sure there isn’t anything of embarrassing.</p>

                                    <p>Randomised words which don’t look even slightly believable. If you are going Link to use Link passage you need to be sure there isn’t anything embarrassing. Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                </div>
                                
                                <div className="post-tag-media">
                                    <div className="row h-100 align-items-center">
                                        <div className="col-lg-6">
                                            <ul className="tag">
                                                <li><span>Tags:</span></li>
                                                <li><Link to="#">Event,</Link></li>
                                                <li><Link to="#">App,</Link></li>
                                                <li><Link to="#">Software</Link></li>
                                            </ul>
                                        </div>

                                        <div className="col-lg-6">
                                            <ul className="social-share">
                                                <li><span>Share on:</span></li>
                                                <li><Link to="#"><i className="icofont-facebook"></i></Link></li>
                                                <li><Link to="#"><i className="icofont-twitter"></i></Link></li>
                                                <li><Link to="#"><i className="icofont-instagram"></i></Link></li>
                                                <li><Link to="#"><i className="icofont-linkedin"></i></Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div id="comments" className="comments-area">
                                    <h2 className="comments-title">3 Comments</h2>

                                    <ol className="comment-list">
                                        <li className="comment">
                                            <article className="comment-body">
                                                <footer className="comment-meta">
                                                    <div className="comment-author vcard">
                                                        <img src={require("../../assets/images/author1.jpg")} className="avatar" alt="blog" />
                                                        <b className="fn">John Smith</b>
                                                        <span className="says">says:</span>
                                                    </div>

                                                    <div className="comment-metadata">
                                                        <Link to="#">
                                                            March 28, 2020 at 7:16 am
                                                        </Link>
                                                    </div>
                                                </footer>

                                                <div className="comment-content">
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat Link ante. It is Link long established fact that Link reader will be distracted by the readable content of Link page when looking at its layout.</p>
                                                </div>

                                                <div className="reply">
                                                    <Link to="#" rel="nofollow" className="comment-reply-link">Reply</Link>
                                                </div>
                                            </article>

                                            <ol className="children">
                                                <li className="comment">
                                                    <article className="comment-body">
                                                        <footer className="comment-meta">
                                                            <div className="comment-author vcard">
                                                                <img src={require("../../assets/images/author2.jpg")} className="avatar" alt="blog" />
                                                                <b className="fn">Steven Warner</b>
                                                                <span className="says">says:</span>
                                                            </div>

                                                            <div className="comment-metadata">
                                                                <Link to="#">
                                                                    March 28, 2020 at 7:16 am
                                                                </Link>
                                                            </div>
                                                        </footer>

                                                        <div className="comment-content">
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat Link ante. It is Link long established fact that Link reader will be distracted by the readable content of Link page when looking at its layout.</p>
                                                        </div>

                                                        <div className="reply">
                                                            <Link to="#" rel="nofollow" className="comment-reply-link">Reply</Link>
                                                        </div>
                                                    </article>
                                                </li>
                                            </ol>
                                        </li>

                                        <li className="comment">
                                            <article className="comment-body">
                                                <footer className="comment-meta">
                                                    <div className="comment-author vcard">
                                                        <img src={require("../../assets/images/author3.jpg")} className="avatar" alt="blog" />
                                                        <b className="fn">John Smith</b>
                                                        <span className="says">says:</span>
                                                    </div>

                                                    <div className="comment-metadata">
                                                        <Link to="#">
                                                            March 28, 2020 at 7:16 am
                                                        </Link>
                                                    </div>
                                                </footer>

                                                <div className="comment-content">
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat Link ante. It is Link long established fact that Link reader will be distracted by the readable content of Link page when looking at its layout.</p>
                                                </div>

                                                <div className="reply">
                                                    <Link to="#" rel="nofollow" className="comment-reply-link">Reply</Link>
                                                </div>
                                            </article>
                                        </li>
                                    </ol>

                                    <div id="respond" className="comment-respond">
                                        <h3 className="comment-reply-title">Leave A Comment</h3>

                                        <form id="commentform" className="comment-form">
                                            <p className="comment-notes">Your email address will not be published.</p>
                                            
                                            <p className="comment-form-comment">
                                                <textarea id="comment" placeholder="Comment" cols="45" rows="4" />
                                            </p>
                                            <p className="comment-form-author">
                                                <input id="author" placeholder="Name" type="text" />
                                            </p>
                                            <p className="comment-form-email">
                                                <input id="email" placeholder="Email"  type="text" />
                                            </p>
                                            <p className="comment-form-url">
                                                <input id="url" placeholder="Website" type="text" />
                                            </p>
                                            <p className="form-submit">
                                                <input name="submit" type="submit" id="submit" className="submit" value="Post A Comment" />
                                            </p>
                                        </form>
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
 
export default BlogDetails;