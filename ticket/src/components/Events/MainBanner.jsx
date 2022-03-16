import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getCategoryOptions } from '../../lib/getCategoryOptions';

class MainBanner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            breadcrumbs: [
                { path: '/', label: 'Home' },
                { label: 'Events' },
            ],
            title: 'Search Events'
        }
    }

    componentDidMount() {
        this.getInitialValues();
    }

    componentDidUpdate(prevProps) {
        const { location: prevLocation } = prevProps;
        const { location } = this.props;
        if (location.pathname !== prevLocation.pathname) {
            this.getInitialValues();
        }
    }

    getCategoryTree = (categories, category, category_tree) => {
        for (const category_ of categories) {
            if (category_.slug === category.value) {
                category_tree.push({ label: category_.name });
                return true;
            }
            if (category_.sub_categories &&
                category_.sub_categories.length &&
                this.getCategoryTree(category_.sub_categories, category, category_tree)
            ) {
                category_tree.push({ path: '/categories/' + category_.slug, label: category_.name })
                return true;
            }
        }
    }

    getInitialValues = () => {
        const { location, localities_ca, regions, categories, history } = this.props;
        const { pathname } = location;
        const category_options = [];
        getCategoryOptions(categories, category_options);
        let breadcrumbs = [
            { path: '/', label: 'Home' },
            { label: 'Events' },
        ];
        let title = 'Search Events'

        if (pathname.startsWith("/categories")) {
            const { match: { params: { category_slug } } } = this.props;
            const category = category_options.find(category_ => category_.value === category_slug);
            if (!category) {
                history.push("/error-404");
                return;
            }
            const category_tree = [];
            this.getCategoryTree(categories, category, category_tree);
            category_tree.reverse();
            title = category.label;
            breadcrumbs = [
                { path: '/', label: 'Home' },
                ...category_tree
            ]
        }

        if (pathname.startsWith("/places")) {
            breadcrumbs = [{ path: '/', label: 'Home' }];
            const { match: { params: { region, locality } } } = this.props;
            const region_name = regions[region];
            if (!region_name) {
                history.push("/error-404");
                return;
            }
            if (locality) {
                breadcrumbs.push({ path: '/places/' + region, label: region_name });
                if (localities_ca[region]) {
                    const existing = localities_ca[region].find(locality_ => locality_ === locality);
                    if (!existing) {
                        history.push("/error-404");
                        return;
                    }
                    breadcrumbs.push({ label: locality });
                } else {
                    history.push("/error-404");
                    return;
                }
            } else {
                breadcrumbs.push({ label: region_name });
            }
        }

        this.setState({ title, breadcrumbs });
    }

    render() {
        const { title, breadcrumbs } = this.state;
        return (
            <div className="page-title-area item-bg1">
                <div className="container">
                    <h1>{title}</h1>
                    {/* <span>Listen to the Event Speakers</span> */}
                    <ul>
                        {breadcrumbs.map((breadcrumb, index) => (
                            breadcrumb.path ?
                                <li key={index}><Link to={breadcrumb.path}>{breadcrumb.label}</Link></li> :
                                <li key={index}>{breadcrumb.label}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    categories: state.categories,
    regions: state.regions,
    localities_ca: state.localities_ca,
});

export default connect(mapStateToProps, null)(withRouter(MainBanner));