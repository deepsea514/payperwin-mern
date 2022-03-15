import React from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import { connect } from 'react-redux';

const customStyles = {
    control: (provided, state) => {
        return {
            ...provided,
            background: 'transparent',
            height: '38px',
            borderRadius: 'none',
            border: 'none',
        }
    },
    singleValue: (provided, state) => {
        return {
            ...provided,
            color: '#FFF',
            textAlign: 'left'
        }
    },
    placeholder: (provided, state) => {
        return {
            ...provided,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#c7c3c7',
            textAlign: 'left'
        }
    },
    menu: (provided, state) => {
        return {
            ...provided,
            color: 'black',
            width: window.innerWidth > 990 ? "150%" : '100%',
            textAlign: 'left'
        }
    },
    input: (provided) => {
        return {
            ...provided,
            color: 'white'
        }
    }
}

class MainBanner extends React.Component {
    constructor(props) {
        super(props);
        const { localities_ca, categories } = this.props;
        const category_options = categories.map(category => ({ label: category.name, value: category.slug }));
        let city_options = [];
        for (const key of Object.keys(localities_ca)) {
            city_options = [...city_options, ...localities_ca[key].map(locality => ({
                value: locality + ', ' + key,
                label: locality + ', ' + key,
            }))];
        }
        this.state = {
            query: '',
            city: null,
            time: null,
            category: null,
            city_options: city_options,
            category_options: category_options,
        }
    }

    onSearch = () => {
        const { history } = this.props;
        const { query, city, time, category } = this.state;
        const searchObj = {};
        query && (searchObj.query = query);
        city && (searchObj.city = city.value);
        time && (searchObj.time = time.value);
        category && (searchObj.category = category.value);

        history.push({
            pathname: '/search',
            search: "?" + new URLSearchParams(searchObj).toString()
        });
    }

    getCities = (query, cb) => {
        cb([]);
    }

    render() {
        const { query, city, time, category, category_options, city_options } = this.state;
        const { time_options } = this.props;

        return (
            <div className="main-banner video-banner">
                <video loop muted autoPlay poster="#" className="video-background">
                    <source src="/video/video-bg.mp4" type="video/mp4" />
                </video>
                <div className="d-table">
                    <div className="d-table-cell">
                        <div className="container">
                            <div className="main-banner-content">
                                <h1>Find Tickets</h1>
                                <ul>
                                    <li>Shop millions of sport games and discover can't-miss concerts, games, theater and more.</li>
                                </ul>

                                <div className='search-form'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="What are you looking for?"
                                        value={query}
                                        onChange={(evt) => this.setState({ query: evt.target.value })}
                                    />
                                    <Select
                                        className="form-control"
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        name="city"
                                        options={city_options}
                                        placeholder="All Cities"
                                        noOptionsMessage={() => "No Cities"}
                                        value={city}
                                        onChange={(city) => this.setState({ city })}
                                        styles={customStyles}
                                        maxMenuHeight={200}
                                    />
                                    <Select
                                        className="form-control"
                                        classNamePrefix="select"
                                        isSearchable={false}
                                        name="time"
                                        options={time_options}
                                        value={time}
                                        placeholder="All Time"
                                        onChange={(time) => { this.setState({ time }) }}
                                        styles={customStyles}
                                        maxMenuHeight={200}
                                    />
                                    <Select
                                        className="form-control"
                                        classNamePrefix="select"
                                        name="category"
                                        options={category_options}
                                        placeholder="All Categories"
                                        styles={customStyles}
                                        value={category}
                                        maxMenuHeight={200}
                                        onChange={(category) => this.setState({ category })}
                                    />
                                    <button onClick={this.onSearch}>Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shape1">
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
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    categories: state.categories,
    localities_ca: state.localities_ca,
    time_options: state.time_options,
});

export default connect(mapStateToProps, null)(withRouter(MainBanner));