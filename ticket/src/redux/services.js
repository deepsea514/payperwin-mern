import FrontendAPI from "./frontendAPI";

export const getUser = () => {
    return FrontendAPI.get('/user');
}

export const getVenues = (state, city, query, page) => {
    return FrontendAPI.get('/tickets/venues', { params: { state, city, query, page } });
}

export const getEvents = (state, city, venue, time, category) => {
    return FrontendAPI.get('/tickets/events', {
        params: { state, city, venue, time, category }
    })
}