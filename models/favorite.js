const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

var favoriteDishSchema = new Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dishSchema'
    }
}, {
    timestamps: true
});

const favoritechema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[favoriteDishSchema]
}, {
    timestamps: true
});


var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;