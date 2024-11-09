const mongoose = require('mongoose');

const Account = require('./account');

const touristServiceSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    title_service: String,
    description: String,
    itinerary: String,
    included_services: String,
    not_included_services: String,
    recommendations: String,
    picturesUrls: [String]
});

module.exports = mongoose.model('touristService', touristServiceSchema);