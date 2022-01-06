
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import { getFAQSubject } from '../redux/services';

class FaqSubject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            faq_subject: null
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.loadSubject(id);
    }

    getSnapshotBeforeUpdate(prevProps) {
        return { reloadRequired: prevProps.match.params.id !== this.props.match.params.id };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot.reloadRequired) {
            const { id } = this.props.match.params;
            this.loadSubject(id);
        }
    }

    loadSubject = (id) => {
        this.setState({ loading: true });
        getFAQSubject(id)
            .then(({ data }) => {
                this.setState({ loading: false, faq_subject: data });
            })
            .catch(() => {
                this.setState({ loading: false, faq_subject: null });
            });
    }

    getURLfromTitle = (title) => {
        title = title.toLowerCase();
        title = title.replace(/[^a-zA-Z ]/g, "");
        title = title.replaceAll(" ", "-");
        return title;
    }

    render() {
        const { intl } = this.props;
        const { loading, faq_subject } = this.state;
        return (
            <>
                <Link to="/faq" className="link-help-home"><FormattedMessage id="COMPONENTS.FAQ.HOME" /></Link>

                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}

                {!loading && !faq_subject && <div className="cs-s">
                    <h3 className="heading"><FormattedMessage id="PAGES.NODATA.AVAILABLE" /></h3>
                </div>}

                {faq_subject && <div className="cs-s">
                    <h3 className="heading">{faq_subject.title} <span className="text-danger">[{faq_subject.items.length}]</span></h3>
                    <br />
                    <div className="cs-g-c">
                        <div className="row">
                            {faq_subject.items.map(item => (
                                <div className="col-12 col-sm-6 col-md-4" key={item._id}>
                                    <section className="cs-g article-list">
                                        <div className="list-lead">
                                            {item.title}
                                        </div>
                                        <div className="list-desc" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                        <Link className="list-read-more" to={`/faq/article/${item._id}-${this.getURLfromTitle(item.title)}`}>
                                            <FormattedMessage id="PAGES.READMORE" />
                                        </Link>
                                    </section>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}
            </>
        );
    }
}

export default injectIntl(FaqSubject);