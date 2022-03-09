import React from 'react';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel3';

const options = {
    loop: true,
    nav: true,
    dots: false,
    autoplayHoverPause: true,
    autoplay: true,
    items: 1,
    navText: [
        "<i class='icofont-rounded-left'></i>",
        "<i class='icofont-rounded-right'></i>"
    ],
}
 
class EventSchedulesTwo extends React.Component {
    render(){
        return (
            <section className="schedule-area bg-image ptb-120">
                <div className="container">
                    <div className="row">
                        <OwlCarousel 
                            className="schedule-slides owl-carousel owl-theme"
                            {...options}
                        >
                            <div className="col-lg-12 col-md-12">
                                <div className="schedule-slides-item">
                                    <div className="single-schedule">
                                        <div className="schedule-date">
                                            <div className="d-table">
                                                <div className="d-table-cell">
                                                    Day - 01

                                                    <span>4 April 2020</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="schedule-content">
                                            <div className="author">
                                                <img 
                                                    src={require("../../assets/images/author1.jpg")}
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Steven Smith" 
                                                    alt="schedule" 
                                                />
                                            </div>
                                            
                                            <div className="schedule-info">
                                                <h3>
                                                    <Link to="#">Digital Marketing Theory</Link>
                                                </h3>

                                                <ul>
                                                    <li>
                                                        <i className="icofont-user-suited"></i> By <Link to="#">Riley</Link> CEO of EnvyTheme
                                                    </li>
                                                    <li>
                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-schedule">
                                        <div className="schedule-date">
                                            <div className="d-table">
                                                <div className="d-table-cell">
                                                    Day - 01

                                                    <span>4 April 2020</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="schedule-content">
                                            <div className="author author-multi">
                                                <img 
                                                    src={require("../../assets/images/author5.jpg")}
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Steven Lucy" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author2.jpg")}
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Jonaton Smith" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author3.jpg")}
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="John Smith" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author4.jpg")}
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="John Doe" 
                                                    alt="schedule" 
                                                />
                                            </div>
                                            
                                            <div className="schedule-info">
                                                <h3><Link to="#">Digital World Event Information</Link></h3>

                                                <ul>
                                                    <li><i className="icofont-user-suited"></i> By <Link to="#">Gilbert</Link> CEO of EnvyTheme</li>
                                                    <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-schedule">
                                        <div className="schedule-date">
                                            <div className="d-table">
                                                <div className="d-table-cell">
                                                    Day - 01

                                                    <span>4 April 2020</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="schedule-content">
                                            <div className="author author-multi">
                                                <img 
                                                    src={require("../../assets/images/author6.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Steven Lucy" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author7.jpg")}
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Jonaton Smith" 
                                                    alt="schedule" 
                                                />
                                            </div>
                                            
                                            <div className="schedule-info">
                                                <h3>
                                                    <Link to="#">HTML, CSS and Bootstrap Introduction</Link>
                                                </h3>

                                                <ul>
                                                    <li>
                                                        <i className="icofont-user-suited"></i> 
                                                        By <Link to="#">Roberto</Link> CEO of EnvyTheme
                                                    </li>
                                                    <li>
                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-schedule">
                                        <div className="schedule-date">
                                            <div className="d-table">
                                                <div className="d-table-cell">
                                                    Day - 01

                                                    <span>4 April 2020</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="schedule-content">
                                            <div className="author author-multi">
                                                <img 
                                                    src={require("../../assets/images/author8.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Steven Lucy" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author9.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Jonaton Smith" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author3.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="John Smith" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author4.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="John Doe" 
                                                    alt="schedule" 
                                                />
                                            </div>
                                            
                                            <div className="schedule-info">
                                                <h3>
                                                    <Link to="#">Digital World Event Information</Link>
                                                </h3>

                                                <ul>
                                                    <li>
                                                        <i className="icofont-user-suited"></i> 
                                                        By <Link to="#">Ramon</Link> CEO of EnvyTheme
                                                    </li>
                                                    <li>
                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="schedule-slides-item">
                                    <div className="single-schedule">
                                        <div className="schedule-date">
                                            <div className="d-table">
                                                <div className="d-table-cell">
                                                    Day - 02

                                                    <span>5 April 2020</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="schedule-content">
                                            <div className="author">
                                                <img 
                                                    src={require("../../assets/images/author1.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Steven Smith" 
                                                    alt="schedule" 
                                                />
                                            </div>
                                            
                                            <div className="schedule-info">
                                                <h3>
                                                    <Link to="#">Digital Marketing Theory</Link>
                                                </h3>

                                                <ul>
                                                    <li>
                                                        <i className="icofont-user-suited"></i> 
                                                        By <Link to="#">Miles</Link> CEO of EnvyTheme
                                                    </li>
                                                    <li>
                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-schedule">
                                        <div className="schedule-date">
                                            <div className="d-table">
                                                <div className="d-table-cell">
                                                    Day - 02

                                                    <span>5 April 2020</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="schedule-content">
                                            <div className="author author-multi">
                                                <img 
                                                    src={require("../../assets/images/author5.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Steven Lucy" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author2.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Jonaton Smith" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author3.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="John Smith" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author4.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="John Doe" 
                                                    alt="schedule" 
                                                />
                                            </div>
                                            
                                            <div className="schedule-info">
                                                <h3>
                                                    <Link to="#">Digital World Event Information</Link>
                                                </h3>

                                                <ul>
                                                    <li>
                                                        <i className="icofont-user-suited"></i> 
                                                        By <Link to="#">Nathaniel</Link> CEO of EnvyTheme
                                                    </li>
                                                    <li>
                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-schedule">
                                        <div className="schedule-date">
                                            <div className="d-table">
                                                <div className="d-table-cell">
                                                    Day - 02

                                                    <span>5 April 2020</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="schedule-content">
                                            <div className="author author-multi">
                                                <img 
                                                    src={require("../../assets/images/author6.jpg")} 
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Steven Lucy" 
                                                    alt="schedule" 
                                                />
                                                <img 
                                                    src={require("../../assets/images/author7.jpg")}
                                                    data-toggle="tooltip" 
                                                    data-placement="top" 
                                                    title="Jonaton Smith" 
                                                    alt="schedule" 
                                                />
                                            </div>
                                            
                                            <div className="schedule-info">
                                                <h3>
                                                    <Link to="#">
                                                        HTML, CSS and Bootstrap Introduction
                                                    </Link>
                                                </h3>

                                                <ul>
                                                    <li>
                                                        <i className="icofont-user-suited"></i> 
                                                        By 
                                                        <Link to="#">Ethan</Link> 
                                                        CEO of EnvyTheme
                                                    </li>
                                                    <li>
                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-schedule">
                                        <div className="schedule-date">
                                            <div className="d-table">
                                                <div className="d-table-cell">
                                                    Day - 02

                                                    <span>5 April 2020</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="schedule-content">
                                            <div className="author author-multi">
                                                <img src={require("../../assets/images/author8.jpg")} data-toggle="tooltip" data-placement="top" title="Steven Lucy" alt="schedule" />
                                                <img src={require("../../assets/images/author9.jpg")} data-toggle="tooltip" data-placement="top" title="Jonaton Smith" alt="schedule" />
                                                <img src={require("../../assets/images/author3.jpg")} data-toggle="tooltip" data-placement="top" title="John Smith" alt="schedule" />
                                                <img src={require("../../assets/images/author4.jpg")} data-toggle="tooltip" data-placement="top" title="John Doe" alt="schedule" />
                                            </div>
                                            
                                            <div className="schedule-info">
                                                <h3><Link to="#">Digital World Event Information</Link></h3>

                                                <ul>
                                                    <li><i className="icofont-user-suited"></i> By <Link to="#">Lewis</Link> CEO of EnvyTheme</li>
                                                    <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </OwlCarousel>

                        <div className="col-lg-12">
                            <div className="btn-box">
                                <Link to="#" className="btn btn-primary">
                                    Download Schedule (PDF)
                                </Link>
                                <Link to="#" className="btn btn-secondary">
                                    Connect Via Instagram
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shape1">
                    <img src={require("../../assets/images/shapes/1.png")} alt="shape1" />
                </div>
                <div className="shape2 rotateme">
                    <img src={require("../../assets/images/shapes/2.png")} alt="shape2" />
                </div>
                <div className="shape3 rotateme">
                    <img src={require("../../assets/images/shapes/3.png")} alt="shape3" />
                </div>
                <div className="shape4">
                    <img src={require("../../assets/images/shapes/4.png")} alt="shape4" />
                </div>
            </section>
        );
    }
}
 
export default EventSchedulesTwo;