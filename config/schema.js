const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    organization: String,
    email: String,
    password: String,
    id: String,
    approved: Boolean
});

// Verification Schema
const VerificationSchema = new Schema({
    email: String,
    code: Number,
    verified: Boolean
});

// Issues Schema
const IssuesSchema = new Schema({
    id: String,
    organization: String,
    transactionHash: String,
    certificateHash: String,
    certificateNumber: String,
    name: String,
    course: String,
    grantDate: Date,
    expirationDate: Date,
    issueDate: Date
});

const User = mongoose.model('User', UserSchema);
const Verification = mongoose.model('Verification', VerificationSchema);
const Issues = mongoose.model('Issues', IssuesSchema);

module.exports = {
    User,
    Verification,
    Issues
};
