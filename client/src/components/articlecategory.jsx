
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import ArticleWrapper from './articlewrapper';
import axios from 'axios';
import config from '../../../config.json';
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;


class ArticleCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            articles: []
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        const { match: { params: { categoryname } } } = this.props;
        const { match: { params: { categoryname: prevCategory } } } = prevProps;
        const categoryChanged = (categoryname !== prevCategory);
        if (categoryChanged) {
            this.getData();
        }
    }

    getData = () => {
        const { match: { params: { categoryname } } } = this.props;
        axios.get(`${serverUrl}/article-category`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ categories: data });
            })
            .catch((error) => {
                this.setState({ categories: [] });
            })

        axios.get(`${serverUrl}/articles/categories/${categoryname}`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ articles: data });
            })
            .catch((error) => {
                this.setState({ articles: [] });
            })
    }

    render() {
        const { intl, match: { params: { categoryname } } } = this.props;
        const { categories, articles } = this.state;
        return (
            <div>
                <div className="category-intro-container">
                    <div className="global-width">
                        <h1 className="default">{categoryname}</h1>
                        <p data-nsfw-filter-status="swf">
                            Explore popular tags for this category or  <Link to="/articles/category">Search for other categories</Link>
                        </p>
                    </div>
                </div>
                <ArticleWrapper
                    showMore={true}
                    showCategories={true}
                    categories={categories}
                    articles={articles}
                    title={`${categoryname} RESOURCE FEED`} />
            </div>
        );
    }
}

export default injectIntl(ArticleCategory);