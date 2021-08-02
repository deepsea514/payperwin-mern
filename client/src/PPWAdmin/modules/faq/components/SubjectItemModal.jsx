import React, { Component } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Modal, Button } from "react-bootstrap";
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class SubjectItemModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialValues: {
                title: props.title ? props.title : '',
                content: props.content ? props.content : '',
            },

            FAQSubjectSchema: Yup.object().shape({
                title: Yup.string()
                    .required("Please enter FAQ Item Title."),
                content: Yup.string()
                    .required('Please enter FAQ Item Content.'),
            }),
        }
    }

    render() {
        const { FAQSubjectSchema, initialValues } = this.state;
        const { onHide, show, onSubmit } = this.props;

        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Add FAQ Item</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={initialValues}
                    validationSchema={FAQSubjectSchema}
                    onSubmit={onSubmit}>
                    {
                        (formik) => {
                            return <form onSubmit={formik.handleSubmit}>
                                <Modal.Body>
                                    <div className="form-group">
                                        <label>Title<span className="text-danger">*</span></label>
                                        <input name="title" placeholder="Enter title"
                                            className={`form-control ${getInputClasses(formik, "title")}`}
                                            {...formik.getFieldProps("title")}
                                        />
                                        {formik.touched.title && formik.errors.title ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.title}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Content<span className="text-danger">*</span></label>
                                        <textarea name="content" placeholder="Enter content" rows="6"
                                            className={`form-control ${getInputClasses(formik, "content")}`}
                                            {...formik.getFieldProps("content")}
                                        />
                                        {formik.touched.content && formik.errors.content ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.content}
                                            </div>
                                        ) : null}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="light-primary" onClick={onHide}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                                        Save
                                    </Button>
                                </Modal.Footer>
                            </form>
                        }
                    }
                </Formik>
            </Modal>
        )
    }
}