import React, { Component } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class EditPromotionBannerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: {
                priority: props.priority,
            },
            bannerSchema: Yup.object().shape({
                priority: Yup.number().default(1),
            }),
        }
    }

    render() {
        const { show, onHide, onSubmit } = this.props;
        const { initialValues, bannerSchema } = this.state;

        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload A Banner</Modal.Title>
                </Modal.Header>
                {show && <Formik
                    initialValues={initialValues}
                    validationSchema={bannerSchema}
                    onSubmit={onSubmit}>
                    {(formik) => (
                        <form onSubmit={formik.handleSubmit}>
                            <Modal.Body>
                                <div className="form-group">
                                    <label>Priority<span className="text-danger">*</span></label>
                                    <input name="priority"
                                        className={`form-control ${getInputClasses(formik, "priority")}`}
                                        {...formik.getFieldProps("priority")}
                                    />
                                    {formik.touched.priority && formik.errors.priority ? (
                                        <div className="invalid-feedback">
                                            {formik.errors.priority}
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
                    )}
                </Formik>}
            </Modal>
        );
    }
}