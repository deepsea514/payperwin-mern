import React from 'react';
import Footer from "../components/Common/Footer";
import MainBanner from '../components/Performers/MainBanner';
import GoTop from '../components/Shared/GoTop';
import { scrollToTop } from '../lib/scrollToTop';
import { getPerformers } from '../redux/services';
import PerformerList from '../components/Performers/PerformerList';
import SearchForm from '../components/Performers/SearchForm';

class Performers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            page: 1,
            total: 0,
            performers: [],
            filter: {}
        }
    }
    initializeFilter = (filter) => {
        this.setState({ filter }, this.loadPerformers);
    }

    loadPerformers = (page = 1) => {
        const { filter } = this.state;
        scrollToTop();
        this.setState({ loading: true })
        getPerformers(filter, page)
            .then(({ data }) => {
                const { success, performers, total, page } = data;
                if (success) {
                    this.setState({
                        loading: false,
                        page: page,
                        total: total,
                        performers: performers
                    });
                } else {
                    this.setState({
                        loading: false,
                        page: 1,
                        total: 0,
                        performers: []
                    });
                }
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    page: 1,
                    total: 0,
                    performers: []
                });
            })
    }

    render() {
        const { page, loading, total, performers } = this.state;
        return (
            <React.Fragment>
                <MainBanner />
                <SearchForm initializeFilter={this.initializeFilter} />
                <PerformerList loading={loading}
                    page={page}
                    total={total}
                    performers={performers}
                    loadPerformers={this.loadPerformers} />
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Performers;