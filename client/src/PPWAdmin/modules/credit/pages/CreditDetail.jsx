import React from "react"
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../components/CustomPagination.jsx";
import { getCreditDetail } from "../redux/services";
import { Link } from 'react-router-dom';
import numberFormat from "../../../../helpers/numberFormat";
import dateformat from 'dateformat';

class CreditDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: props.match.params.id,
            perPage: 25,
            currentPage: 1,
            total: 0,
            loading: false,
            credits: []
        }
    }

    componentDidMount() {
        const { user_id } = this.state;
        this.getCreditDetail(1, user_id);
    }

    getCreditDetail = (page, user_id) => {
        this.setState({ loading: true, currentPage: page });
        getCreditDetail(page, user_id)
            .then(({ data }) => {
                const { user, data: credits, total } = data;
                this.setState({
                    user: user,
                    credits: credits,
                    total: total,
                    loading: false
                })
            })
            .catch(() => [
                this.setState({
                    user: null,
                    credits: [],
                    total: 0,
                    loading: false
                })
            ])
    }

    tableBody = () => {
        const { credits, loading } = this.state;

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

        return credits.map((credit, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{credit.user.email}</td>
                <td>{dateformat(new Date(credit.createdAt), "yyyy-mm-dd HH:MM")}</td>
                <td>{numberFormat(credit.amount.toFixed(2))}</td>
                <td>{this.getCreditAction(credit.financialtype)}</td>
            </tr>
        ));
    }

    getCreditAction = (type) => {
        switch (type) {
            case 'credit':
                return <span className="label label-lg label-outline-info label-inline font-weight-lighter mr-2">Credit</span>
            case 'debit':
                return <span className="label label-lg label-outline-primary label-inline font-weight-lighter mr-2">Debit</span>
            case 'transfer-in':
                return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Transfer In</span>
            case 'transfer-out':
                return <span className="label label-lg label-outline-danger label-inline font-weight-lighter mr-2">Transfer Out</span>
        }
    }

    onPageChange = (page) => {
        const { user_id } = this.state;
        this.getCreditDetail(page, user_id);
    }

    render() {
        const { perPage, total, currentPage, loading } = this.state;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Line of Credits Detail</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link className="btn btn-success font-weight-bolder font-size-sm" to="/">
                                    Back
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User</th>
                                            <th scope="col">Time</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Action</th>
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

export default CreditDetail