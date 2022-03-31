import React, { createRef } from "react";
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { searchEvent } from "../redux/services";
import dateformat from 'dateformat';
import sportNameImage from "../helpers/sportNameImage";

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
            {dateformat(value.startDate, 'ddd mmm dd yyyy HH:MM')}
        </div>
    );
};

export default class EventSearchModal extends React.Component {
    constructor(props) {
        super(props);
        const today = new Date();
        const today_s = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        this.state = {
            event: null,
            eventOptions: [],
            sportIndex: 'Baseball',
            leagueIndex: '225',
            dateIndex: 0,
            sportsOptions: [
                'Soccer',
                'Baseball',
                'Ice Hockey',
                'Basketball',
                'Tennis',
                'Boxing',
            ],
            leagueOptions: [
                {
                    "id": "225",
                    "name": "MLB",
                    "sport": "Baseball"
                },
                {
                    "id": "2274",
                    "name": "NBA",
                    "sport": "Basketball"
                },
                {
                    "id": "2638",
                    "name": "NCAAB",
                    "sport": "Basketball"
                },
                {
                    "id": "13920",
                    "name": "UFC",
                    "sport": "Boxing"
                },
                {
                    "id": "1926",
                    "name": "NHL",
                    "sport": "Ice Hockey"
                },
            ],
            dateOptions: [
                new Date(today_s),
                new Date(today_s).addDates(1),
                new Date(today_s).addDates(2),
                new Date(today_s).addDates(3),
                new Date(today_s).addDates(4),
                new Date(today_s).addDates(5),
                new Date(today_s).addDates(6),
                new Date(today_s).addDates(7),
                new Date(today_s).addDates(8),
                new Date(today_s).addDates(9),
            ],
            loadingEvent: false,
            showLeft: false,
            showRight: true,
        }
        this.listRef = createRef();
    }

    componentDidMount() {
        const { sportIndex, leagueIndex } = this.state;
        this.setSportLeague(sportIndex, leagueIndex);
    }

    onScroll = () => {
        const position = this.listRef.current?.scrollLeft;
        const offsetWidth = this.listRef.current?.offsetWidth;
        const scrollWidth = this.listRef.current?.scrollWidth;
        this.setState({
            showRight: position < scrollWidth - offsetWidth,
            showLeft: position != 0
        })
    }

    scrollLeft = () => {
        const position = this.listRef.current?.scrollLeft - 200;
        const offsetWidth = this.listRef.current?.offsetWidth;
        const scrollWidth = this.listRef.current?.scrollWidth;
        const newPos = position > 0 ? position : 0;
        this.listRef.current?.scrollTo({ left: newPos, behavior: 'smooth' })
        this.setState({
            showRight: offsetWidth < scrollWidth,
            showLeft: newPos != 0
        })
    }

    scrollRight = () => {
        const position = this.listRef.current?.scrollLeft + 200;
        const offsetWidth = this.listRef.current?.offsetWidth;
        const scrollWidth = this.listRef.current?.scrollWidth;
        const scrollLimit = scrollWidth - offsetWidth;
        const newPos = position > scrollLimit ? scrollLimit : position;

        this.listRef.current?.scrollTo({ left: position, behavior: 'smooth' })
        this.setState({
            showLeft: newPos != 0,
            showRight: newPos < scrollLimit
        });
    }

    onChangeDate = (dateIndex) => {
        this.setState({ dateIndex }, () => {
            const { sportIndex, leagueIndex } = this.state;
            this.setSportLeague(sportIndex, leagueIndex);
        })
    }

    setSportLeague = (sportIndex, leagueIndex) => {
        if (!sportIndex) {
            return this.setState({
                eventOptions: [],
                sportIndex,
                leagueIndex
            });
        }
        this.setState({
            eventOptions: [],
            sportIndex,
            leagueIndex
        });
        const { dateIndex, dateOptions } = this.state;
        searchEvent({ sport: sportIndex, league: leagueIndex, date: dateOptions[dateIndex] }).then(({ data }) => {
            this.setState({ eventOptions: data });
        }).catch(() => {
            this.setState({ eventOptions: [] });
        })
    }

