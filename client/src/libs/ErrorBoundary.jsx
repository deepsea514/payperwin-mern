import React from "react";
import '../PPWAdmin/_metronic/_assets/sass/pages/error/error-5.scss';
import { Link } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render() {
        const { errorInfo } = this.state;
        if (errorInfo) {
            return (
                <div className="container p-12" style={{ height: '60vh'}}>
                    <p className="font-weight-boldest display-4">
                        Sorry, this page isn’t available. Our team is working to resolve the issue. Please <Link to="/support">contact us</Link> if you require further assistance
                    </p>
                </div>
            );
        }
        return this.props.children;
    }
}