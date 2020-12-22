export const actionTypes = {
    getGlobeData: 'globe/getGlobeData',
    setCountriesGeo: 'globe/setCountriesGeo',
    setCountryEntities: 'globe/setCountryEntities',
    setSelectedEntity: 'globe/setSelectedEntity',
    setInitialEntity: 'globe/setInitialEntity',
    setWorldInfo: 'globe/setWorldInfo',
};

export const getGlobeData = (cesiumRef) => ({
    type: actionTypes.getGlobeData,
    cesiumRef
});

export const setCountriesGeo = (countries, cesiumRef) => ({
    type: actionTypes.setCountriesGeo,
    countries,
    cesiumRef
});

export const setCountryEntities = (entities) => ({
    type: actionTypes.setCountryEntities,
    entities
});

export const setSelectedEntity = (selectedEntity) => ({
    type: actionTypes.setSelectedEntity,
    selectedEntity
});

export const setInitialEntity = (entity) => ({
    type: actionTypes.setInitialEntity,
    entity
});

export const setWorldInfo = (worldInfo) => ({
    type: actionTypes.setWorldInfo,
    worldInfo
});
