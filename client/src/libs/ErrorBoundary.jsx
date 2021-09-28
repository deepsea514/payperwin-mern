import React from "react";
import '../PPWAdmin/_metronic/_assets/sass/pages/error/error-5.scss';

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
        const { errorInfo, error } = this.state;
        if (errorInfo) {
            return (
                <div
                    className="error error-5 d-flex flex-row-fluid bgi-size-cover bgi-position-center"
                    style={{
                        backgroundImage: `url("/images/PPW Meta.jpg")`,
                    }}
                >
                    <div className="container d-flex flex-row-fluid flex-column justify-content-md-center p-12">
                        <h1 className="error-title font-weight-boldest text-info mt-10 mt-md-0 mb-12">
                            Oops!
                        </h1>
                        <p className="font-weight-boldest display-4 text-white">
                            Something went wrong here.
                        </p>
                        <p className="font-size-h3 text-white">
                            We're working on it and we'll get it fixed
                            <br />
                            as soon possible.
                            <br />
                            You can back or use our Help Center.
                        </p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}