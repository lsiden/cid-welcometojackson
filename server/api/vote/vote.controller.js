'use strict';

var _ = require('lodash');
var Vote = require('./vote.model');
var auth = require('../../auth/auth.service');

// Get list of votes
exports.index = function(req, res) {
  Vote.find(function (err, votes) {
    if(err) { return handleError(res, err); }
    Vote.populate(votes, { path: 'user list', select: '_id email title' }, function(err, popVotes) {
      if(err) { return handleError(res, err); }
      return res.json(200, popVotes);
    });
  });
};

// Get a single vote
exports.show = function(req, res) {
  Vote.findById(req.params.id, function (err, vote) {
    if(err) { return handleError(res, err); }
    if(!vote) { return res.send(404); }
    return res.json(vote);
  });
};

// Creates a new vote in the DB.
exports.create = function(req, res) {
  Vote.find(req.params, function(err, vote) {
    if(err) { return handleError(res, err); }
    if (vote) { return res.send(403); }
    Vote.create(req.body, function(err, vote) {
      if(err) { return handleError(res, err); }
      return res.json(201, vote);
    });
  });
};

/*
// Updates an existing vote in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Vote.findById(req.params.id, function (err, vote) {
    if (err) { return handleError(res, err); }
    if(!vote) { return res.send(404); }
    var updated = _.merge(vote, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, vote);
    });
  });
};
*/

// Deletes a vote from the DB.
exports.destroy = function(req, res) {
  Vote.findById(req.params.id, function (err, vote) {
    if(err) { return handleError(res, err); }
    if(!vote) { return res.send(404); }
    vote.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
