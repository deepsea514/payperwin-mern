import React from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

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
    singleValue:(provided, state) => {
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
    }
}

const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this_week', label: 'This Week' },
    { value: 'next_week', label: 'Next Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'next_month', label: 'Next Month' },
    { value: 'this_year', label: 'This Year' },
]

const stateOptions = [
    { value: "AB", label: "Alberta" },
    { value: "BC", label: "British Columbia" },
    { value: "MB", label: "Manitoba" },
    { value: "NB", label: "New Brunswick" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NS", label: "Nova Scotia" },
    { value: "NU", label: "Nunavut" },
    { value: "ON", label: "Ontario" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "YT", label: "Yukon" }
]

class MainBanner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            state: '',
            city: '',
            venue: '',
            time: '',
            category: '',
            loadingCity: false,
            loadingVenue: false,
        }
    }

    onSearch = () => {
        const { history } = this.props;
        history.push('/events');
    }

    getCities = (query, cb) => {
        cb([]);
    }

    render() {
        const { query, state, city, venue, time, category, loadingCity, loadingVenue } = this.state;
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
                                    {/* <Select
                                        className="form-control"
                                        classNamePrefix="select"
                                        name="state"
                                        options={stateOptions}
                                        placeholder="All States"
                                        value={state}
                                        onChange={(state) => this.setState({ state })}
                                        styles={customStyles}
                                        maxMenuHeight={200}
                                    /> */}
                                    <AsyncSelect
                                        className="form-control"
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        name="city"
                                        placeholder="All Cities"
                                        loadOptions={this.getCities}
                                        noOptionsMessage={() => "No Cities"}
                                        value={city}
                                        isLoading={loadingCity}
                                        onChange={(city) => this.setState({ city })}
                                        styles={customStyles}
                                        maxMenuHeight={200}
                                    />
                                    {/* <AsyncSelect
                                        className="form-control"
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        name="venue"
                                        placeholder="All Venues"
                                        loadOptions={this.getCities}
                                        noOptionsMessage={() => "No Venues"}
                                        value={venue}
                                        isLoading={loadingVenue}
                                        onChange={(venue) => this.setState({ venue })}
                                        styles={customStyles}
                                        maxMenuHeight={200}
                                    /> */}
                                    <Select
                                        className="form-control"
                                        classNamePrefix="select"
                                        isSearchable={false}
                                        name="time"
                                        options={timeOptions}
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
                                        options={[]}
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

export default withRouter(MainBanner);