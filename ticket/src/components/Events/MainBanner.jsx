import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getCategoryOptions } from '../../lib/getCategoryOptions';
import { getCountryName } from '../../lib/getCountryName';

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
        const {
            location, localities_ca, localities_us, regions_ca, regions_us,
            categories, history
        } = this.props;
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
            const { match: { params: { country, region, locality } } } = this.props;
            if (!country || !['ca', 'us'].includes(country)) {
                history.push("/error-404");
                return;
            }
            const countryName = getCountryName(country);
            if (region) {
                breadcrumbs.push({ path: '/places/' + country, label: countryName });
                const regions = country === 'ca' ? regions_ca : regions_us;
                const region_key = Object.keys(regions).find(key => regions[key].slug === region);
                if (!region_key) {
                    history.push("/error-404");
                    return;
                }
                if (locality) {
                    breadcrumbs.push({ path: '/places/' + country + '/' + region, label: regions[region_key].name });
                    const localities = country === 'ca' ? localities_ca : localities_us;
                    if (localities[region_key]) {
                        const existing = localities[region_key].find(locality_ => locality_.slug === locality);
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
                    breadcrumbs.push({ label: regions[region_key].name });
                }
            } else {
                breadcrumbs.push({ label: countryName });
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
    regions_ca: state.regions_ca,
    regions_us: state.regions_us,
    localities_ca: state.localities_ca,
    localities_us: state.localities_us,
});

export default connect(mapStateToProps, null)(withRouter(MainBanner));