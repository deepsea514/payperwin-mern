import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import { Dropdown, DropdownButton, Modal, Button } from "react-bootstrap";

export default class FixBetScoreModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scoreSchema: Yup.object().shape({
                teamAScore: Yup.number().required("Team A Score is required."),
                teamBScore: Yup.number().required("Team B Score is required."),
            }),
            initialValues: {
                teamAScore: 0,
                teamBScore: 0,
            },
            teamA: props.teamA,
            teamB: props.teamB
        }
    }

    render() {
        const { scoreSchema, initialValues, teamA, teamB } = this.state;
        const { show, onHide, onSubmit } = this.props;
        return (
            <Modal show={show} onHide={onHide}>
                <Formik
                    validationSchema={scoreSchema}
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                >
                    {(formik) => {
                        const { errors, touched, isSubmitting, getFieldProps } = formik;
                        return <Form>
                            <Modal.Header closeButton>
                                <Modal.Title>Fix Bet Score</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label>{teamA} Score <span className="text-danger">*</span></label>
                                    <input name="teamAScore" placeholder="Team A Score"
                                        className={`form-control ${getInputClasses(formik, "teamAScore")}`}
                                        {...getFieldProps("teamAScore")}
                                    />
                                    {errors &&
                                        errors &&
                                        errors.teamAScore &&
                                        touched &&
                                        touched.teamAScore && (
                                            <div className="invalid-feedback">
                                                {errors.teamAScore}
                                            </div>
                                        )}
                                </div>

                                <div className="form-group">
                                    <label>{teamB} Score <span className="text-danger">*</span></label>
                                    <input name="teamBScore" placeholder="Team B Score"
                                        className={`form-control ${getInputClasses(formik, "teamBScore")}`}
                                        {...getFieldProps("teamBScore")}
                                    />
                                    {errors &&
                                        errors &&
                                        errors.teamBScore &&
                                        touched &&
                                        touched.teamBScore && (
                                            <div className="invalid-feedback">
                                                {errors.teamBScore}
                                            </div>
                                        )}
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