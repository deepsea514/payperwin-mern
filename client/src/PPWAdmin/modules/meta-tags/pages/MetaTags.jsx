import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as meta_tags from "../redux/reducers";

class MetaTags extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    tableBody = () => {
        const { pages } = this.props;

        if (pages.length == 0) {
            return (
                <tr>
                    <td colSpan="5" align="center">
                        <h3>No Pages</h3>
                    </td>
                </tr>
            );
        }

        return pages.map((page, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{page.title}</td>
                <td>{page.path}</td>
                <td><Link to={`/edit/${page.title}`} ><i className="fas fa-edit"></i></Link></td>
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
                                <h3 className="card-label">Meta tags in pages</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Page Name</th>
                                            <th scope="col">Path</th>
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
    pages: state.meta_tags.pages,
})

export default connect(mapStateToProps, meta_tags.actions)(MetaTags)