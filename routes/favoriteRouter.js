const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');


const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser,(req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    let dishesIds = []
    for (dish in req.body){
        dishesIds.push(dish._id);
    }

    Favourite.find({ "user": req.user._id})
    .then((list) => {
        if (list == null){
            Favourite.create({
                user: req.user._id,
                dishes: dishesIds
            })
            .then((list) => {
                console.log('List Created ', list);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(list);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            for (dish in dishesIds){
                if(list.dishes.indexOf(dish) == -1){
                    list.dishes.push(dish);
                }
            }
            list.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(list);
        }
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Favourite.remove({user: req.user._id})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/dishId')
.options(cors.corsWithOptions,authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favourite.find({ "user": req.user._id})
    .then((list) => {
        if (list == null){
            Favourite.create({
                user: req.user._id,
                dishes: [req.params.dishId]
            })
            .then((list) => {
                console.log('List Created ', list);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(list);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            if(list.dishes.indexOf(req.params.dishId) == -1){
                list.dishes.push(req.params.dishId);
            }

            list.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(list);
        }
    })
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favourite.find({user: req.user._id})
    .then((result) => {
        if(!(result == null)){
            let position =result.dishes.indexOf(req.params.dishId);
            if(position != -1){
                result.dishes.splice(position,1);
                result.save();
            }
            else{
                err = new Error('Dish with dish ID '+ req.params.dishId + 'does not exist in the favourite list');
                err.status = 404;
                return next(err);
            }
        }
        else{
            err = new Error('Favourite list of the current user does not exist');
            err.status = 404;
            return next(err);
        }
    })
});
module.exports = favoriteRouter;