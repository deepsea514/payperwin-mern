
import React, { Component } from 'react';
import { setMeta } from '../libs/documentTitleBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import DocumentMeta from 'react-document-meta';
import ArticleHome from '../components/articlehome';
import Article from "../components/article";
import ArticleCategories from '../components/articlecategories';
import ArticleCategory from "../components/articlecategory";

class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metaData: null
        }
    }

    componentDidMount() {
        const title = 'Articles';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
    }

    render() {
        const { intl } = this.props;
        const { metaData } = this.state;

        return (
            <div>
                {metaData && <DocumentMeta {...metaData} />}
                <Switch>
                    <Route path="/articles/category/:categoryname" component={ArticleCategory} />
                    <Route path="/articles/category" render={ArticleCategories} />
                    <Route path="/articles/:permalink/:id" component={Article} />
                    <Route path="/articles" component={ArticleHome} />
                </Switch>
            </div>
        );
    }
}

export default injectIntl(Articles);