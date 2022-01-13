
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getArticleCategories, getArticles } from '../redux/services';
import ArticleWrapper from './articlewrapper';

class ArticleHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            categories: [],
            loading: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        getArticles()
            .then(({ data }) => {
                this.setState({ articles: data, loading: false });
            })
            .catch(() => {
                this.setState({ articles: null, loading: false });
            })
        getArticleCategories()
            .then(({ data }) => {
                this.setState({ categories: data });
            })
            .catch((error) => {
                this.setState({ categories: [] });
            })
    }

    render() {
        const { articles, categories, loading } = this.state;
        return (
            <ArticleWrapper
                loading={loading}
                showMore={true}
                showCategories={false}
                categories={categories}
                articles={articles}
                title={null} />
        );
    }
}

export default injectIntl(ArticleHome);