const ProfileModel = require("../models/profile");
const CustomError = require("../errors/customError");

module.exports = {
  async addCommentToProfile(profileId, comment) {
    try {
      const updatedProfile = await ProfileModel.findOneAndUpdate(
        { _id: profileId },
        {
          $push: { comments: { text: comment } },
        },
        { new: true }
      );

      if (!updatedProfile) {
        throw new Error("Profile not found");
      }

      return updatedProfile;
    } catch (error) {
      console.error("Error adding comment to profile:", error);
      throw error;
    }
  },
  async addLikeToComment(id, profileId, commentId) {
    try {
      // Find the user who wants to add the like
      const user = await ProfileModel.findById({ _id: id });
      if (!user) {
        throw new Error("User not found");
      }

      // Find the profile where the comment exists
      const profile = await ProfileModel.findById({ _id: profileId });

      if (!profile) {
        throw new Error("Profile not found");
      }

      // Find the specific comment within the profile
      const comment = profile.comments.id(commentId);

      if (!comment) {
        throw new Error("Comment not found");
      }

      // Check if the user has already liked the comment
      const existingLike = comment.likes.find((like) =>
        like.user.equals(user._id)
      );
      if (existingLike) {
        throw new Error("User already liked this comment");
      }

      // Add the like to the comment
      comment.likes.push({ user: user._id });

      // Save the updated profile
      await profile.save();

      return profile;
    } catch (error) {
      console.error("Error adding like to comment:", error);
      throw error;
    }
  },
  async removeLikeFromComment(userId, profileId, commentId) {
    try {
      // Find the user who wants to remove the like
      const user = await ProfileModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Find the profile where the comment exists
      const profile = await ProfileModel.findById(profileId);

      if (!profile) {
        throw Error("Profile not found");
      }

      // Find the specific comment within the profile
      const comment = profile.comments.id(commentId);

      if (!comment) {
        throw new Error("Comment not found");
      }

      // Check if the user has liked the comment
      const existingLike = comment.likes.find((like) =>
        like.user.equals(user._id)
      );
      if (!existingLike) {
        throw new Error("User has not liked this comment");
      }

      // Remove the like from the comment
      comment.likes.pull(existingLike._id);

      // Save the updated profile
      await profile.save();

      return profile;
    } catch (error) {
      console.error("Error removing like from comment:", error);
      throw error;
    }
  },
  async getSortedCommentsWithFilter(
    profileId,
    sortBy,
    order,
    filterPersonalityType
  ) {
    try {
      const profile = await ProfileModel.findById(profileId);

      if (!profile) {
        throw new Error("Profile not found");
      }

      // Sort the comments based on the specified criteria
      let sortCriteria = {};
      if (sortBy === "likes") {
        sortCriteria = { "comments.likes.length": order === "asc" ? 1 : -1 };
      } else if (sortBy === "timestamp") {
        sortCriteria = { "comments.timestamp": order === "asc" ? 1 : -1 };
      }

      // Filter comments by personality type
      if (filterPersonalityType === "all") {
        // If filterPersonalityType is 'all', return all comments without filtering
        const allComments = profile.comments.slice(); // Copy all comments
        allComments.sort((a, b) => {
          if (sortBy === "likes") {
            return (
              (a.likes.length - b.likes.length) * (order === "asc" ? 1 : -1)
            );
          } else if (sortBy === "timestamp") {
            return (a.timestamp - b.timestamp) * (order === "asc" ? 1 : -1);
          }
        });
        return allComments;
      } else {
        // Filter comments by personality type
        // Filter comments by personality type
        const filteredComments = profile.comments.filter((comment) =>
          comment.personality.some((p) => p.type === filterPersonalityType)
        );

        // Sort the filtered comments
        filteredComments.sort((a, b) => {
          if (sortBy === "likes") {
            return (
              (a.likes.length - b.likes.length) * (order === "asc" ? 1 : -1)
            );
          } else if (sortBy === "timestamp") {
            return (a.timestamp - b.timestamp) * (order === "asc" ? 1 : -1);
          }
        });
        return filteredComments;
      }
    } catch (error) {
      console.error(
        "Error getting sorted comments with personality filter:",
        error
      );
      throw error;
    }
  },
};
