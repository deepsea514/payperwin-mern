import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import { Modal } from "react-bootstrap";
import Select from 'react-select';

export default class RemoveGameModal extends React.Component {
    constructor(props) {
        super(props);
        const parlayQuery = props.bet.parlayQuery.filter((query, index) => {
            return props.bet.parlayQuery.findIndex(query2 => query2.lineQuery.eventId == query.lineQuery.eventId) == index
        });
        this.state = {
            options: parlayQuery.map(query => ({
                value: query.lineQuery.eventId,
                label: `${query.teamA.name} VS ${query.teamB.name}`
            })),
            removeSchema: Yup.object().shape({
                removeIds: Yup.array().of(Yup.object())
                    .min(1, "You should select at least an event.")
            }),
            initialValues: {
                cancelIds: []
            },
        }
    }

    render() {
        const { removeSchema, initialValues, options } = this.state;
        const { show, onHide, onSubmit } = this.props;
        return (
            <Modal show={show} onHide={onHide}>
                <Formik
                    validationSchema={removeSchema}
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                >
                    {(formik) => {
                        const { values, errors, touched, isSubmitting, getFieldProps, setFieldValue, setFieldTouched, setFieldError } = formik;
                        return <Form>
                            <Modal.Header closeButton>
                                <Modal.Title>Remove Game from Parlay Bet</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <Select
                                        className={`basic-single ${getInputClasses(formik, "removeIds")}`}
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        isMulti
                                        options={options}
                                        name="removeIds"
                                        value={values.removeIds}
                                        {...getFieldProps("removeIds")}
                                        {...{
                                            onChange: (removeIds) => {
                                                if (!removeIds) return;
                                                setFieldValue("removeIds", removeIds);
                                                setFieldTouched("removeIds", true);
                                                setFieldError("removeIds", false);
                                            },

                                        }}
                                    />
                                    {touched.removeIds && errors.removeIds ? (
                                        <div className="invalid-feedback">
                                            {errors.removeIds}
                                        </div>
                                    ) : null}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button type="submit" className="btn btn-primary mr-2" disabled={isSubmitting}>Submit</button>
                                <button onClick={onHide} className="btn btn-secondary">Cancel</button>
                            </Modal.Footer>
                        </Form>
                    }}
                </Formik>
            </Modal>
        )
    }
}