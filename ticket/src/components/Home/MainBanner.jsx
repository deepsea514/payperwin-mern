import React from 'react';

class MainBanner extends React.Component {
    render() {
        return (
            <div className="main-banner video-banner">
                <video loop muted autoPlay poster="#" className="video-background">
                    <source src="/video/video-bg.mp4" type="video/mp4" />
                </video>
                <div className="d-table">
                    <div className="d-table-cell">
                        <div className="container">
                            <div className="main-banner-content">
                                <h1>Find Nearby Location</h1>
                                <ul>
                                    <li>Explore top-rated attractions, activities and more!</li>
                                </ul>

                                <div className='search-form'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="What are you looking for?"
                                    />
                                    <select className="form-control">
                                        <option value="">All States</option>
                                    </select>
                                    <select className="form-control">
                                        <option value="">All Cities</option>
                                    </select>
                                    <select className="form-control">
                                        <option value="">All Venues</option>
                                    </select>
                                    <select className="form-control">
                                        <option value="">All Time</option>
                                    </select>
                                    <select className="form-control">
                                        <option value="">All Categories</option>
                                    </select>
                                    <button>Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="shape1">
                    <img src="/images/shapes/1.png" alt="shape1" />
                </div>

                <div className="shape2 rotateme">
                    <img src="/images/shapes/2.png" alt="shape2" />
                </div>

                <div className="shape3 rotateme">
                    <img src="/images/shapes/3.png" alt="shape3" />
                </div>

                <div className="shape4">
                    <img src="/images/shapes/4.png" alt="shape4" />
                </div> */}
            </div>
        );
    }
}

export default MainBanner;