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
            <section className="schedule-area bg-image ptb-120">
                <div className="container">
                    <div className="section-title">
                        <span>Schedule Plan</span>
                        <h2>Information of <b>Event</b> <br /> Schedules</h2>

                        <LaxDiv text="Events" dataPreset="driftLeft" />

                        <Link to="#" className="btn btn-primary">Buy Tickets Now!</Link>

                        <div className="bar"></div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tab">
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
                                                            alt="Author" 
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Reducing test anxiety</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Tom Cruise</span> CEO of EnvyTheme</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 121, Building C/A , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author2.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author3.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author4.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Doe" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Time Management, Getting a Smart Start, Setting Goals</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Leonardo DiCaprio</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 132, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author7.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Impact of mental health on academics</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Robert Downey</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author9.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author" 
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author3.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author4.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Doe" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Athletic performance enhancement</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Brad Pitt</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Introduction to prejudice, stereotyping, microaggressions</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Tom Hanks</span> CEO of EnvyTheme</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 431, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author2.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author3.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author4.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Doe" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Mental health within various cultures and identities</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Matt Damon</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1c2, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author7.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Working with Distressed Students</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Johnny Depp</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Managing Homesickness, Home for the Holidays</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Will Smith</span> CEO of EnvyTheme</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author2.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author3.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author4.jpg")} 
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Doe" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Depression & Alcohol Screening days</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>George Clooney</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author7.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Building resilience/Bounce Back</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Mark Wahlberg</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author9.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author3.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author4.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Doe" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Binge drinking and drug problems</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Ryan Gosling</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Benefits of physical exercise</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>Denzel Washington</span> CEO of EnvyTheme</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author2.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author3.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author4.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Doe" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Digital World Event Information</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>EnvyTheme Team</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author7.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>HTML, CSS and Bootstrap Introduction</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>EnvyTheme Team</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
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
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author9.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Jonaton Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author3.jpg")}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Smith" 
                                                            alt="Author"
                                                        />
                                                        <img 
                                                            src={require("../../assets/images/author4.jpg")} 
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="John Doe" 
                                                            alt="Author"
                                                        />
                                                    </div>
                                                    
                                                    <div className="schedule-info">
                                                        <h3>Digital World Event Information</h3>

                                                        <ul>
                                                            <li><i className="icofont-user-suited"></i> By <span>EnvyTheme Team</span> of USA Inc</li>
                                                            <li><i className="icofont-wall-clock"></i> 13:00AM - 20:00PM</li>
                                                        </ul>
                                                    </div>
                                                </Link>
                                                
                                                <div className="accordion-content">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took Link galley of type and scrambled it to make Link type specimen book.</p>

                                                    <div className="row h-100 align-items-center">
                                                        <div className="col-lg-6 col-md-7">
                                                            <div className="location">
                                                                <b>Location:</b> Hall 1, Building C , King Street , <span>USA</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-5 text-right">
                                                            <Link to="#" className="btn btn-primary">View Details</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>	
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="btn-box">
                                <Link to="#" className="btn btn-primary">Download Schedule (PDF)</Link>
                                <Link to="#" className="btn btn-secondary">Connect Via Instagram</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shape1"><img src={require("../../assets/images/shapes/1.png")} alt="shape1" /></div>
                <div className="shape2 rotateme"><img src={require("../../assets/images/shapes/2.png")} alt="shape2" /></div>
                <div className="shape3 rotateme"><img src={require("../../assets/images/shapes/3.png")} alt="shape3" /></div>
                <div className="shape4"><img src={require("../../assets/images/shapes/4.png")} alt="shape4" /></div>
            </section>
        );
    }
}
 
export default EventSchedules;