const ProfileModel = require("../models/profile");
const { NotFoundError } = require("../errors/customError");

module.exports = {
  async createProfile(body) {
    try {
      const newProfile = await ProfileModel.insertMany([body]);
      return newProfile[0];
    } catch (error) {
      console.log("error >> ", error);
      throw error;
    }
  },
  async getProfile(profileId) {
    try {
      const newProfile = await ProfileModel.findOne({ _id: profileId });
      if (!newProfile) {
        return new NotFoundError(`Profile Not found with id ${profileId}`);
      }
      return newProfile;
    } catch (error) {
      throw error;
    }
  },
};
