import React from 'react';
import { Link } from 'react-router-dom';
 
class EventSchedules extends React.Component {

    openTabSection = (evt, tabNmae) => {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabs_item");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByTagName("li");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace("current", "");
        }

        document.getElementById(tabNmae).style.display = "block";
        evt.currentTarget.className += "current";
    }

    render(){
        return (
            <section className="schedule-area schedule-style-four bg-image ptb-120">
                <div className="container">
                    <div className="section-title">
                        <span>Schedule Plan</span>
                        <h2>Information of <b>Event</b> <br /> Schedules</h2>

                        <div className="bg-title lax" data-lax-preset="driftLeft">
                            Events
                        </div>

                        <Link to="#" className="btn btn-primary">Buy Tickets Now!</Link>

                        <div className="bar"></div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tab">
                                <div className="row">
                                    <div className="col-lg-8 col-md-9">
                                        <div className="tab_content">
                                            <div id="tab1" className="tabs_item">
                                                <ul className="accordion">
                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author">
                                                                <img 
                                                                    src={require("../../assets/images/author1.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital Marketing Theory</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>Steven Smith</span> CEO of EnvyTheme
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author5.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author2.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author3.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author4.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Doe" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital World Event Information</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author6.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author7.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>HTML, CSS and Bootstrap Introduction</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author8.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author9.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author3.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author4.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Doe" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital World Event Information</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>	
                                            </div>

                                            <div id="tab2" className="tabs_item">
                                                <ul className="accordion">
                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author">
                                                                <img 
                                                                    src={require("../../assets/images/author1.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital Marketing Theory</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>Steven Smith</span> CEO of EnvyTheme
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author5.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author2.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author3.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author4.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Doe" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital World Event Information</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author6.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author7.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>HTML, CSS and Bootstrap Introduction</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>	
                                            </div>

                                            <div id="tab3" className="tabs_item">
                                                <ul className="accordion">
                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author">
                                                                <img 
                                                                    src={require("../../assets/images/author1.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital Marketing Theory</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>Steven Smith</span> CEO of EnvyTheme
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author5.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author2.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author3.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author4.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Doe" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital World Event Information</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author6.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author7.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>HTML, CSS and Bootstrap Introduction</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author8.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author9.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author3.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author4.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Doe" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital World Event Information</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>	
                                            </div>

                                            <div id="tab4" className="tabs_item">
                                                <ul className="accordion">
                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author">
                                                                <img 
                                                                    src={require("../../assets/images/author1.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital Marketing Theory</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>Steven Smith</span> CEO of EnvyTheme
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author5.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author2.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author3.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author4.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Doe" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital World Event Information</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author6.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author7.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>HTML, CSS and Bootstrap Introduction</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="accordion-item">
                                                        <Link className="accordion-title" to="#">
                                                            <div className="author author-multi">
                                                                <img 
                                                                    src={require("../../assets/images/author8.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Steven Lucy" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author9.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Jonaton Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author3.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Smith" 
                                                                    alt="Schedule" 
                                                                />
                                                                <img 
                                                                    src={require("../../assets/images/author4.jpg")} 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="John Doe" 
                                                                    alt="Schedule" 
                                                                />
                                                            </div>
                                                            
                                                            <div className="schedule-info">
                                                                <h3>Digital World Event Information</h3>

                                                                <ul>
                                                                    <li>
                                                                        <i className="icofont-user-suited"></i> 
                                                                        By <span>EnvyTheme Team</span> of USA Inc
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-wall-clock"></i> 13:00AM - 20:00PM
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Link>
                                                        
                                                        <div className="accordion-content">
                                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                            <div className="row h-100 align-items-center">
                                                                <div className="col-lg-6">
                                                                    <div className="location">
                                                                        <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 text-right">
                                                                    <Link to="#" className="btn btn-primary">View Details</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>	
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-3">
                                        <ul className="tabs active">
                                            <li
                                                onClick={(e) => this.openTabSection(e, 'tab1')}
                                                className="current"
                                            >
                                                <Link to="#">
                                                    First Day
                                                    <span>4 April 2020</span>
                                                </Link>
                                            </li>
            
                                            <li onClick={(e) => this.openTabSection(e, 'tab2')}>
                                                <Link to="#">
                                                    Second Day
                                                    <span>5 April 2020</span>
                                                </Link>
                                            </li>
            
                                            <li onClick={(e) => this.openTabSection(e, 'tab3')}>
                                                <Link to="#">
                                                    Third Day
                                                    <span>6 April 2020</span>
                                                </Link>
                                            </li>
            
                                            <li onClick={(e) => this.openTabSection(e, 'tab4')}>
                                                <Link to="#">
                                                    Fourth Day
                                                    <span>7 April 2020</span>
                                                </Link>
                                            </li>
                                        </ul>
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