import React from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { connect } from 'react-redux';

const customStyles = {
    control: (provided) => {
        return {
            ...provided,
            background: 'transparent',
            height: '38px',
            borderRadius: 'none',
            border: 'none',
        }
    },
    singleValue: (provided) => {
        return {
            ...provided,
            color: '#FFF',
            textAlign: 'left'
        }
    },
    placeholder: (provided) => {
        return {
            ...provided,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#c7c3c7',
            textAlign: 'left'
        }
    },
    menu: (provided) => {
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
        const { categories } = this.props;
        const category_options = categories.map(category => ({ label: category.name, value: category.slug }));
        this.state = {
            query: '',
            country: null,
            locality: null,
            time: null,
            category: null,
            category_options: category_options,
        }
    }

    getCities = (inputValue, callback) => {
        const { country } = this.state;
        if (!country) {
            callback([]);
            return;
        }
        const { localities_ca, localities_us, regions_ca, regions_us } = this.props;
        let locality_options = [];
        if (country.value === 'us') {
            for (const key of Object.keys(localities_us)) {
                locality_options = [...locality_options, ...localities_us[key].map(locality => {
                    const region = regions_us[key];
                    if (region)
                        return {
                            value: { region: region.slug, locality: locality.slug },
                            label: locality.name + ', ' + region.name,
                        }
                    return { value: 'undefiend', label: 'undefined' };
                })];
            }
        } else if (country.value === 'ca') {
            for (const key of Object.keys(localities_ca)) {
                locality_options = [...locality_options, ...localities_ca[key].map(locality => {
                    const region = regions_ca[key];
                    if (region)
                        return {
                            value: { region: region.slug, locality: locality.slug },
                            label: locality.name + ', ' + region.name,
                        }
                    return null;
                })];
            }
        }
        callback(locality_options.filter(x => x.label.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 20))
    }

    onSearch = () => {
        const { history } = this.props;
        const { query, country, locality, time, category } = this.state;
        const searchObj = {};
        query && (searchObj.query = query);
        country && (searchObj.country = country.value);
        locality && (searchObj.region = locality.value.region);
        locality && (searchObj.locality = locality.value.locality);
        time && (searchObj.time = time.value);
        category && (searchObj.category = category.value);

        history.push({
            pathname: '/search',
            search: "?" + new URLSearchParams(searchObj).toString()
        });
    }

    render() {
        const {
            query, locality, time, category, category_options, country
        } = this.state;
        const { time_options, country_options } = this.props;

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
                                    <li>Shop millions of shop missions of tickets and discover can't-miss concerts, games, theater and more.</li>
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
                                        isSearchable={false}
                                        name="country"
                                        options={country_options}
                                        placeholder="All Countries"
                                        value={country}
                                        onChange={(country) => this.setState({ country, region: null, locality: null })}
                                        styles={customStyles}
                                        maxMenuHeight={200}
                                        isClearable
                                    />
                                    <AsyncSelect
                                        className="form-control"
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        name="locality"
                                        placeholder="All Cities"
                                        loadOptions={this.getCities}
                                        noOptionsMessage={() => "No Cities"}
                                        value={locality}
                                        onChange={(locality) => this.setState({ locality })}
                                        defaultOptions={true}
                                        styles={customStyles}
                                        maxMenuHeight={200}
                                        isClearable
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
                                        isClearable
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
                                        isClearable
                                    />
                                    <button onClick={this.onSearch}>Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    categories: state.categories,
    country_options: state.country_options,
    localities_ca: state.localities_ca,
    localities_us: state.localities_us,
    time_options: state.time_options,
    regions_ca: state.regions_ca,
    regions_us: state.regions_us,
});

export default connect(mapStateToProps, null)(withRouter(MainBanner));