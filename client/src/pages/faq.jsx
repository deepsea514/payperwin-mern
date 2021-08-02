
import React, { Component } from 'react';
import { setMeta } from '../libs/documentTitleBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import axios from 'axios';
import FaqSubject from "../components/faq_subject";
import FaqHome from "../components/faq_home";
import FaqArticle from "../components/faq_article";
import FaqSearch from "../components/faq_search";
import DocumentMeta from 'react-document-meta';

const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Faq extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            faq_subjects: null,
            metaData: null
        }
    }

    componentDidMount() {
        const title = 'FAQ';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })

        this.setState({ loading: true });
        axios.get(`${serverUrl}/faqs`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ loading: false, faq_subjects: data });
            })
            .catch(() => {
                this.setState({ loading: false, faq_subjects: null });
            })
    }

    render() {
        const { intl } = this.props;
        const { loading, faq_subjects, metaData } = this.state;

        return (
            <div className="col-in faq">
                {metaData && <DocumentMeta {...metaData} />}
                <section className="help-center">
                    <div className="hc-search">
                        <div className="hc-search-c">
                            <div className="heading">
                                <h2>How can we help you today?</h2>
                            </div>
                            <center>
                                <form className="hc-search-form" autoComplete="off" id="hc-search-form" action="/faq/search">
                                    <div className="hc-search-input">
                                        <label htmlFor="support-search-input" className="hide">Enter your search term here...</label>
                                        <input placeholder="Enter your search term here..." type="text" name="term" className="special ui-autoComplete-input" rel="page-search" id="support-search-input" autoComplete="off" />
                                    </div>
                                    <div className="hc-search-button" id="help_pages_search_button">
                                        <button className="btn btn-primary" type="submit" autoComplete="off">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </div>
                                </form>
                            </center>
                        </div>
                    </div>

                    <section className="category-container">
                        {faq_subjects && faq_subjects.map(faq_subject => (
                            <div className="categories" key={faq_subject._id}>
                                <Link to={`/faq/subjects/${faq_subject._id}`}>{faq_subject.title}</Link>
                            </div>
                        ))}
                    </section>
                </section>

                <section className="main faq-content rounded-3" style={{ display: "block" }}>
                    <Switch>
                        <Route path="/faq/subjects/:id" component={FaqSubject} />
                        <Route path="/faq/article/:id-:content" component={FaqArticle} />
                        <Route path="/faq/search" component={FaqSearch} />
                        <Route path="/faq" component={FaqHome} />
                    </Switch>
                </section>
            </div>
        );
    }
}

export default injectIntl(Faq);