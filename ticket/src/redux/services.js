import FrontendAPI from "./frontendAPI";

export const getUser = () => {
    return FrontendAPI.get('/user');
}

export const getVenues = (region, locality, query, page) => {
    return FrontendAPI.get('/tickets/venues', { params: { region, locality, query, page } });
}

export const getEvents = (region, locality, venue, time, category) => {
    return FrontendAPI.get('/tickets/events', {
        params: { region, locality, venue, time, category }
    })
}