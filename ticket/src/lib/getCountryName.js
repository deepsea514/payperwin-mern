export const getCountryName = (country_code) => {
    switch (country_code.toUpperCase()) {
        case 'CA': return 'Canada';
        case 'US': return 'United States';
        default: return null;
    }
}