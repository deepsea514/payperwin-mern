import React from 'react';
import Select from 'react-select';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

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

        this.state = {
            query: '',
            country: null,
            region: null,
            locality: null,
            region_options: [],
            locality_options: [],
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

    initializeFilter = () => {
        const { initializeFilter } = this.props;
        const { query, region, locality, country } = this.state;
        initializeFilter({
            query: query,
            country: country ? country.value : '',
            region: region ? region.value.value : '',
            locality: locality ? locality.value.value : '',
        }, 1);
    }

    componentDidMount() {
        this.initializeFilter();
    }

    setRegionOption = (region) => {
        const { country } = this.state;
        const locality_options = this.getLocalityOptions(country, region)
        this.setState({
            region: region,
            locality: null,
            locality_options
        });
    }

    setCountryOption = (country) => {
        this.setState({
            country: country,
            region: null,
            locality: null,
            locality_options: [],
            region_options: this.getRegionOptions(country)
        });
    }

    render() {
        const {
            query, country, region, locality, locality_options, region_options,
        } = this.state;
        const { country_options } = this.props;

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
                            isClearable
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2 mt-sm-2 mt-md-0'>
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
                            onChange={(locality) => this.setState({ locality })}
                            styles={customStyles}
                            maxMenuHeight={200}
                            isClearable
                        />
                    </div>
                    <div className='col-12 col-sm-6 d-none d-lg-block col-md-0 col-lg-6 mt-2'></div>
                    <div className='col-12 col-sm-12 col-md-8 col-lg-6 mt-2'>
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
    country_options: state.country_options,
    regions_ca: state.regions_ca,
    regions_us: state.regions_us,
    localities_ca: state.localities_ca,
    localities_us: state.localities_us,
});

export default connect(mapStateToProps, null)(withRouter(SearchForm));