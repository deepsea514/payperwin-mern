import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { getInputClasses2 } from "../../../../helpers/getInputClasses";
import { Modal } from "react-bootstrap";

export default class FixParlayBetScoreModal extends React.Component {
    constructor(props) {
        super(props);
        const parlayQuery = props.parlayQuery.reduce((prev, current) => {
            const exist = prev.find(query => {
                return query.lineQuery.eventId == current.lineQuery.eventId &&
                    query.lineQuery.subtype == current.lineQuery.subtype;
            });
            return exist ? prev : [...prev, current];
        }, []);

        this.state = {
            parlayQuery: parlayQuery,
            initialValues: parlayQuery.map(() => ({ teamAScore: 0, teamBScore: 0 })),
            scoreSchema: Yup.array().of(Yup.object().shape({
                teamAScore: Yup.number().required('Please input the score.'),
                teamBScore: Yup.number().required('Please input the score.')
            }))
        }
    }

    onSubmit = (values, formik) => {
        const { onSubmit } = this.props;
        const { parlayQuery } = this.state;
        const newValues = parlayQuery.map((query, index) => {
            return {
                lineQuery: query.lineQuery,
                score: values[index]
            }
        });
        onSubmit(newValues, formik);
    }

    getGameTypeName = (subtype) => {
        switch (subtype) {
            case 'first_half':
                return '1st Half: ';
            case 'second_half':
                return '2nd Half: ';
            case 'first_quarter':
                return '1st Quarter: ';
            case 'second_quarter':
                return '2nd Quarter: ';
            case 'third_quarter':
                return '3rd Quarter: ';
            case 'forth_quarter':
                return '4th Quarter: ';
            case 'fifth_innings':
                return '5th Innings: ';
            case null:
            default:
                return 'Pick';
        }
    }

    render() {
        const { scoreSchema, initialValues, parlayQuery } = this.state;
        const { show, onHide } = this.props;
        return (
            <Modal show={show} onHide={onHide}>
                <Formik
                    validationSchema={scoreSchema}
                    initialValues={initialValues}
                    onSubmit={this.onSubmit}
                >
                    {(formik) => {
                        const { errors, touched, isSubmitting, getFieldProps } = formik;
                        return <Form>
                            <Modal.Header closeButton>
                                <Modal.Title>Fix Parlay Bet Score</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {parlayQuery.map((query, index) => {
                                    const { teamA: { name: teamA }, teamB: { name: teamB }, lineQuery: { subtype } } = query;
                                    return (
                                        <div className="form-row mb-0" key={index}>
                                            <div className="form-group col-md-12 mb-0">
                                                <label>{teamA} vs {teamB} : {this.getGameTypeName(subtype)}</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>{teamA} Score <span className="text-danger">*</span></label>
                                                <input name="teamAScore" placeholder="Team A Score"
                                                    className={`form-control ${getInputClasses2(formik, index, "teamAScore")}`}
                                                    {...getFieldProps(index + ".teamAScore")}
                                                />
                                                {errors &&
                                                    errors[index] &&
                                                    errors[index].teamAScore &&
                                                    touched &&
                                                    touched[index] &&
                                                    touched[index].teamAScore && (
                                                        <div className="invalid-feedback">
                                                            {errors[index].teamAScore}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>{teamB} Score <span className="text-danger">*</span></label>
                                                <input name="teamBScore" placeholder="Team B Score"
                                                    className={`form-control ${getInputClasses2(formik, index, "teamBScore")}`}
                                                    {...getFieldProps(index + ".teamBScore")}
                                                />
                                                {errors &&
                                                    errors[index] &&
                                                    errors[index].teamBScore &&
                                                    touched &&
                                                    touched[index] &&
                                                    touched[index].teamBScore && (
                                                        <div className="invalid-feedback">
                                                            {errors[index].teamBScore}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    )
                                })}
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