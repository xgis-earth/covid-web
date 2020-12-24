import axios from "axios";
import {print} from "graphql";
import Constants from "./constants";

export async function fetch(query, variables) {
    return axios.post(Constants.graphQlEndpoint, {
        query: query instanceof Object ? print(query) : query,
        variables,
    }, {
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        console.assert(response && response.data, response);
        if (response.data.errors) {
            console.error('GraphQL Query Errors', response.data.errors);
            return;
        }

        return response.data;
    }).catch(e => {
        console.error('GraphQL Query Exception', e);
    });
}
