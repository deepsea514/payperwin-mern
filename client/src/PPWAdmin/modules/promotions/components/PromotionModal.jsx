import * as Yup from "yup";
import { Formik } from "formik";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import CustomDatePicker from "../../../../components/customDatePicker";
import config from "../../../../../../config.json";
const PromotionTypes = config.PromotionTypes;
const PromotionFor = config.PromotionFor;

export default class PromotionModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initialValues: props.initialValues ? { ...props.initialValues } : {
                name: '',
                description: '',
                expiration_date: '',
                type: '',
                number_of_usage: 0,
                usage_limit: 0,
                usage_for: "",
                value: 0,
            },
            promotionSchema: Yup.object().shape({
                name: Yup.string()
                    .min(3, "Name should be longer than 3 characters")
                    .required("Name field is required."),
                description: Yup.string()
                    .min(10, "Description should be longer than 10 characters")
                    .required("Description field is required."),
                expiration_date: Yup.date()
                    .required("Expiration Date field is required."),
                type: Yup.string()
                    .required("Type field is required."),
                number_of_usage: Yup.number()
                    .notOneOf([0], "This field should be -1 or positive integer")
                    .required("This field is required"),
                usage_limit: Yup.number()
                    .moreThan(0, "This field should be more than 0")
                    .required("This field is required"),
                usage_for: Yup.string()
                    .required("Use For field is required."),
                value: Yup.number()
            }),
        }
    }

    renderType = () => {
        return Object.keys(PromotionTypes).map(function (key, index) {
            return <option key={key} value={key}>{PromotionTypes[key].name}</option>
        });
    }

    renderFor = () => {
        return Object.keys(PromotionFor).map(function (key, index) {
            return <option key={key} value={key}>{PromotionFor[key]}</option>
        });
    }

    render() {
        const { show, onHide, onSubmit, title } = this.props;
        const { initialValues, promotionSchema } = this.state;
        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                {show && <Formik
                    initialValues={initialValues}
                    validationSchema={promotionSchema}
                    onSubmit={onSubmit}>
                    {(formik) => (
                        <form onSubmit={formik.handleSubmit}>
                            <Modal.Body>
                                <div className="form-group">
                                    <label>Name<span className="text-danger">*</span></label>
                                    <input name="name" placeholder="Enter Promotion Name"
                                        className={`form-control ${getInputClasses(formik, "name")}`}
                                        {...formik.getFieldProps("name")}
                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className="invalid-feedback">
                                            {formik.errors.name}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="form-group">
                                    <label>Description<span className="text-danger">*</span></label>
                                    <textarea name="description" placeholder="Enter Description"
                                        className={`form-control ${getInputClasses(formik, "description")}`}
                                        rows={2}
                                        {...formik.getFieldProps("description")}
                                    />
                                    {formik.touched.description && formik.errors.description ? (
                                        <div className="invalid-feedback">
                                            {formik.errors.description}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="form-group">
                                    <label>Expiration Date<span className="text-danger">*</span></label>
                                    <CustomDatePicker
                                        name="expiration_date"
                                        className={`form-control ${getInputClasses(formik, "expiration_date")}`}
                                        wrapperClassName="input-group"
                                        selected={formik.values.expiration_date}
                                        {...formik.getFieldProps("expiration_date")}
                                        {...{
                                            onChange: (expiration_date) => {
                                                formik.setFieldTouched("expiration_date", true);
                                                formik.setFieldError("expiration_date", false);
                                                formik.setFieldValue("expiration_date", expiration_date);
                                            }
                                        }}
                                        placeholder="Enter Birthday"
                                        isInvalid={formik.touched.expiration_date && formik.errors.expiration_date !== undefined}
                                        required
                                        years={[2021, 2022, 2023, 2024, 2025]}
                                    />
                                    {formik.touched.expiration_date && formik.errors.expiration_date ? (
                                        <div className="invalid-feedback">
                                            {formik.errors.expiration_date}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Type<span className="text-danger">*</span></label>
                                        <select name="type" placeholder="Enter Type"
                                            className={`form-control ${getInputClasses(formik, "type")}`}
                                            {...formik.getFieldProps("type")}
                                        >
                                            <option value="">Choose Type...</option>
                                            {this.renderType()}
                                        </select>
                                        {formik.touched.type && formik.errors.type ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.type}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Usage per Same Customer<span className="text-danger">*</span></label>
                                        <input name="number_of_usage" placeholder=""
                                            className={`form-control ${getInputClasses(formik, "number_of_usage")}`}
                                            {...formik.getFieldProps("number_of_usage")}
                                        />
                                        {formik.touched.number_of_usage && formik.errors.number_of_usage ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.number_of_usage}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>No. of Unique Redemptions<span className="text-danger">*</span></label>
                                        <input name="usage_limit" placeholder=""
                                            className={`form-control ${getInputClasses(formik, "usage_limit")}`}
                                            {...formik.getFieldProps("usage_limit")}
                                        />
                                        {formik.touched.usage_limit && formik.errors.usage_limit ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.usage_limit}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Use For<span className="text-danger">*</span></label>
                                        <select name="usage_for"
                                            className={`form-control ${getInputClasses(formik, "usage_for")}`}
                                            {...formik.getFieldProps("usage_for")}
                                        >
                                            <option value="">Use For...</option>
                                            {this.renderFor()}
                                        </select>
                                        {formik.touched.usage_for && formik.errors.usage_for ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.usage_for}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                {formik.values.type == '_100_SignUpBonus' && <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Maximum match amount</label>
                                        <input name="value" placeholder="Enter match amount"
                                            className={`form-control ${getInputClasses(formik, "value")}`}
                                            {...formik.getFieldProps("value")}
                                        />
                                        {formik.touched.value && formik.errors.value ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.value}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>}
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