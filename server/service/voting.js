const  ProfileModel= require('../models/profile')
const CustomError = require('../errors/customError');

module.exports = {
    async  addPersonalityTypeToComment(profileId, commentId, personalityType) {
        try {
          // Find the profile where the comment exists
          const profile = await ProfileModel.findById(profileId);
      
          if (!profile) {
            throw new Error('Profile not found');
          }
      
          // Find the specific comment within the profile
          const comment = profile.comments.id(commentId);
      
          if (!comment) {
            throw new Error('Comment not found');
          }
      
          // Add the personality type to the comment
          comment.personality = personalityType;
      
          // Save the updated profile
          const updatedProfile = await profile.save();
      
          return updatedProfile;
        } catch (error) {
          console.error('Error adding personality type to comment:', error);
          throw error;
        }
      }
};
