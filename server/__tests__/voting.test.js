const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { expect } = chai;

chai.use(chaiAsPromised);

describe('VotingService', () => {
  let VotingService;
  let VotingModel;

  beforeEach(() => {
    VotingModel = {
      findById: sinon.stub(),
    };

    VotingService = proxyquire('../service/voting', {
      '../models/profile': VotingModel,
    });
  });

  describe('addPersonalityTypeToComment', () => {
   

    it('should throw an error when the profile is not found', async () => {
      const profileId = 'nonexistentProfile';
      const commentId = 'comment456';
      const personalityType = 'friendly';

      VotingModel.findById.resolves(null);

      await expect(VotingService.addPersonalityTypeToComment(profileId, commentId, personalityType)).to.be.rejectedWith('Profile not found');
      expect(VotingModel.findById.calledOnce).to.be.true;
    });

   
      
  });
});
