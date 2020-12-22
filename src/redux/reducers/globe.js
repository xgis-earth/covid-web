import {actionTypes} from "../actions/globe";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    continents: undefined,
    countries: undefined,
    cesiumRef: undefined,
    countryEntities: undefined,
    selectedEntity: undefined,
    initialEntity: undefined,
    worldInfo: undefined,
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function setCountriesGeo(state, action) {

    // Group countries by continents.
    const continents = {};
    for (const countryCode in action.countries) {
        if (!action.countries.hasOwnProperty(countryCode)) {
            continue;
        }

        const country = action.countries[countryCode];

        if (!country.additionalData) {
            console.warn(`No additional data for ${countryCode}`);
            continue;
        }

        const continentName = country.additionalData['continent']['name'];

        if (!continents[continentName]) {
            continents[continentName] = [];
        }

        continents[continentName].push(country);
    }

    // Sort countries by name.
    for (const continentName in continents) {
        if (!continents.hasOwnProperty(continentName)) {
            continue;
        }

        const continent = continents[continentName];

        const countries = {};
        const countryNames = [];
        for (let i = 0; i < continent.length; i++) {
            const country = continent[i];
            const countryName = country.properties['Country Name'];
            countries[countryName] = country;
            countryNames.push(countryName);
        }

        countryNames.sort();
        const sortedCountries = [];
        for (let i = 0; i < countryNames.length; i++) {
            const name = countryNames[i];
            const country = countries[name];
            sortedCountries.push(country);
        }

        continents[continentName] = sortedCountries;
    }

    // Sort continents by name.
    const continentNames = Object.keys(continents);
    continentNames.sort();
    const sortedContinents = {};
    for (let i = 0; i < continentNames.length; i++) {
        const name = continentNames[i];
        sortedContinents[name] = continents[name];
    }

    return {
        ...state,
        continents: sortedContinents,
        countries: action.countries,
        cesiumRef: action.cesiumRef,
    };
}

function setCountryEntities(state, action) {
    return {...state, countryEntities: action.entities};
}

function setSelectedEntity(state, action) {
    return {...state, selectedEntity: action.selectedEntity};
}

function setInitialEntity(state, action) {
    return {...state, initialEntity: action.entity};
}

function setWorldInfo(state, action) {
    return {...state, worldInfo: action.worldInfo};
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.setCountriesGeo]: setCountriesGeo,
    [actionTypes.setCountryEntities]: setCountryEntities,
    [actionTypes.setSelectedEntity]: setSelectedEntity,
    [actionTypes.setInitialEntity]: setInitialEntity,
    [actionTypes.setWorldInfo]: setWorldInfo,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}
