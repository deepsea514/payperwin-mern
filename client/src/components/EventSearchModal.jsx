import React from "react";
import { FormattedMessage } from 'react-intl';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { searchEvent, searchSports } from "../redux/services";
import dateformat from 'dateformat';

const customStyles = {
    control: (provided, state) => {
        return {
            ...provided,
            background: 'transparent',
        }
    },
    singleValue: (provided, state) => {
        return {
            ...provided,
            color: '#FFF',
            textAlign: 'left'
        }
    },
    input: (provided, state) => {
        return {
            ...provided,
            color: '#FFF',
            textAlign: 'left'
        }
    },
    placeholder: (provided, state) => {
        return {
            ...provided,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#c7c3c7',
            textAlign: 'left'
        }
    },
    menu: (provided, state) => {
        return {
            ...provided,
            color: 'black',
            textAlign: 'left'
        }
    }
}

const CustomOption = (props) => {
    const {
        children,
        className,
        cx,
        getStyles,
        isDisabled,
        isFocused,
        isSelected,
        innerRef,
        innerProps,
        value,
    } = props;
    return (
        <div style={getStyles('option', props)}
            className={cx(
                {
                    option: true,
                    'option--is-disabled': isDisabled,
                    'option--is-focused': isFocused,
                    'option--is-selected': isSelected,
                },
                className
            )}
            ref={innerRef}
            {...innerProps}
        >
            {children} <br />
            {dateformat(value.startTime, 'ddd mmm dd yyyy HH:MM')}
        </div>
    );
};

export default class EventSearchModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            event: null,
            sport: '',
            sportsOptions: [
                { label: 'Soccer', value: 'Soccer' },
                { label: 'American Football', value: 'American Football' },
                { label: 'Baseball', value: 'Baseball' },
                { label: 'Ice Hockey', value: 'Ice Hockey' },
                { label: 'Basketball', value: 'Basketball' },
                { label: 'Tennis', value: 'Tennis' },
            ],
            loadingEvent: false,
        }
    }

    getEvent = (query, cb) => {
        const { sport } = this.state;
        if (!sport) cb([]);
        this.setState({ loadingEvent: true });
        searchEvent(query, sport.value)
            .then(({ data }) => {
                cb(data);
                this.setState({ loadingEvent: false });
            })
            .catch(() => {
                cb([]);
                this.setState({ loadingEvent: false });
            })
    }

    render() {
        const { onClose, onProceed } = this.props;
        const { event, sport, loadingEvent, sportsOptions } = this.state;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div>
                        <b>Search a Sports Event</b>
                        <hr />
                        <div className="row">
                            <div className="col-12 form-group">
                                <label>Sport</label>
                                <Select
                                    classNamePrefix="select"
                                    isSearchable={false}
                                    name="sport"
                                    options={sportsOptions}
                                    value={sport}
                                    onChange={(sport) => this.setState({ sport })}
                                    styles={customStyles}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label>Event</label>
                                <AsyncSelect
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    name="event"
                                    loadOptions={this.getEvent}
                                    noOptionsMessage={() => "No Event"}
                                    value={event}
                                    isLoading={loadingEvent}
                                    onChange={(event) => this.setState({ event })}
                                    styles={customStyles}
                                    components={{ Option: CustomOption }}
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <button className="form-button" onClick={() => onProceed(event)}> <FormattedMessage id="COMPONENTS.PROCEED" /> </button>
                            <button className="form-button ml-2" onClick={onClose}> <FormattedMessage id="PAGES.TRANSACTIONHISTORY.CANCEL" /> </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}