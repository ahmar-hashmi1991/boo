const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { expect } = chai;

chai.use(chaiAsPromised);

describe('ProfileService', () => {
  let CommentService;
  let CommentModel;

  // Initialize the ProfileService module using Proxyquire
  beforeEach(() => {
    CommentModel = {
      findOneAndUpdate: sinon.stub(),
      findById: sinon.stub(),
    };

    CommentService = proxyquire('../service/comments', {
      '../models/profile': CommentModel,
    });
  });

  describe('addCommentToProfile', () => {
    it('should add a comment to a profile', async () => {
      // Set up test data
      const profileId = 'profile123';
      const comment = 'Test comment';
      const updatedProfile = { _id: 'profile123', comments: [{ text: 'Test comment' }] };

      // Mock ProfileModel.findOneAndUpdate to return the updated profile
      CommentModel.findOneAndUpdate.resolves(updatedProfile);

      // Call the function and assert the result
      const result = await CommentService.addCommentToProfile(profileId, comment);
      expect(result).to.deep.equal(updatedProfile);
      expect(CommentModel.findOneAndUpdate.calledOnce).to.be.true;
    });

    it('should throw an error when profile is not found', async () => {
      // Set up test data
      const profileId = 'nonexistentProfile';
      const comment = 'Test comment';

      // Mock ProfileModel.findOneAndUpdate to return null (profile not found)
      CommentModel.findOneAndUpdate.resolves(null);

      // Call the function and assert the error
      await expect(CommentService.addCommentToProfile(profileId, comment)).to.be.rejectedWith('Profile not found');
      expect(CommentModel.findOneAndUpdate.calledOnce).to.be.true;
    });


    // Add more test cases for other scenarios
  });

  // Repeat the process for other functions like addLikeToComment, removeLikeFromComment, and getSortedCommentsWithFilter
});
