import React from 'react';
import { Link } from 'react-router-dom';
import lax from 'lax.js';
import LaxDiv from '../Shared/LaxDiv';
 
class EventSchedules extends React.Component {

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
            <section className="schedule-area schedule-style-three bg-image ptb-120">
                <div className="container">
                    <div className="section-title">
                        <span>Schedule Plan</span>
                        <h2>Information of <b>Event</b> <br /> Schedules</h2>
                        <LaxDiv text="Events" dataPreset="driftLeft" />
                        <Link to="#" className="btn btn-primary">Buy Tickets Now!</Link>

                        <div className="bar"></div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="single-schedule-item">
                                <div className="schedule-date">
                                    Day - 01

                                    <span>4 April 2020</span>
                                </div>

                                <div className="schedule-item-wrapper">
                                    <div className="schedule-content">
                                        <div className="author">
                                            <img 
                                                src={require("../../assets/images/author1.jpg")}
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Smith" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3><Link to="#">Digital Marketing Theory</Link></h3>

                                            <ul>
                                                <li>
                                                    <i className="icofont-user-suited"></i> 
                                                    By <Link to="#">Riley</Link> CEO of EnvyTheme
                                                </li>
                                                <li>
                                                    <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="schedule-content">
                                        <div className="author author-multi">
                                            <img 
                                                src={require("../../assets/images/author5.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Lucy" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author2.jpg")}
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Jonaton Smith" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author3.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="John Smith" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author4.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="John Doe" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3>
                                                <Link to="#">Digital World Event Information</Link>
                                            </h3>

                                            <ul>
                                                <li>
                                                    <i className="icofont-user-suited"></i> 
                                                    By <Link to="#">Gilbert</Link> CEO of EnvyTheme
                                                </li>
                                                <li>
                                                    <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="schedule-content">
                                        <div className="author author-multi">
                                            <img 
                                                src={require("../../assets/images/author8.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Lucy" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author9.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Jonaton Smith" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3>
                                                <Link to="#">Digital Marketing Theory</Link>
                                            </h3>

                                            <ul>
                                                <li>
                                                    <i className="icofont-user-suited"></i> 
                                                    By <Link to="#">Brian</Link> CEO of EnvyTheme
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

                        <div className="col-lg-6">
                            <div className="single-schedule-item">
                                <div className="schedule-date">
                                    Day - 02

                                    <span>5 April 2020</span>
                                </div>

                                <div className="schedule-item-wrapper">
                                    <div className="schedule-content">
                                        <div className="author">
                                            <img 
                                                src={require("../../assets/images/author1.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Smith" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3>
                                                <Link to="#">Digital Marketing Theory</Link>
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

                                    <div className="schedule-content">
                                        <div className="author author-multi">
                                            <img 
                                                src={require("../../assets/images/author5.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Lucy" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author2.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Jonaton Smith"
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author3.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="John Smith" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author4.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="John Doe" 
                                                alt="Schedules" 
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

                                    <div className="schedule-content">
                                        <div className="author author-multi">
                                            <img 
                                                src={require("../../assets/images/author8.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Lucy" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author9.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Jonaton Smith" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3><Link to="#">Digital Marketing Theory</Link></h3>

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
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="single-schedule-item">
                                <div className="schedule-date">
                                    Day - 03

                                    <span>6 April 2020</span>
                                </div>

                                <div className="schedule-item-wrapper">
                                    <div className="schedule-content">
                                        <div className="author">
                                            <img 
                                                src={require("../../assets/images/author1.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Smith" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3>
                                                <Link to="#">Digital Marketing Theory</Link>
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

                                    <div className="schedule-content">
                                        <div className="author author-multi">
                                            <img 
                                                src={require("../../assets/images/author5.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Lucy" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author2.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Jonaton Smith" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author3.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="John Smith" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author4.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="John Doe" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3>
                                                <Link to="#">Digital World Event Information</Link>
                                            </h3>

                                            <ul>
                                                <li>
                                                    <i className="icofont-user-suited"></i> 
                                                    By <Link to="#">Ethan</Link> CEO of EnvyTheme
                                                </li>
                                                <li>
                                                    <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="schedule-content">
                                        <div className="author author-multi">
                                            <img 
                                                src={require("../../assets/images/author8.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Lucy" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author9.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Jonaton Smith" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3>
                                                <Link to="#">Digital Marketing Theory</Link>
                                            </h3>

                                            <ul>
                                                <li>
                                                    <i className="icofont-user-suited"></i> 
                                                    By <Link to="#">Lewis</Link> CEO of EnvyTheme
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

                        <div className="col-lg-6">
                            <div className="single-schedule-item">
                                <div className="schedule-date">
                                    Day - 04

                                    <span>7 April 2020</span>
                                </div>

                                <div className="schedule-item-wrapper">
                                    <div className="schedule-content">
                                        <div className="author">
                                            <img 
                                                src={require("../../assets/images/author1.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Smith" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3>
                                                <Link to="#">Digital Marketing Theory</Link>
                                            </h3>

                                            <ul>
                                                <li>
                                                    <i className="icofont-user-suited"></i> 
                                                    By <Link to="#">Milton</Link> CEO of EnvyTheme
                                                </li>
                                                <li>
                                                    <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="schedule-content">
                                        <div className="author author-multi">
                                            <img 
                                                src={require("../../assets/images/author5.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Lucy" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author2.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Jonaton Smith" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author3.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="John Smith" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author4.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="John Doe" 
                                                alt="Schedules" 
                                            />
                                        </div>
                                        
                                        <div className="schedule-info">
                                            <h3>
                                                <Link to="#">Digital World Event Information</Link>
                                            </h3>

                                            <ul>
                                                <li>
                                                    <i className="icofont-user-suited"></i> 
                                                    By <Link to="#">Claude</Link> CEO of EnvyTheme
                                                </li>
                                                <li>
                                                    <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="schedule-content">
                                        <div className="author author-multi">
                                            <img 
                                                src={require("../../assets/images/author8.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Steven Lucy" 
                                                alt="Schedules" 
                                            />
                                            <img 
                                                src={require("../../assets/images/author9.jpg")} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Jonaton Smith" 
                                                alt="Schedules" 
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
 
export default EventSchedules;