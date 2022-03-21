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
        const { categories } = props;
        // Get Categories
        const category_options = [];
        getCategoryOptions(categories, category_options);

        this.state = {
            query: '',
            country: null,
            region: null,
            locality: null,
            venue: null,
            time: null,
            category: null,
            loadingVenue: false,
            category_options: category_options,
            region_options: [],
            locality_options: [],
            country_disabled: false,
            region_disabled: false,
            locality_disabled: false,
            category_disabled: false,
            defaultVenueOptions: [],
        }
    }

    getRegionOptions = (country) => {
        const { regions_ca, regions_us } = this.props;
        if (country) {
            const regions = country.value === 'ca' ? regions_ca : regions_us;
            return Object.keys(regions).map(key => ({ value: { value: key, slug: regions[key].slug }, label: regions[key].name }))
        }
        return [];
    }

    getLocalityOptions = (country, region) => {
        const { localities_ca, localities_us } = this.props;
        if (country) {
            const localities = country.value === 'ca' ? localities_ca : localities_us;
            if (region && localities[region.value.value]) {
                return localities[region.value.value].map(locality => ({ value: { value: locality.name, slug: locality.slug }, label: locality.name }));
            }
        }
        return [];
    }

    getInitialValues = () => {
        const { location, time_options, country_options } = this.props;
        const { pathname, search } = location;
        const { category_options } = this.state;

        // Get Default params
        let query = '',
            country = '',
            locality = '',
            region = '',
            time = '',
            category = '';
        let category_disabled = false, country_disabled = false, region_disabled = false, locality_disabled = false;
        let region_options = [], locality_options = [];
        // Search URL
        if (pathname === '/search') {
            const params = new URLSearchParams(search);
            query = params.get('query');
            country = params.get('country');
            region = params.get('region');
            locality = params.get('locality');
            if (country) {
                country = country_options.find(country_ => country_.value === country);
                if (!country) return;

                region_options = this.getRegionOptions(country);
                if (region) {
                    region = region_options.find(region_ => region_.value.slug === region);
                    if (!region) return;

                    locality_options = this.getLocalityOptions(country, region);
                    if (locality) {
                        locality = locality_options.find(locality_ => locality_.value.slug === locality);
                        if (!locality) return;
                    }
                }
            }
            time = params.get('time');
            if (time) {
                time = time_options.find(time_ => time_.value === time);
            }
            // Get Categories
            category = params.get('category');
            if (category) {
                category = category_options.find(category_ => category_.value === category);
            }
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
            const { match: { params: { country: country_param, region: region_param, locality: locality_param } } } = this.props;
            // Country Option
            if (country_param) {
                country = country_options.find(country_ => country_.value === country_param);
                if (!country) return;
                country_disabled = true;

                region_options = this.getRegionOptions(country);
                if (region_param) {
                    region = region_options.find(region_ => region_.value.slug === region_param);
                    if (!region) return;
                    region_disabled = true;

                    locality_options = this.getLocalityOptions(country, region);
                    if (locality_param) {
                        locality = locality_options.find(locality_ => locality_.value.slug === locality_param);
                        if (!locality) return;
                        locality_disabled = true;
                    }
                }
            }
        }

        this.setState({
            query: query ? query : '',
            country: country ? country : null,
            region: region ? region : null,
            locality: locality ? locality : null,
            venue: null,
            time: time ? time : null,
            category: category ? category : null,
            loadingVenue: false,
            region_options: region_options,
            locality_options: locality_options,
            category_disabled: category_disabled,
            country_disabled: country_disabled,
            region_disabled: region_disabled,
            locality_disabled: locality_disabled,
        }, this.initializeFilter)
    }

    initializeFilter = () => {
        const { initializeFilter } = this.props;
        const { query, region, locality, venue, time, category, country } = this.state;
        initializeFilter({
            query: query,
            country: country ? country.value : '',
            region: region ? region.value.value : '',
            locality: locality ? locality.value.value : '',
            venue: venue ? venue.value : '',
            time: time ? time.value : '',
            category: category ? category.value : '',
        }, 1);
        this.getDefaultVenueOptions();
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
        const { country } = this.state;
        const locality_options = this.getLocalityOptions(country, region)
        this.setState({
            region: region,
            locality: null,
            locality_options
        }, this.getDefaultVenueOptions);
    }

    setCountryOption = (country) => {
        this.setState({
            country: country,
            region: null,
            locality: null,
            locality_options: [],
            region_options: this.getRegionOptions(country)
        }, this.getDefaultVenueOptions);
    }

    setLocalityOption = (locality) => {
        this.setState({ locality: locality }, this.getDefaultVenueOptions)
    }

    getDefaultVenueOptions = () => {
        const { region, locality, country } = this.state;
        getVenues({
            country: country ? country.value : '',
            region: region ? region.value.value : '',
            locality: locality ? locality.value.value : '',
        })
            .then(({ data }) => {
                const { success, venues } = data;
                if (success) {
                    this.setState({ defaultVenueOptions: venues.map(venue => ({ label: venue.name, value: venue.slug })) });
                } else {
                    this.setState({ defaultVenueOptions: [] });
                }
            })
            .catch(error => {
                this.setState({ defaultVenueOptions: [] });
            })
    }

    getVenues = (query, cb) => {
        const { region, locality, country } = this.state;
        this.setState({ loadingVenue: true });
        getVenues({
            country: country ? country.value : '',
            region: region ? region.value.value : '',
            locality: locality ? locality.value.value : '',
            query
        })
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
        const {
            query, country, region, locality, venue, time, category, loadingVenue,
            category_options, locality_options, region_options, category_disabled,
            region_disabled, locality_disabled, country_disabled,
            defaultVenueOptions
        } = this.state;
        const { time_options, country_options } = this.props;

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
                            name="countries"
                            options={country_options}
                            placeholder="All Countries"
                            value={country}
                            onChange={this.setCountryOption}
                            styles={customStyles}
                            maxMenuHeight={200}
                            isDisabled={country_disabled}
                            isClearable
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2 mt-md-0'>
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
                            isClearable
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2 mt-lg-0'>
                        <Select
                            className="form-control p-0"
                            classNamePrefix="select"
                            isSearchable={true}
                            name="locality"
                            placeholder="All Cities"
                            options={locality_options}
                            noOptionsMessage={() => "No Cities"}
                            value={locality}
                            onChange={this.setLocalityOption}
                            styles={customStyles}
                            isDisabled={locality_disabled}
                            maxMenuHeight={200}
                            isClearable
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2'>
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
                            defaultOptions={defaultVenueOptions}
                            maxMenuHeight={200}
                            isClearable
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
                            isClearable
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
                            isClearable
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-8 col-lg-3 mt-2'>
                        <button className='btn btn-primary'
                            style={{ width: '100%' }}
                            onClick={this.initializeFilter}>Search</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    categories: state.categories,
    country_options: state.country_options,
    regions_ca: state.regions_ca,
    regions_us: state.regions_us,
    localities_ca: state.localities_ca,
    localities_us: state.localities_us,
    time_options: state.time_options,
});

export default connect(mapStateToProps, null)(withRouter(SearchForm));