FROM nginx:stable-alpine AS base
COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM node:12.14-alpine AS build
WORKDIR /project
COPY . .
RUN npm install
ARG COVID_HASURA_DOMAIN
ARG COVID_ION_TOKEN
ARG COVID_MAPBOX_TOKEN
RUN npm run build:min

FROM base AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /project/wwwroot .