    getDateStr = (date) => {
        switch (date) {
            case null:
                return 'All';
            default:
                return dateformat(date, "mmm d");
        }
    }

    getSportName = (sport) => {
        switch (sport) {
            case 'American Football':
                return 'Football';
            case 'Ice Hockey':
                return 'Hockey';
            default:
                return sport;
        }
    }

    render() {
        const { onClose, onProceed } = this.props;
        const {
            event, showLeft, showRight,
            eventOptions, sportsOptions, leagueOptions, dateOptions,
            sportIndex, leagueIndex, dateIndex,
        } = this.state;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <div className="highlights" style={{ position: 'relative' }}>
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                        <b>Search a Sports Event</b>
                        <hr />
                        <ul className="nav nav-tabs pt-2"
                            ref={this.listRef}
                            onScroll={this.onScroll}
                            style={{
                                flexWrap: 'nowrap',
                                background: '#1d1d1d'
                            }}>
                            {showLeft && <li className="d-flex align-items-center sports-scroller sports-scroller-left"
                                onClick={this.scrollLeft}>
                                <span className='sports-scroller-icon'>
                                    <i className='fas fa-arrow-left' />
                                </span>
                            </li>}
                            {leagueOptions.map((league) => {
                                return (
                                    <li className="nav-item"
                                        onClick={() => this.setSportLeague(league.sport, league.id)}
                                        key={league.id}>
                                        <center className='p-0'>
                                            <div className={`sports-league-image-container ${leagueIndex == league.id ? 'active' : ''}`}>
                                                <img src={sportNameImage(league.sport, league.name)}
                                                    className='sports-league-image' />
                                            </div>
                                            <span className={`nav-link ${leagueIndex == league.id ? 'active' : ''}`}>{league.name}</span>
                                        </center>
                                    </li>
                                )
                            })}
                            {sportsOptions.map((sport) => {
                                return (
                                    <li className="nav-item cursor-pointer"
                                        onClick={() => this.setSportLeague(sport, null)}
                                        key={sport}>
                                        <center className='p-0'>
                                            <div className={`sports-league-image-container ${sportIndex == sport ? 'active' : ''}`}>
                                                <img src={sportNameImage(sport)}
                                                    className='sports-league-image' />
                                            </div>
                                            <span className={`nav-link ${sportIndex == sport ? 'active' : ''}`}>{this.getSportName(sport)}</span>
                                        </center>
                                    </li>
                                );
                            })}
                            {showRight && <li className="d-flex align-items-center sports-scroller sports-scroller-right"
                                onClick={this.scrollRight}>
                                <span className='sports-scroller-icon'>
                                    <i className='fas fa-arrow-right' />
                                </span>
                            </li>}
                        </ul>
                        <div className='dashboard_bottombar date_bottombar_container mt-3 mb-5'>
                            <div className="dashboard_bottombar_container date_bottombar">
                                <div className="dashboard_bottombar_wrapper" style={{ minWidth: '100%' }}>
                                    <div className='dashboard_bottombar_scroller_container'>
                                        <div className="dashboard_bottombar_scroller date_bottombar" style={{
                                            transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
                                            transitionDuration: '0ms',
                                            transform: 'translate(0px, 0px) translateZ(0px)'
                                        }}>
                                            {dateOptions.map((date, index) => {
                                                return (
                                                    <a key={index}
                                                        className={dateIndex == index ? "dashboard_bottombar_selected modal-date" : 'modal-date'}
                                                        onClick={() => this.onChangeDate(index)}><span>{this.getDateStr(date)}</span></a>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 form-group">
                                <label>Select An Event</label>
                                <div className='d-flex align-items-center'>
                                    <strong>Powered By </strong>&nbsp;
                                    <a href="https://heatscore.co" target="_blank"><img src='/images/heatscore-thumb.png' style={{ height: '20px', display: 'block', margin: 0 }} /></a>
                                </div>
                                <Select
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    name="event"
                                    options={eventOptions}
                                    noOptionsMessage={() => "No Event"}
                                    value={event}
                                    onChange={(event) => this.setState({ event })}
                                    styles={customStyles}
                                    components={{ Option: CustomOption }}
                                    maxMenuHeight={200}
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