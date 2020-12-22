# 2019-nCoV Website

[![Build Status](https://cloud.drone.io/api/badges/xgis-earth/covid-web/status.svg)](https://cloud.drone.io/xgis-earth/covid-web)

## Development Notes

The following environment variables must be defined:

* `COVID_HASURA_DOMAIN`
* `COVID_ION_TOKEN`
* `COVID_MAPBOX_TOKEN`

These are expected to be defined in a Kubernetes secret, used during deployment.

```bash
vi config-secret.yaml
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: covid-config
type: Opaque
stringData:
  hasuraDomain: "<secret>"
  ionToken: "<secret>"
  mapboxToken: "<secret>"
```

NOTE: These secrets are easily seen in the JavaScript source for the deployed application.
The use of secrets here allows them to be configurable during deployment.

```bash
kubectl apply -f config-secret.yaml -n=covid
kubectl get secret covid-config -n=covid
kubectl describe secret covid-config -n=covid
```

Hasura must be deployed on top of a database. Details for the configuration required to be added here later.
