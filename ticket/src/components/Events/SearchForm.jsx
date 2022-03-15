import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getVenues } from '../../redux/services';
import { getCategoryOptions } from '../../lib/getCategoryOptions';

const customStyles = {
    control: (provided) => {
        return {
            ...provided,
            background: '#FFF4',
            height: '100%',
            borderRadius: 'none',
            border: 'none',
        }
    },
    placeholder: (provided) => {
        return {
            ...provided,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#c7c3c7'
        }
    },
    menu: (provided) => {
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
        getCategoryOptions(categories, category_options);
        // Get Region and Locality
        const region_options = Object.keys(regions).map(key => ({ value: key, label: regions[key] }));

        this.state = {
            query: '',
            region: null,
            locality: null,
            venue: null,
            time: null,
            category: null,
            loadingVenue: false,
            category_options: category_options,
            region_options: region_options,
            locality_options: [],
            category_disabled: false,
            region_disabled: false,
            locality_disabled: false,
        }
    }

    getInitialValues = () => {
        const { location, localities_ca, time_options } = this.props;
        const { pathname, search } = location;
        const { category_options, region_options } = this.state;

        // Get Default params
        let query = '',
            locality = '',
            region = '',
            time = '',
            category = '';
        let category_disabled = false, region_disabled = false, locality_disabled = false;
        // Search URL
        if (pathname === '/search') {
            const params = new URLSearchParams(search);
            query = params.get('query');
            locality = params.get('locality');
            if (locality) {
                locality = locality.split(', ');
                region = locality[1];
                locality = locality[0];
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
            if (!category) return;
            category_disabled = true;
        }

        // Places URL
        if (pathname.startsWith("/places")) {
            const { match: { params: { region: region_param, locality: locality_param } } } = this.props;
            const region_ = region_options.find(region_ => region_.value === region_param);
            if (!region_) return;
            if (locality_param) {
                if (!localities_ca[region_param]) return;
                const existing = localities_ca[region_param].find(locality_ => locality_ === locality_param);
                if (!existing) return;
                locality = locality_param;
                locality_disabled = true;
            }
            region = region_param;
            region_disabled = true;
        }

        // Get Region and Locality
        let locality_options = [];
        if (region) {
            region = region_options.find(region_ => region_.value === region);
            if (region && localities_ca[region.value]) {
                locality_options = localities_ca[region.value].map(locality => ({ value: locality, label: locality }));
                locality = locality_options.find(locality_ => locality_.value === locality);
            }
        }

        this.setState({
            query: query ? query : '',
            region: region ? region : null,
            locality: locality ? locality : null,
            venue: null,
            time: time ? time : null,
            category: category ? category : null,
            loadingVenue: false,
            locality_options: locality_options,
            category_disabled: category_disabled,
            region_disabled: region_disabled,
            locality_disabled: locality_disabled,
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

    setRegionOption = (region) => {
        const { localities_ca } = this.props;
        let locality_options = [];
        if (region && localities_ca[region.value]) {
            locality_options = localities_ca[region.value].map(locality => ({ value: locality, label: locality }));
            this.setState({
                region: region,
                locality: null,
                locality_options
            });
        }
    }

    getVenues = (query, cb) => {
        const { region, locality } = this.state;
        this.setState({ loadingVenue: true });
        getVenues(region ? region.value : '', locality ? locality.value : '', query)
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
        const { query, region, locality, venue, time, category, loadingVenue,
            category_options, locality_options, region_options, category_disabled,
            region_disabled, locality_disabled
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
                            name="region"
                            options={region_options}
                            placeholder="All States"
                            value={region}
                            onChange={this.setRegionOption}
                            styles={customStyles}
                            maxMenuHeight={200}
                            isDisabled={region_disabled}
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2 mt-md-0'>
                        <Select
                            className="form-control p-0"
                            classNamePrefix="select"
                            isSearchable={true}
                            name="locality"
                            placeholder="All Cities"
                            options={locality_options}
                            noOptionsMessage={() => "No Cities"}
                            value={locality}
                            onChange={(locality) => this.setState({ locality })}
                            styles={customStyles}
                            isDisabled={locality_disabled}
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