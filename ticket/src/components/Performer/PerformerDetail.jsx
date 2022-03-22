import React from 'react';
import { connect } from 'react-redux';
import EventList from '../Events/EventList';
import { getEvents } from '../../redux/services';
import { Link } from 'react-router-dom';

class PerformerDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            total: 0,
            page: 1,
            events: [],
        }
    }

    componentDidMount() {
        this.loadEvents();
    }

    loadEvents = (page = 1) => {
        const { performer } = this.props;
        this.setState({ loading: true });
        getEvents({ performer: performer.slug }, page)
            .then(({ data }) => {
                const { success, events, total, page } = data;
                if (success) {
                    this.setState({
                        loading: false,
                        page: page,
                        total: total,
                        events: events
                    });
                } else {
                    this.setState({
                        loading: false,
                        page: 1,
                        total: 0,
                        events: []
                    });
                }
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    page: 1,
                    total: 0,
                    events: []
                });
            })
    }

    render() {
        const { performer } = this.props;
        const { loading, total, page, events } = this.state;

        return (
            <section className="blog-details-area ptb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="blog-details">
                                <h2>{performer.name}</h2>
                                <ul className='event-info mt-3'>
                                    <li><i className="icofont-chart-growth"></i>  Popularity Score: {performer.popularity_score}</li>
                                </ul>

                                <div className="row mt-4">
                                    <div className="col-lg-12">
                                        <h5>Upcoming Events</h5>
                                        <EventList loading={loading}
                                            total={total}
                                            page={page}
                                            events={events}
                                            noEventMessage={'There is No Upcoming Events for this Performer.'}
                                            loadEvents={this.loadEvents}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-4">
                            <div className="sidebar">
                                <div className="widget widget_categories">
                                    <h3 className="widget-title">
                                        Categories
                                    </h3>
                                    <ul>
                                        {performer.categories.map((category, index) => (
                                            <li key={index}><Link to={category.slug_url}>{category.name}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section >
        );
    }
}

const mapStateToProps = (state) => ({
    cad_rate: state.cad_rate,
});
export default connect(mapStateToProps, null)(PerformerDetail);