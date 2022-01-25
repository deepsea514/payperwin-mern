import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";

import ArticleHome from '../components/articlehome';
import Article from "../components/article";
import ArticleCategories from '../components/articlecategories';
import ArticleCategory from "../components/articlecategory";

class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
        const title = 'Articles';
        setTitle({ pageTitle: title })
    }

    render() {
        const { intl } = this.props;

        return (
            <Switch>
                <Route path="/articles/category/:categoryname" component={ArticleCategory} />
                <Route path="/articles/category" render={ArticleCategories} />
                <Route path="/articles/:permalink" component={Article} />
                <Route path="/articles" component={ArticleHome} />
            </Switch>
        );
    }
}

export default injectIntl(Articles);