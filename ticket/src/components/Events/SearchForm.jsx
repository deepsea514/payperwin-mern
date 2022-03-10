import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

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

class SearchForm extends React.Component {
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

    getCities = (query, cb) => {
        cb([]);
    }

    render() {
        const { query, state, city, venue, time, category, loadingCity, loadingVenue } = this.state;
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
                            options={[]}
                            placeholder="All States"
                            value={state}
                            onChange={(state) => this.setState({ state })}
                            styles={customStyles}
                            maxMenuHeight={200}
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2 mt-md-0'>
                        <AsyncSelect
                            className="form-control p-0"
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
                        /></div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2 mt-lg-0'>
                        <AsyncSelect
                            className="form-control p-0"
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
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2'>
                        <Select
                            className="form-control p-0"
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
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-2'>
                        <Select
                            className="form-control p-0"
                            classNamePrefix="select"
                            name="category"
                            options={[]}
                            placeholder="All Categories"
                            styles={customStyles}
                            value={category}
                            maxMenuHeight={200}
                            onChange={(category) => this.setState({ category })}
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

export default SearchForm;