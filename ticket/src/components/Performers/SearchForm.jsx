import React from 'react';
import Select from 'react-select';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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
        const category_options = [];
        getCategoryOptions(categories, category_options);
        this.state = {
            query: '',
            category: null,
            category_options: category_options,
        }
    }

    initializeFilter = () => {
        const { initializeFilter } = this.props;
        const { query, category } = this.state;
        initializeFilter({
            query: query,
            category: category ? category.value : '',
        }, 1);
    }

    componentDidMount() {
        this.initializeFilter();
    }

    render() {
        const {
            query, category_options, category,
        } = this.state;

        return (
            <div className='container py-5'>
                <div className='row'>
                    <div className='col-12 col-sm-6 col-md-4'>
                        <input className='form-control'
                            value={query}
                            onChange={(evt) => this.setState({ query: evt.target.value })}
                            placeholder='What are you looking for?' />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 mt-2 mt-sm-0'>
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
                            isClearable
                        />
                    </div>
                    <div className='col-12 col-sm-12 col-md-4 mt-2 mt-md-0'>
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
});

export default connect(mapStateToProps, null)(withRouter(SearchForm));