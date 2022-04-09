import React from 'react';
import Footer from "../components/Common/Footer";
import Loader from '../components/Common/Loader';
import MainBanner from '../components/Performer/MainBanner';
import NotFound from '../components/Performer/NotFound';
import PerformerDetail from '../components/Performer/PerformerDetail';
import { getPerformerDetail } from '../redux/services';
import GoTop from '../components/Shared/GoTop';

class Performer extends React.Component {
    constructor(props) {
        super(props);
        const { match: { params: { performer_slug } } } = this.props;
        this.state = {
            performer_slug: performer_slug,
            loading: false,
            performer: null,
        }
    }

    componentDidMount() {
        const { performer_slug } = this.state;
        this.setState({ loading: true });
        getPerformerDetail(performer_slug)
            .then(({ data }) => {
                const { success, performer } = data;
                if (success) {
                    this.setState({ performer, loading: false });
                } else {
                    this.setState({ performer: null, loading: false });
                }
            })
            .catch(() => {
                this.setState({ performer: null, loading: false });
            })
    }

    render() {
        const { performer, loading } = this.state;
        return (
            <React.Fragment>
                <MainBanner title={loading ? 'Loading ...' : (
                    performer ? performer.name : 'Performer Not Found'
                )} />
                {loading && <div className="container my-5 py-5">
                    <Loader />
                </div>}
                {!loading && !performer && <NotFound />}
                {performer && <PerformerDetail performer={performer} />}
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Performer;