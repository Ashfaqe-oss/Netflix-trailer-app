import React, { useState, useEffect } from 'react';
import "./Row.css";
import axios from "./axios";
import YouTube from "react-youtube";
import MovieTrailer from "movie-trailer";
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLarge, scroll }) {
    const [movies, setMovies] = useState( [] );
    const [trailerUrl, setTrailerUrl] = useState( "" );

    useEffect(() => {

        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = ( movie ) => {
        if ( trailerUrl ) {
            setTrailerUrl( "" );
        } else {
            MovieTrailer( movie?.name || movie?.original_name || movie?.title || "" )
                .then( ( url ) => {
                    const urlParams = new URLSearchParams( new URL( url ).search );
                    setTrailerUrl( urlParams.get( "v" ) );
                } )
                .catch( ( error ) => console.log( error ) );
        }
    };

    return (
        <div className="row">
            <div className="row__heading">
                <h2>{title}</h2>
                <h6>{scroll}</h6>
            </div>
			<div className="row__posters">
				{movies.map(movie => (
                    <img
                        onClick={() => handleClick(movie)}
						key={movie.id}
						className="row__poster"
					    src={`${baseUrl}${isLarge ? movie.poster_path : movie.poster_path}`}
				        alt={movie.name} />
				))}
            </div>

            {trailerUrl &&
                <div className="video">
                <CancelRoundedIcon onClick={() => (setTrailerUrl(""))} className="row__videoClose"/>
                <YouTube videoId={trailerUrl} opts={opts} />
                </div>
            }
            {/* container for the posters */}
        </div>
    )
}

export default Row;
