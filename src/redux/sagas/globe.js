import {takeLatest, select, put} from "redux-saga/effects";
import axios from "axios";
import gql from "graphql-tag/lib/graphql-tag.umd";
import {GeoJsonDataSource, Color} from "cesium";
import {showLoading, hideLoading, showEntityAsync} from "../../functions";
import {fetch} from "../../graphql_fetch";
import {
    actionTypes,
    setCountriesGeo,
    setCountryEntities,
    setSelectedEntity,
    setWorldInfo,
} from "../actions/globe";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

export function* watchGetGlobeData() {
    yield takeLatest(actionTypes.getGlobeData, handleGetGlobeData);
}

export function* watchLocationChange() {
    yield takeLatest('@@router/LOCATION_CHANGE', handleLocationChange);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleGetGlobeData(action) {
    showLoading();

    try {

        // Get basic initial countries geodata.
        const geojsonResponse = yield axios.get('/data/countries110m.geojson');
        const countriesGeo = geojsonResponse.data;
        const countries = {};

        for (let i = 0; i < countriesGeo.features.length; i++) {
            const feature = countriesGeo.features[i];
            const code = feature.properties['ISO Alpha-2'];
            countries[code] = {properties: feature.properties};
        }

        const query = gql`{
            region(where: {name: {_eq: "World"}}) {
                population
                covid_confirmed
                covid_deaths
                covid_recovered
            }
            country {
                id
                name
                iso_alpha2
                continent {
                    name
                }
                population
                covid_confirmed
                covid_deaths
                covid_recovered
                covid_tests
            }
        }`;

        const response = yield fetch(query, {});

        const worldInfo = response.data.region[0];
        yield put(setWorldInfo(worldInfo, action.cesiumRef));

        const countriesInfo = response.data.country;

        // Update geojson with some additional country data.
        for (let i = 0; i < countriesInfo.length; i++) {
            const countryData = countriesInfo[i];
            const code = countryData['iso_alpha2'];
            const country = countries[code];

            if (!country) {
                console.warn(`Country not found: ${code}`);
                continue;
            }

            // NOTE: Add population to properties (displayed in country info).
            if (countryData['population']) {
                country.properties['Population'] = countryData['population'];
            }

            country.additionalData = countryData;
        }

        yield put(setCountriesGeo(countries, action.cesiumRef));

        const dataSource = yield GeoJsonDataSource.load(countriesGeo);
        const cesiumElement = action.cesiumRef.current.cesiumElement;
        yield cesiumElement.dataSources.add(dataSource);

        const countryEntities = dataSource.entities.values;
        yield put(setCountryEntities(countryEntities));

        // Alter the entities so that the colour is practically transparent.
        // NOTE: If the colour is fully transparent it cannot be clicked on!
        for (let i = 0; i < countryEntities.length; i++) {
            const entity = countryEntities[i];
            entity.polygon.outline = false;
            entity.polygon.material = Color.fromAlpha(Color.LAWNGREEN, 0.01);
        }

        // Focus on initial entity for country initial page loads.
        const initialEntity = yield select((state) => state.globe.initialEntity);
        if (initialEntity) yield showEntityAsync(initialEntity, cesiumElement);

    } catch (e) {
        console.error(e);
    } finally {
        hideLoading();
    }
}

function* handleLocationChange(action) {
    yield put(setSelectedEntity(null));
}
