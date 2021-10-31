import React from "react"
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import * as credits from "../redux/reducers";
import dateformat from "dateformat";
import CustomPagination from "../../../components/CustomPagination.jsx";

class Credits extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
        }
    }

    componentDidMount() {
        const { getCreditsAction } = this.props;
        getCreditsAction();
    }

    tableBody = () => {
        const { credits, loading } = this.props;

        if (loading) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (credits.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Credits</h3>
                    </td>
                </tr>
            );
        }

        // return wager_feeds.map((bet, index) => (
        //     return 
        // ));
    }

    onPageChange = (page) => {
        const { getCreditsAction } = this.props;
        getCreditsAction(page);
    }

    render() {
        const { perPage } = this.state;
        const { total, currentPage } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Line of Credits</h3>
                            </div>
                            <div className="card-toolbar">
                                
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Customer</th>
                                            <th scope="col">Credit Available</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                            </div>
                            <CustomPagination
                                className="pagination"
                                currentPage={currentPage - 1}
                                totalPages={totalPages}
                                showPages={7}
                                onChangePage={(page) => this.onPageChange(page + 1)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    credits: state.credits.credits,
    loading: state.credits.loading,
    total: state.credits.total,
    currentPage: state.credits.currentPage,
})

export default connect(mapStateToProps, credits.actions)(Credits)