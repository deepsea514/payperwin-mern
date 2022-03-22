import React from 'react';
import CountUp from 'react-countup';
import VisibilitySensor from "react-visibility-sensor";
import { connect } from 'react-redux';

const getCategoryCount = (categories) => {
    let total_categories = categories.length;
    for (const category of categories) {
        if (category.sub_categories.length)
            total_categories += getCategoryCount(category.sub_categories);
    }
    return total_categories;
}

class FunFact extends React.Component {
    constructor(props) {
        super(props);

        const { categories } = this.props;
        this.state = {
            didViewCountUp: false,
            total_categories: getCategoryCount(categories)
        }
    }

    onVisibilityChange = isVisible => {
        if (isVisible) {
            this.setState({ didViewCountUp: true });
        }
    };

    render() {
        const { didViewCountUp, total_categories } = this.state;
        const { total_events, total_performers, total_venues } = this.props;
        return (
            <section className="funfacts-area ptb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-6 col-sm-6">
                            <div className="single-funfact">
                                <div className="icon">
                                    <i className="icofont-thunder-light"></i>
                                </div>
                                <h3 className="odometer">
                                    <VisibilitySensor
                                        onChange={this.onVisibilityChange}
                                        offset={{ top: 10 }}
                                        delayedCall>
                                        <CountUp
                                            start={0}
                                            end={didViewCountUp ? total_events : 0}
                                            duration={3} />
                                    </VisibilitySensor>
                                </h3>
                                <p>Total Events</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6 col-sm-6">
                            <div className="single-funfact">
                                <div className="icon">
                                    <i className="icofont-users-social"></i>
                                </div>
                                <h3 className="odometer">
                                    <VisibilitySensor
                                        onChange={this.onVisibilityChange}
                                        offset={{ top: 10 }}
                                        delayedCall>
                                        <CountUp
                                            start={0}
                                            end={didViewCountUp ? total_performers : 0}
                                            duration={3} />
                                    </VisibilitySensor>
                                </h3>
                                <p>Total Performers</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6 col-sm-6">
                            <div className="single-funfact">
                                <div className="icon">
                                    <i className="icofont-field-alt"></i>
                                </div>
                                <h3 className="odometer">
                                    <VisibilitySensor
                                        onChange={this.onVisibilityChange}
                                        offset={{ top: 10 }}
                                        delayedCall>
                                        <CountUp
                                            start={0}
                                            end={didViewCountUp ? total_venues : 0}
                                            duration={3} />
                                    </VisibilitySensor>
                                </h3>
                                <p>Total Venues</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6 col-sm-6">
                            <div className="single-funfact">
                                <div className="icon">
                                    <i className="icofont-tags"></i>
                                </div>
                                <h3 className="odometer">
                                    <VisibilitySensor
                                        onChange={this.onVisibilityChange}
                                        offset={{ top: 10 }}
                                        delayedCall>
                                        <CountUp
                                            start={0}
                                            end={didViewCountUp ? total_categories : 0}
                                            duration={3} />
                                    </VisibilitySensor>
                                </h3>
                                <p>Total Categories</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => ({
    categories: state.categories,
    total_events: state.total_events,
    total_venues: state.total_venues,
    total_performers: state.total_performers,
});
export default connect(mapStateToProps, null)(FunFact);