import React, { Component } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class AddPromotionBannerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: {
                priority: 1,
                file: null
            },
            bannerSchema: Yup.object().shape({
                priority: Yup.number().default(1),
                file: Yup.mixed().required(),
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
                                <div className="form-group">
                                    <label>Banner<span className="text-danger">*</span></label>
                                    <input
                                        type="file"
                                        name="file"
                                        className={`form-control ${getInputClasses(formik, "file")}`}
                                        onChange={(evt) => {
                                            formik.setFieldTouched('file', true);
                                            formik.setFieldValue('file', evt.target.files[0])
                                        }}
                                        accept="image/x-png,image/gif,image/jpeg,video/mp4,video/avi"
                                    />
                                    {formik.touched.file && formik.errors.file ? (
                                        <div className="invalid-feedback">
                                            {formik.errors.file}
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