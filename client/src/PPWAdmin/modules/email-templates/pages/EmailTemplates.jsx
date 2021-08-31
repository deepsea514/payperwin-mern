import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as email_templates from "../redux/reducers";

class EmailTemplates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const { getEmailTemplatesAction } = this.props;
        getEmailTemplatesAction();
    }

    tableBody = () => {
        const { email_templates, loading } = this.props;

        if (loading) {
            return (
                <tr>
                    <td colSpan="5" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (email_templates.length == 0) {
            return (
                <tr>
                    <td colSpan="5" align="center">
                        <h3>No Email Templates</h3>
                    </td>
                </tr>
            );
        }

        return email_templates.map((email, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{email.title}</td>
                <td>{email.trigger}</td>
                <td>Client</td>
                <td><Link to={`/edit/${email.title}`} ><i className="fas fa-edit"></i></Link></td>
            </tr>
        ));
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Email Templates</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link to="/create" className="btn btn-success font-weight-bolder font-size-sm">
                                    <i className="far fa-envelope-open"></i>&nbsp; Add New Template
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Trigger</th>
                                            <th scope="col">To</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    email_templates: state.email_templates.email_templates,
    loading: state.email_templates.loading,
})

export default connect(mapStateToProps, email_templates.actions)(EmailTemplates)