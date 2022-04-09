import React from 'react';
import { Link } from 'react-router-dom';
import CustomPagination from '../Common/CustomPagination';
import Loader from '../Common/Loader';

class PerformerList extends React.Component {
    render() {
        const { loading, page, total, performers, loadPerformers } = this.props;

        if (loading) {
            return (
                <div className="container mb-5 mt-3">
                    <Loader />
                </div>
            )
        }
        if (!performers || performers.length === 0) {
            return (
                <div className="container my-5">
                    <h3 className='text-center'>There is No Performers. Please try again with other search terms.</h3>
                </div>
            )
        }

        return (
            <div className="container mb-5">
                <div className='tab_content'>
                    <div className="tabs_item">
                        <ul className="accordion">
                            {performers.map((performer, index) => (
                                <li className="accordion-item" key={index}>
                                    <div className="accordion-title">
                                        <div className="schedule-info">
                                            <h3>{performer.name}</h3>

                                            <ul>
                                                <li><i className="icofont-chart-growth"></i> Popularity Score: {performer.popularity_score}</li>
                                            </ul>
                                            <div className='mt-2 tagcloud'>
                                                {performer.categories.map((category, index) => (
                                                    <Link key={index} to={category.slug_url}>{category.name}</Link>
                                                ))}
                                            </div>
                                        </div>
                                        <Link to={performer.slug_url} className='btn btn-secondary btn-buy'>See Detail</Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <CustomPagination onChangePage={loadPerformers}
                    total={total}
                    currentPage={page - 1} />
            </div>
        );
    }
}

export default PerformerList;