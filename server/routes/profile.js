"use strict";

const express = require("express");
const ProfileService = require("../service/profile");
const CommentService = require("../service/comments");
const VotingService = require("../service/voting");
const { check, validationResult } = require("express-validator");
const {
  validateCreateProfileRequest,
  validateGetProfileRequest,
  addCommentValidation,
  validateLikeComment,
  addPersonalityValidation,
  filteredAndsortedCommentsValidation,
} = require("../validations/validation");

const router = express.Router();

module.exports = function () {
  router.post("/profiles", validateCreateProfileRequest(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const profile = await ProfileService.createProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get(
    "/profiles/:profileId",
    validateGetProfileRequest(),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const profile = await ProfileService.getProfile(req.params.profileId);
        if (profile instanceof Error) {
          return next(profile);
        }
        res.json(profile);
      } catch (error) {
        throw error;
      }
    }
  );

  router.post(
    "/addComment/:profileId",
    addCommentValidation(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { profileId } = req.params;
        const { comment } = req.body;
        const updatedProfile = await CommentService.addCommentToProfile(
          profileId,
          comment
        );
        res.status(201).json(updatedProfile);
      } catch (error) {
        res.status(500);
      }
    }
  );

  router.post(
    "/likeComment/:profileId/:commentId",
    validateLikeComment(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { profileId, commentId } = req.params;
        const userId = req.headers.authorization;
        const updatedProfile = await CommentService.addLikeToComment(
          userId,
          profileId,
          commentId
        );
        res.status(201).json(updatedProfile);
      } catch (error) {
        console.log(error);
        res.status(500);
      }
    }
  );
  router.post(
    "/removeLikeFromComment/:profileId/:commentId",
    validateLikeComment(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { profileId, commentId } = req.params;
        const userId = req.headers.authorization;
        const updatedProfile = await CommentService.removeLikeFromComment(
          userId,
          profileId,
          commentId
        );
        res.status(201).json(updatedProfile);
      } catch (error) {
        console.log(error);
        res.status(500);
      }
    }
  );
  router.post(
    "/addPersonality/:profileId/:commentId",
    addPersonalityValidation(),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { profileId, commentId } = req.params;
        const { personalityTypes } = req.body;
        const updatedProfile = await VotingService.addPersonalityTypeToComment(
          profileId,
          commentId,
          personalityTypes
        );
        res.status(201).json(updatedProfile);
      } catch (error) {
        next(error);
      }
    }
  );
  router.get(
    "/filteredAndsortedComments/:profileId",
    filteredAndsortedCommentsValidation(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { profileId } = req.params;
        const {
          order = "asc",
          sortBy = "timestamp",
          filterPersonalityType = "all",
        } = req.query;
        const sortedComments = await CommentService.getSortedCommentsWithFilter(
          profileId,
          sortBy,
          order,
          filterPersonalityType
        );
        res.status(201).json(sortedComments);
      } catch (error) {
        console.log(error);
        res.status(500);
      }
    }
  );
  return router;
};
