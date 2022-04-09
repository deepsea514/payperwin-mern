import React from 'react';
import { Link, withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from '../../redux/reducers';
import { logout } from '../../redux/services';

const hideNavigationLinks = [
    '/error-404',
    '/login'
]
class Navigation extends React.Component {

    state = {
        collapsed: true,
        isOpen: false
    };

    toggleNavbar = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            isOpen: false,
        });
    }

    componentDidMount() {
        let elementId = document.getElementById("navbar");
        document.addEventListener("scroll", () => {
            if (window.scrollY > 170) {
                elementId.classList.add("is-sticky");
            } else {
                elementId.classList.remove("is-sticky");
            }
        });
        window.scrollTo(0, 0);
    }

    toggleOpen = (forceValue) => this.setState({ isOpen: forceValue === undefined ? !this.state.isOpen : forceValue });

    onRouteChanged = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    logout = () => {
        const { setUserAction } = this.props;
        this.toggleNavbar();
        logout().then(() => {
            setUserAction();
        }).catch(() => { });
    }

    render() {
        const { collapsed } = this.state;
        const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
        const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        const { user, location } = this.props;
        const { pathname } = location;
        if (hideNavigationLinks.includes(pathname))
            return null;

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
                                aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className={classOne} id="navbarSupportedContent">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <Link to="/categories/sports"
                                            onClick={() => this.toggleOpen(false)}
                                            className="nav-link">
                                            Sports
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/categories/concerts"
                                            onClick={() => this.toggleOpen(false)}
                                            className="nav-link">
                                            Concerts
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/categories/theatre"
                                            onClick={() => this.toggleOpen(false)}
                                            className="nav-link">
                                            Art&nbsp;&&nbsp;Theatre
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/search"
                                            onClick={() => this.toggleOpen(false)}
                                            className="nav-link">
                                            More
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/help"
                                            onClick={() => this.toggleOpen(false)}
                                            className="nav-link">
                                            Help
                                        </Link>
                                    </li>
                                    {!user && <li>
                                        <NavLink to="/login"
                                            className="btn btn-primary"
                                            onClick={this.toggleNavbar}>
                                            <i className='icofont-unlock' />
                                        </NavLink>
                                    </li>}

                                    {user && <li className="nav-item">
                                        <Link to="#"
                                            className="nav-link"
                                            onClick={this.toggleOpen}>
                                            Account
                                        </Link>
                                        <ul className={menuClass}>
                                            <li className="nav-item">
                                                <NavLink to="/checkout"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}>
                                                    Checkout
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink to="/orders"
                                                    className="nav-link"
                                                    onClick={this.toggleNavbar}>
                                                    My Orders
                                                </NavLink>
                                            </li>

                                            <li className="nav-item">
                                                <NavLink to="/logout"
                                                    className="nav-link"
                                                    onClick={this.logout}>
                                                    Logout
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </li>}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
});
export default connect(mapStateToProps, actions)(withRouter(Navigation));