const express = require('express');
const router = express.Router();
const axios = require('axios');
const baseUrl = 'https://api.themoviedb.org/3/';
const errors = require('http-errors');
const MOVIE_DB_KEY = process.env.MOVIE_DB_KEY || '01312d2aba874c413fc6cd54989915ad';

function handleAxiosError (err) {

    if (err.response) {
        return {
            errorCode: err.response.status,
            message: err.response.data
        };
    } else {
        return new errors.BadRequest();
    }
}

function getJson(data  , page){
    return {result:'success' , data: data.results ,page_number:page , page_size:data.results.length, total_pages: data.total_pages, total_results: data.total_results };    
}

router.get('/movies/intheater', (req, res, next) => {

    let page = req.query.page || 1;
    let url = baseUrl +
        'movie/now_playing?language=en-US&api_key=' +
        MOVIE_DB_KEY +
        '&page=' + page;
    axios.get(url)
        .then(response => {            
            res.json(getJson(response.data, page));
        })
        .catch(err => {
            next(handleAxiosError(err));
        });
});

router.get('/movies/search', (req, res, next) => {

    let page = req.query.page || 1;
    let query = req.query.query || '';

    let url = baseUrl +
        'search/movie?language=en-US&include_adult=false&api_key=' +
        MOVIE_DB_KEY +
        '&page=' + page +
        '&query=' + query;

    axios.get(url)
        .then(response => {
            res.json(getJson(response.data, page));
        })
        .catch(err => {

            next(handleAxiosError(err));
        });
});

router.get('/movies/movie/:id/trailers', (req, res, next) => {

    let url = baseUrl +
        'movie/' + req.params.id + '/videos?language=en-US&api_key=' +
        MOVIE_DB_KEY;

    axios.get(url)
        .then(response => {

            let result = response &&
                        response.data &&
                        response.data.results ? response.data.results : [];

            res.json({result:'success' , data: result  });
        })
        .catch(err => {

            next(handleAxiosError(err));
        });
});

router.get('/movies/movie/:id/reviews', (req, res, next) => {

    let url = baseUrl +
        'movie/' + req.params.id + '/reviews?language=en-US&api_key=' +
        MOVIE_DB_KEY +
        '&page=1';

    axios.get(url)
        .then(response => {
            let result = response &&
                        response.data &&
                        response.data.results ? response.data.results : [];
            res.json({result:'success' , data: result });
        })
        .catch(err => {
            res.json({result:'fail' , 'msg' : 'no data' });
            //next(handleAxiosError(err));
        });
});

router.get('/movies/movie/:id/similar', (req, res, next) => {

    let url = baseUrl +
        'movie/' + req.params.id + '/similar?language=en-US&api_key=' +
        MOVIE_DB_KEY +
        '&page=1';

    axios.get(url)
        .then(response => {

            let result = response &&
                        response.data &&
                        response.data.results ? response.data.results : [];

            res.json({result:'success' , data: result });
        })
        .catch(err => {

            next(handleAxiosError(err));
        });
});

router.get('/genres', (req, res, next) => {

    let url = baseUrl +
        'genre/movie/list?language=en-US&api_key=' +
        MOVIE_DB_KEY;

    axios.get(url)
        .then(response => {

            let result = response &&
                        response.data &&
                        response.data.genres ? response.data.genres : [];

            res.json({result:'success' , data: result  });
        })
        .catch(err => {

            next(handleAxiosError(err));
        });
});

router.get('/configuration', (req, res, next) => {

    let url = baseUrl +
        'configuration?language=en-US&api_key=' +
        MOVIE_DB_KEY;

    axios.get(url)
        .then(response => {

            let result = response &&
                        response.data ? response.data : [];

            res.json({result:'success' , data: result  });
        })
        .catch(err => {

            next(handleAxiosError(err));
        });
});

module.exports = router;
