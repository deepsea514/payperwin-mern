import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getVenues } from '../../redux/services';

const customStyles = {
    control: (provided, state) => {
        return {
            ...provided,
            background: '#FFF4',
            height: '100%',
            borderRadius: 'none',
            border: 'none',
        }
    },
    placeholder: (provided, state) => {
        return {
            ...provided,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#c7c3c7'
        }
    },
    menu: (provided, state) => {
        return {
            ...provided,
            color: 'black',
        }
    }
}

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        const { categories, regions } = props;
        // Get Categories
        const category_options = [];
        this.getCategoryOptions(categories, category_options);
        // Get State and City
        const region_options = Object.keys(regions).map(key => ({ value: key, label: regions[key] }));

        this.state = {
            query: '',
            state: null,
            city: null,
            venue: null,
            time: null,
            category: null,
            loadingVenue: false,
            category_options: category_options,
            region_options: region_options,
            city_options: [],
            category_disabled: false,
            state_disabled: false,
        }
    }

    getInitialValues = () => {
        const { location, localities_ca, time_options } = this.props;
        const { pathname, search } = location;
        const { category_options, region_options } = this.state;

        // Get Default params
        let query = '',
            city = '',
            state = '',
            time = '',
            category = '';
        let category_disabled = false, state_disabled = false;
        // Search URL
        if (pathname === '/search') {
            const params = new URLSearchParams(search);
            query = params.get('query');
            city = params.get('city');
            if (city) {
                city = city.split(', ');
                state = city[1];
                city = city[0];
            }
            time = params.get('time');
            if (time) {
                time = time_options.find(time_ => time_.value === time);
            }
            category = params.get('category');
        }

        // Get Categories
        if (category) {
            category = category_options.find(category_ => category_.value === category);
        }

        // Category URL
        if (pathname.startsWith("/categories")) {
            const { match: { params: { category_slug } } } = this.props;
            category = category_options.find(category_ => category_.value === category_slug);
            category_disabled = true;
        }

        // Get State and City
        let city_options = [];
        if (state) {
            state = region_options.find(state_ => state_.value === state);
            if (state && localities_ca[state.value]) {
                city_options = localities_ca[state.value].map(locality => ({ value: locality, label: locality }));
                city = city_options.find(city_ => city_.value === city);
            }
        }

        this.setState({
            query: query ? query : '',
            state: state ? state : null,
            city: city ? city : null,
            venue: null,
            time: time ? time : null,
            category: category ? category : null,
            loadingVenue: false,
            city_options: city_options,
            category_disabled: category_disabled,
            state_disabled: state_disabled,
        })
    }

    componentDidMount() {
        this.getInitialValues();
    }

    componentDidUpdate(prevProps) {
        const { location: prevLocation } = prevProps;
        const { location } = this.props;
        if (location.pathname !== prevLocation.pathname) {
            this.getInitialValues();
        }
    }

    getCategoryOptions = (categories, options) => {
        for (const category of categories) {
            options.push({ label: category.name, value: category.slug });
            if (category.sub_categories && category.sub_categories.length) {
                this.getCategoryOptions(category.sub_categories, options);
            }
        }
    }

    setStateOption = (state) => {
        const { localities_ca } = this.props;
        let city_options = [];
        if (state && localities_ca[state.value]) {
            city_options = localities_ca[state.value].map(locality => ({ value: locality, label: locality }));
            this.setState({
                state,
                city: null,
                city_options
            });
        }
    }

    getVenues = (query, cb) => {
        const { state, city } = this.state;
        this.setState({ loadingVenue: true });
        getVenues(state ? state.value : '', city ? city.value : '', query)
            .then(({ data }) => {
                const { success, venues } = data;
                this.setState({ loadingVenue: false });
                if (success) {
                    cb(venues.map(venue => ({ label: venue.name, value: venue.slug })));
                } else cb([]);
            })
            .catch(error => {
                this.setState({ loadingVenue: false });
                cb([]);
            })
    }

    render() {
        const { query, state, city, venue, time, category, loadingVenue,
            category_options, city_options, region_options, category_disabled
        } = this.state;
        const { time_options } = this.props;

        return (
            <div className='container py-5'>
                <div className='row'>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                        <input className='form-control'
                            value={query}
                            onChange={(evt) => this.setState({ query: evt.target.value })}
                            placeholder='What are you looking for?' />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2 mt-sm-0'>
                        <Select
                            className="form-control p-0"
                            classNamePrefix="select"
                            name="state"
                            options={region_options}
                            placeholder="All States"
                            value={state}
                            onChange={this.setStateOption}
                            styles={customStyles}
                            maxMenuHeight={200}
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2 mt-md-0'>
                        <Select
                            className="form-control p-0"
                            classNamePrefix="select"
                            isSearchable={true}
                            name="city"
                            placeholder="All Cities"
                            options={city_options}
                            noOptionsMessage={() => "No Cities"}
                            value={city}
                            onChange={(city) => this.setState({ city })}
                            styles={customStyles}
                            maxMenuHeight={200}
                        /></div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2 mt-lg-0'>
                        <AsyncSelect
                            className="form-control p-0"
                            classNamePrefix="select"
                            isSearchable={true}
                            name="venue"
                            placeholder="All Venues"
                            loadOptions={this.getVenues}
                            noOptionsMessage={() => "No Venues"}
                            value={venue}
                            isLoading={loadingVenue}
                            onChange={(venue) => this.setState({ venue })}
                            styles={customStyles}
                            defaultOptions
                            maxMenuHeight={200}
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2'>
                        <Select
                            className="form-control p-0"
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
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2'>
                        <Select
                            className="form-control p-0"
                            classNamePrefix="select"
                            name="category"
                            options={category_options}
                            placeholder="All Categories"
                            styles={customStyles}
                            value={category}
                            maxMenuHeight={200}
                            onChange={(category) => this.setState({ category })}
                            isDisabled={category_disabled}
                        />
                    </div>
                    <div className='col-12 col-sm-12 col-md-12 col-lg-6 mt-2'>
                        <button className='btn btn-primary' style={{ width: '100%' }}>Search</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    categories: state.categories,
    regions: state.regions,
    localities_ca: state.localities_ca,
    time_options: state.time_options,
});

export default connect(mapStateToProps, null)(withRouter(SearchForm));