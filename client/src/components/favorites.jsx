import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { toggleFavorites } from '../redux/services';
import sportNameImage from "../helpers/sportNameImage";
import { getShortSportName } from '../libs/getSportName';

class Favorites extends Component {
    toggleFavoriteLeague = (evt, favorite) => {
        const { user, getUser } = this.props;
        evt.preventDefault();
        if (!user) return;
        toggleFavorites(favorite)
            .then(() => {
                getUser();
            })
    }

    render() {
        const { user, getUser } = this.props;
        if (user && user.favorites && user.favorites.length) {
            return (<ul className="sport-list sport-desktop-list sport-list-compact">
                {user.favorites.map(favorite => {
                    const shortName = getShortSportName(favorite.sport)
                    if (!shortName) return null;

                    return (
                        <li className="sport-list-item sport-sublist-item sport-hide-league" key={favorite._id}>
                            <Link
                                to={favorite.type == 'league' ?
                                    `/sport/${shortName}/league/${favorite.originId}` :
                                    `/sport/${shortName}/team/${favorite.name}`
                                }
                                className="sport-list-compact"
                            >
                                <img src={sportNameImage(favorite.sport, favorite.name)} style={{ marginRight: '6px' }} />
                                <label><span><span>{favorite.name}</span></span></label>
                                <span className="sport-list-count" onClick={(evt) => this.toggleFavoriteLeague(evt, favorite)}>
                                    <img src="/images/sports/star-selected.svg" alt="Favourite" />
                                </span>
                            </Link>
                        </li>
                    )
                })}
            </ul>)
        }
        return (
            <div className="favorites">
                Click the <i className="fas fa-star" /> by your favourite league or team to add.
            </div>
        );
    }
}

export default Favorites;