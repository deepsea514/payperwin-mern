
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import dateformat from "dateformat";
import axios from 'axios';
import ArticleWrapper from './articlewrapper';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[window.location.host].appUrl;

class ArticleHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            categories: [],
        }
    }

    componentDidMount() {
        axios.get(`${serverUrl}/articles/home`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ articles: data });
            })
            .catch(() => {
                this.setState({ articles: null });
            })
        axios.get(`${serverUrl}/article-category`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ categories: data });
            })
            .catch((error) => {
                this.setState({ categories: [] });
            })
    }

    render() {
        const { articles, categories } = this.state;
        return (
            <ArticleWrapper
                showMore={true}
                showCategories={false}
                categories={categories}
                articles={articles}
                title={null} />
        );
    }
}

export default injectIntl(ArticleHome);