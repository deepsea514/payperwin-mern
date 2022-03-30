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

        this.state = {
            event: null,
            eventOptions: [],
            sportIndex: null,
            leagueIndex: null,
            sportsOptions: [
                'Soccer',
                'American Football',
                'Baseball',
                'Ice Hockey',
                'Basketball',
                'Tennis',
                'Boxing',
            ],
            leagueOptions: [
                {
                    "id": "459",
                    "name": "NFL",
                    "sport": "American Football"
                },
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
            loadingEvent: false,
            showLeft: false,
            showRight: true,
        }
        this.listRef = createRef();
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
        searchEvent({ sport: sportIndex, league: leagueIndex }).then(({ data }) => {
            this.setState({ eventOptions: data });
        }).catch(() => {
            this.setState({ eventOptions: [] });
        })
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
        const { event, showLeft, showRight, eventOptions, sportsOptions, leagueOptions, sportIndex, leagueIndex } = this.state;
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
                                        <center>
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
                                        <center>
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
                        <div className="row">
                            <div className="col-12 form-group">
                                <label>Select An Event</label>
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