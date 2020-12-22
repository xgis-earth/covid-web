import $ from "jquery";
import {
    Cartesian3,
    Cartographic,
    HeadingPitchRange,
    Math as CesiumMath,
} from "cesium";

// -----------------------------------------------------------------------------
// Loading screen.
// -----------------------------------------------------------------------------

export function showLoading() {
    $('.loading-screen').css('display', '');
}

export function hideLoading() {
    $('.loading-screen').css('display', 'none');
}

// -----------------------------------------------------------------------------
// Get entity.
// -----------------------------------------------------------------------------

export function getCountryEntity(code, entities) {
    const candidates = [];
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.properties['ISO Alpha-2']?.getValue() === code) {
            candidates.push(entity);
        }
    }

    let top = 0;
    let result = undefined;
    for (let i = 0; i < candidates.length; i++) {
        const poly = candidates[i].polygon;
        const positions = poly.hierarchy.getValue().positions;
        if (positions.length > top) {
            top = positions.length;
            result = candidates[i];
        }
    }

    return result;
}

// -----------------------------------------------------------------------------
// Show entity.
// -----------------------------------------------------------------------------

export function showCountry(code, entities, cesiumElement) {
    const entity = getCountryEntity(code, entities);
    showEntity(entity, cesiumElement);
}

function getDestination(entity, height) {
    const entityPosition = entity.position.getValue(0);
    const entityDegrees = Cartographic.fromCartesian(entityPosition);
    const latitude = entityDegrees.latitude;
    const longitude = entityDegrees.longitude;
    return Cartesian3.fromRadians(longitude, latitude, height);
}

export function showEntity(entity, cesiumElement) {
    if (entity.position) {
        const destination = getDestination(entity, 1000);
        cesiumElement.camera.flyTo({destination});
    } else {
        const pitch = new HeadingPitchRange(0, CesiumMath.toRadians(-90.0), 0);
        cesiumElement.flyTo(entity, {offset: pitch});
    }
}

export function* showEntityAsync(entity, cesiumElement) {
    if (entity.position) {
        const destination = getDestination(entity, 1000);
        yield cesiumElement.camera.setView({destination});
    } else {
        const pitch = new HeadingPitchRange(0, CesiumMath.toRadians(-90.0), 0);
        yield cesiumElement.flyTo(entity, {offset: pitch});
    }
}
