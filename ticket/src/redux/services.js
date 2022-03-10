import FrontendAPI from "./frontendAPI";

export const getUser = () => {
    return FrontendAPI.get('/user');
}

export const getCategories = () => {
    return FrontendAPI.get('/tickets/categories');
}

export const getCities = (state, query) => {
    return FrontendAPI.get('/tickets/cities', { params: { state, query } });
}

export const getVenues = (state, city, query) => {
    return FrontendAPI.get('/tickets/venues', { params: { state, city, query } });
}

export const getEvents = (state, city, venue, time, categiry) => {
    return FrontendAPI.get('/tickets/events', {
        params: { state, city, venue, time, categiry }
    })
}