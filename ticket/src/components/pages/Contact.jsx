import React from 'react';
import { Link } from 'react-router-dom';
import 'isomorphic-fetch';
import Footer from '../Common/Footer';
 
class Contact extends React.Component {
    state = {
        submitting: false,
        submitted: false,
        buttonState: '',
        formFields: {
            name: '',
            email: '',
            phone: '',
            text: ''
        }
    };

    onSubmit = (e) => {
        e.preventDefault();
        const data = this.state.formFields;
        fetch('/api/contact', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.status === 200) {
                this.setState({ submitted: true })
            }
            let formFields = Object.assign({}, this.state.formFields);
            formFields.name = '';
            formFields.email = '';
            formFields.phone = '';
            formFields.text = '';
            this.setState({formFields});
        });
    }

    nameChangeHandler = (e) => {
        let formFields = Object.assign({}, this.state.formFields);
        formFields.name = e.target.value;
        this.setState({formFields});
    }

    emailChangeHandler = (e) => {
        let formFields = Object.assign({}, this.state.formFields);
        formFields.email = e.target.value;
        this.setState({formFields});
    }

    phoneChangeHandler = (e) => {
        let formFields = Object.assign({}, this.state.formFields);
        formFields.phone = e.target.value;
        this.setState({formFields});
    }

    textChangeHandler = (e) => {
        let formFields = Object.assign({}, this.state.formFields);
        formFields.text = e.target.value;
        this.setState({formFields});
    }

    onHideSuccess = () => {
        this.setState({submitted: false});
    }

    successMessage = () => {
        if (this.state.submitted){
            return (
                <div 
                    className="alert alert-success alert-dismissible fade show" 
                    style={{ marginTop: '14px' }}
                >
                    <strong>Thank you!</strong> Your message is send to the owner.
                    <button 
                        type="button" 
                        className="close"
                        onClick={this.onHideSuccess}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            );
        }
    }

    render(){
        return (
            <React.Fragment>
                <div className="page-title-area item-bg1">
                    <div className="container">
                        <h1>Contact Us</h1>
                        <span>Send me your Message</span>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li>Contact</li>
                        </ul>
                    </div>
                </div>

                <section className="contact-area ptb-120">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-6">
                                <div className="contact-box">
                                    <div className="icon">
                                        <i className="icofont-phone"></i>
                                    </div>
                                    
                                    <div className="content">
                                        <h4>Phone / Fax</h4>
                                        <p>(+021) 245522455</p>
                                        <p>(+000) 245522455</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                                <div className="contact-box">
                                    <div className="icon">
                                        <i className="icofont-email"></i>
                                    </div>
                                    
                                    <div className="content">
                                        <h4>E-mail</h4>
                                        <p>info@evnia.com</p>
                                        <p>support@evnia.com</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6 offset-lg-0 offset-md-3">
                                <div className="contact-box">
                                    <div className="icon">
                                        <i className="icofont-world"></i>
                                    </div>
                                    
                                    <div className="content">
                                        <h4>Location</h4>
                                        <p>2750 Quadra Street Victoria, City, Canada</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row h-100 align-items-center contact-form">
                            <div className="col-lg-4 col-md-12">
                                <div className="leave-your-message">
                                    <h3>Leave Your Message</h3>
                                    <p>If you have any questions about the services we provide simply use the form below. We try and respond to all queries and comments within 24 hours.</p>
                                    
                                    <div className="stay-connected">
                                        <h3>Stay Connected</h3>
                                        <ul>
                                            <li>
                                                <Link to="#" target="_blank">
                                                    <i className="icofont-facebook"></i>
                                                    <span>Facebook</span>
                                                </Link>
                                            </li>
                                            
                                            <li>
                                                <Link to="#" target="_blank">
                                                    <i className="icofont-twitter"></i>
                                                    <span>Twitter</span>
                                                </Link>
                                            </li>
                                            
                                            <li>
                                                <Link to="#" target="_blank">
                                                    <i className="icofont-instagram"></i>
                                                    <span>Instagram</span>
                                                </Link>
                                            </li>
                                            
                                            <li>
                                                <Link to="#" target="_blank">
                                                    <i className="icofont-linkedin"></i>
                                                    <span>Linkedin</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-12">
                                <form onSubmit={this.onSubmit} id="contactForm">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="name">Name*</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="name" 
                                                    id="name" 
                                                    required={true} 
                                                    data-error="Please enter your name" 
                                                    value={this.state.formFields.name}
                                                    onChange={this.nameChangeHandler}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-6 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="email">Email*</label>
                                                <input 
                                                    type="email" 
                                                    className="form-control" 
                                                    name="email" 
                                                    id="email" 
                                                    required={true} 
                                                    data-error="Please enter your email" 
                                                    value={this.state.formFields.email}
                                                    onChange={this.emailChangeHandler}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-12 col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="number">Phone Number*</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="number" 
                                                    id="number" 
                                                    required={true} 
                                                    data-error="Please enter your number" 
                                                    value={this.state.formFields.phone}
                                                    onChange={this.phoneChangeHandler}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-12 col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="message">Message*</label>
                                                <textarea 
                                                    name="message" 
                                                    className="form-control" 
                                                    id="message" 
                                                    cols="30" 
                                                    rows="4" 
                                                    required={true} 
                                                    data-error="Write your message" 
                                                    value={this.state.formFields.text}
                                                    onChange={this.textChangeHandler}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-12 col-md-12">
                                            <button type="submit" className="btn btn-primary">Send Message</button>
                                            <div id="msgSubmit" className="h3 text-center hidden">
                                                {this.successMessage()}
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default Contact;