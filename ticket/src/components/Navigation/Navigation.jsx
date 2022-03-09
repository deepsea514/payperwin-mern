import React from 'react';
import { Link, withRouter, NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
 
class Navigation extends React.Component {

    state = {
        collapsed: true,
        isOpen: false
    };

    toggleNavbar = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    componentDidMount() {
        let elementId = document.getElementById("navbar");
        document.addEventListener("scroll", () => {
            if (window.scrollY > 170) {
                elementId.classList.add("is-sticky");
                window.history.pushState("", document.title, window.location.pathname);
            } else {
                elementId.classList.remove("is-sticky");
            }
        });
        window.scrollTo(0, 0);
    }

    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

    componentDidUpdate(nextProps) {
        if (this.props.match.path !== nextProps.match.path) {
            // this.onRouteChanged();
            console.log('OK')
        }
    }

    onRouteChanged = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render(){
        const { collapsed } = this.state;
        const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
        const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        return (
            <header id="header" className="header-area">
                <div id="navbar" className="elkevent-nav">
                    <nav className="navbar navbar-expand-md navbar-light">
                        <div className="container">
                            <Link className="navbar-brand" to="/">
                                <img src={logo} alt="logo" />
                            </Link>

                            <button 
                                onClick={this.toggleNavbar} 
                                className={classTwo}
                                type="button" 
                                data-toggle="collapse" 
                                data-target="#navbarSupportedContent" 
                                aria-controls="navbarSupportedContent" 
                                aria-expanded="false" 
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className={classOne} id="navbarSupportedContent">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <Link 
                                            exact="true" 
                                            to="#" 
                                            onClick={this.toggleOpen} 
                                            className="nav-link"
                                        >
                                            Home
                                        </Link>

                                        <ul className={menuClass}>
                                            <li className="nav-item">
                                                <NavLink 
                                                    exact
                                                    to="/" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Home Page 1
                                                </NavLink>
                                            </li>
                                            
                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/home-two" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Home Page 2
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/home-three" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Home Page 3
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/home-four" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Home Page 4
                                                </NavLink>
                                            </li>
                                            
                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/home-five" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Home Page 5
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </li>
                                    
                                    <li className="nav-item">
                                        <Link 
                                            to="#" 
                                            onClick={this.toggleOpen} 
                                            className="nav-link"
                                        >
                                            Pages
                                        </Link>
                                        
                                        <ul className={menuClass}>
                                            <li className="nav-item">
                                                <Link to="#" className="nav-link">About</Link>
                                                <ul className="dropdown-menu">
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/about-1" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            About 1
                                                        </NavLink>
                                                    </li>
                                                    
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/about-2" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            About 2
                                                        </NavLink>
                                                    </li>

                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/about-3" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            About 3
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>

                                            <li className="nav-item">
                                                <Link to="#" className="nav-link">Pricing</Link>
                                                <ul className="dropdown-menu">
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/pricing-1" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            Pricing 1
                                                        </NavLink>
                                                    </li>
            
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/pricing-2" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            Pricing 2
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>

                                            <li className="nav-item">
                                                <Link to="#" className="nav-link">Speakers</Link>
                                                <ul className="dropdown-menu">
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/speakers-1" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            Speakers 1
                                                        </NavLink>
                                                    </li>
            
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/speakers-2" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            Speakers 2
                                                        </NavLink>
                                                    </li>
            
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/speakers-3" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            Speakers 3
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>

                                            <li className="nav-item">
                                                <Link to="#" className="nav-link">Schedule</Link>
                                                <ul className="dropdown-menu">
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/schedule-1" 
                                                            className="nav-link"
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            Schedule 1
                                                        </NavLink>
                                                    </li>
            
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/schedule-2" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            Schedule 2
                                                        </NavLink>
                                                    </li>
            
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/schedule-3" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            Schedule 3
                                                        </NavLink>
                                                    </li>
            
                                                    <li className="nav-item">
                                                        <NavLink 
                                                            to="/schedule-4" 
                                                            className="nav-link" 
                                                            onClick={this.toggleNavbar}
                                                        >
                                                            Schedule 4
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/login" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar} 
                                                    target="_blank"
                                                >
                                                    Login
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/signup" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar} 
                                                    target="_blank"
                                                >
                                                    Sign Up
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/coming-soon" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar} 
                                                    target="_blank"
                                                >
                                                    Coming Soon
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/error-404" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar} 
                                                >
                                                    404 Error
                                                </NavLink>
                                            </li>
                                            
                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/faq" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    FAQ
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/contact" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Contact
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </li>

                                    <li className="nav-item">
                                        <Link 
                                            to="#" 
                                            className="nav-link"
                                            onClick={this.toggleOpen}
                                        >
                                            Speakers
                                        </Link>
                                        <ul className={menuClass}>
                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/speakers-1" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Speakers 1
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/speakers-2" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Speakers 2
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/speakers-3" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Speakers 3
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </li>

                                    <li className="nav-item">
                                        <Link 
                                            to="/schedule-1" 
                                            className="nav-link"
                                            onClick={this.toggleOpen}
                                        >
                                            Schedule
                                        </Link>
                                        <ul className={menuClass}>
                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/schedule-1" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Schedule 1
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/schedule-2" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Schedule 2
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/schedule-3" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Schedule 3
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/schedule-4" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Schedule 4
                                                </NavLink>
                                            </li>
                                            
                                        </ul>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink 
                                            to="/sponsors" 
                                            className="nav-link" 
                                            onClick={this.toggleNavbar}
                                        >
                                            Sponsor
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <Link 
                                            to="#" 
                                            className="nav-link" 
                                            onClick={this.toggleOpen}
                                        >
                                            Blog
                                        </Link>
                                        <ul className={menuClass}>
                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/blog-1" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Blog Grid 1
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/blog-2" 
                                                    className="nav-link" 
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Blog Grid 2
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/blog-3" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Blog Right Sidebar 1
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/blog-4" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Blog Right Sidebar 2
                                                </NavLink>
                                            </li>
                                            
                                            <li className="nav-item">
                                                <NavLink 
                                                    to="/single-blog" 
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Blog Details
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink 
                                            to="/contact" 
                                            className="nav-link" 
                                            onClick={this.toggleNavbar}
                                        >
                                            Contact
                                        </NavLink>
                                    </li>
                                </ul>

                                <div className="others-option">
                                    <ul>
                                        <li>
                                            <NavLink 
                                                to="/pricing-1" 
                                                className="btn btn-primary" 
                                                onClick={this.toggleNavbar}
                                            >
                                                Buy Ticket
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
}
 
export default withRouter(Navigation);