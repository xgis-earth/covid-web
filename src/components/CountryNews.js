import React from "react";
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import gql from "graphql-tag";
import moment from "moment";
import {fetch} from "../graphql_fetch";
import {hideLoading} from "../functions";

class CountryNews extends React.Component {

    static propTypes = {
        countryCode: PropTypes.string.isRequired
    };

    state = {
        fetching: false,
        articles: undefined
    };

    render() {
        if (this.state.fetching) {
            return <Spinner/>
        }

        if (!this.state.articles) {
            return <React.Fragment/>
        }

        if (this.state.articles && this.state.articles.length === 0) {
            return (
                <div style={{marginTop: "1rem", marginLeft: "0.5rem"}}>
                    There is no news available for this country.
                </div>
            )
        }

        return (
            <React.Fragment>
                <div className="card-columns" style={{marginTop: "1rem"}}>
                    {this.state.articles.map((article, i) => {
                        let image = article.image_url;
                        if (image &&
                            image.indexOf('http://') !== 0 &&
                            image.indexOf('https://') !== 0) {
                            image = undefined;
                        }
                        return (
                            <div className="card" key={i}>
                                {image &&
                                <a href={article.url} target="_blank">
                                    <img src={image} className="card-img-top" alt=""/>
                                </a>
                                }
                                <div className="card-body">
                                    {article.title &&
                                    <h5 className="card-title">
                                        <a href={article.url} target="_blank">
                                            {article.title}
                                        </a>
                                    </h5>
                                    }
                                    {article.description &&
                                    <p className="card-text">
                                        {article.description}
                                    </p>
                                    }
                                    <p className="card-text">
                                        <small className="text-muted">
                                            {article.source}: {moment(article.published_at).fromNow()}<br/>
                                            <a href={`https://translate.google.com/translate?sl=auto&u=${encodeURIComponent(article.url)}`}
                                               target="_blank"
                                               style={{textDecoration: "underline"}}>
                                                Google Translate
                                            </a>
                                        </small>
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.getNews();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.countryCode !== prevProps.countryCode) {
            this.setState({articles: undefined});
            this.getNews();
        }
    }

    getNews() {
        this.setState({fetching: true});

        const query = gql`
            query ($country_code: String!, $limit: Int!) {
                country_news(country_code: $country_code, limit: $limit) {
                    title
                    description
                    image_url
                    url
                    published_at
                    source
                }
            }
        `;

        const variables = {
            country_code: this.props.countryCode,
            limit: 25
        };

        try {
            fetch(query, variables).then(response => {
                console.assert(response && response.data && response.data.country_news, response);
                this.setState({
                    articles: response && response.data && response.data.country_news || [],
                    fetching: false
                });
            })
        } catch (e) {
            hideLoading();
            this.setState({fetching: false});
            console.error(e);
        }
    }
}

export default CountryNews;
