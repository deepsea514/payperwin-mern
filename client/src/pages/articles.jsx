
import React, { Component } from 'react';
import { setMeta } from '../libs/documentTitleBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import axios from 'axios';
import DocumentMeta from 'react-document-meta';
import ArticleHome from '../components/articlehome';
import ArticleArchive from '../components/articlearchive';

const config = require('../../../config.json');
const serverUrl = config.appUrl;

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
        const { loading, faq_subjects, metaData } = this.state;

        return (
            <div>
                {metaData && <DocumentMeta {...metaData} />}
                <Switch>
                    <Route path="/articles/category/:categoryname" component={ArticleHome} />
                    <Route path="/articles/category" component={ArticleHome} />
                    <Route path="/articles/archive" component={ArticleArchive} />
                    <Route path="/articles" component={ArticleHome} />
                </Switch>
            </div>
        );
    }
}

export default injectIntl(Articles);