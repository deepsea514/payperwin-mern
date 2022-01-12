import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as frontend from "../redux/reducer";
import { withRouter } from 'react-router-dom';

class Search extends Component {
    onSearch = (evt) => {
        const { search, history } = this.props;
        if (evt.key !== 'Enter') return;
        history.push(`/search/${search}`);
    }

    render() {
        const { search, setSearch } = this.props;
        return (
            <div className="search-box">
                <i className="fa fa-search" aria-hidden="true"></i>
                <input
                    className="searh-f"
                    type="search"
                    placeholder="Search"
                    value={search}
                    onChange={(evt) => setSearch(evt.target.value)}
                    onKeyDown={this.onSearch}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    search: state.frontend.search,
});

export default connect(mapStateToProps, frontend.actions)(withRouter(Search))