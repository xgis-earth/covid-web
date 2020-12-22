FROM nginx:stable-alpine AS base
COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM node:12.14-alpine AS build
ARG COVID_HASURA_DOMAIN
ARG COVID_ION_TOKEN
ARG COVID_MAPBOX_TOKEN
ENV COVID_HASURA_DOMAIN=$COVID_HASURA_DOMAIN
ENV COVID_ION_TOKEN=$COVID_ION_TOKEN
ENV COVID_MAPBOX_TOKEN=$COVID_MAPBOX_TOKEN
WORKDIR /project
COPY . .
RUN npm install
RUN npm run build:min

FROM base AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /project/wwwroot .
