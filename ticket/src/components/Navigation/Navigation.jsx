import React from 'react';
import { Link, withRouter, NavLink } from 'react-router-dom';

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

    render() {
        const { collapsed } = this.state;
        const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
        const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        return (
            <header id="header" className="header-area">
                <div id="navbar" className="elkevent-nav">
                    <nav className="navbar navbar-expand-md navbar-light">
                        <div className="container mx-0">
                            <Link className="navbar-brand" to="/">
                                <img src="/images/logo-white.png" alt="logo" />
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
                                            to="/"
                                            onClick={this.toggleOpen}
                                            className="nav-link"
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to="/events"
                                            onClick={this.toggleOpen}
                                            className="nav-link"
                                        >
                                            Event
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            to="#"
                                            className="nav-link"
                                            onClick={this.toggleOpen}
                                        >
                                            Categories
                                        </Link>
                                        <ul className={menuClass}>
                                            <li className="nav-item">
                                                <NavLink
                                                    to="/speakers-1"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Sports
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink
                                                    to="/speakers-2"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Concerts
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink
                                                    to="/speakers-3"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Theatre
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink
                                                    to="/speakers-3"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Special Events
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
                                            Locations
                                        </Link>
                                        <ul className={menuClass}>
                                            <li className="nav-item">
                                                <NavLink
                                                    to="/schedule-1"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Vancouver
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink
                                                    to="/schedule-2"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Toronto
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink
                                                    to="/schedule-3"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Montreal
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink
                                                    to="/schedule-4"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}
                                                >
                                                    Calgary
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>

                                <div className="others-option">
                                    <ul>
                                        <li>
                                            <NavLink
                                                to="/login"
                                                className="btn btn-primary"
                                                onClick={this.toggleNavbar}
                                            >
                                                <i className='icofont-unlock' />
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