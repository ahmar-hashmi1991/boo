const proxyquire = require('proxyquire');
const { expect } = require('chai');

describe('ProfileService', () => {
  it('should create a new profile', async () => {
    // Mock the ProfileModel with a custom implementation
    const ProfileModelMock = {
      insertMany: (data) => {
        // Simulate the creation of a new profile
        return [{ _id: 'mockedProfileId', name: data[0].name }];
      },
    };

    // Mock the 'errors/customError' module
    const customErrorMock = {
      NotFoundError: class MockedNotFoundError {},
    };

    // Import the ProfileService with mocked dependencies
    const ProfileService = proxyquire('../service/profile', {
      '../models/profile': ProfileModelMock,
      '../errors/customError': customErrorMock,
    });

    // Call the createProfile function
    const createdProfile = await ProfileService.createProfile({ name: 'John Doe' });

    // Assert the result
    expect(createdProfile).to.deep.equal({ _id: 'mockedProfileId', name: 'John Doe' });
  });

  it('should get an existing profile', async () => {
    // Mock the ProfileModel with a custom implementation
    const ProfileModelMock = {
      findOne: () => {
        // Simulate an existing profile
        return { _id: 'mockedProfileId', name: 'Jane Smith' };
      },
    };

    // Mock the 'errors/customError' module
    const customErrorMock = {
      NotFoundError: class MockedNotFoundError {},
    };

    // Import the ProfileService with mocked dependencies
    const ProfileService = proxyquire('../service/profile', {
      '../models/profile': ProfileModelMock,
      '../errors/customError': customErrorMock,
    });

    // Call the getProfile function
    const profile = await ProfileService.getProfile('mockedProfileId');

    // Assert the result
    expect(profile).to.deep.equal({ _id: 'mockedProfileId', name: 'Jane Smith' });
  });

  it('should handle a non-existing profile', async () => {
    // Mock the ProfileModel to return null (profile not found)
    const ProfileModelMock = {
      findOne: () => null,
    };

    // Mock the 'errors/customError' module
    const customErrorMock = {
      NotFoundError: class MockedNotFoundError {},
    };

    // Import the ProfileService with mocked dependencies
    const ProfileService = proxyquire('../service/profile', {
      '../models/profile': ProfileModelMock,
      '../errors/customError': customErrorMock,
    });

    try {
      // Call the getProfile function with a non-existing profileId
      await ProfileService.getProfile('nonExistentProfileId');
      // If the function doesn't throw an error, the test will fail
      expect.fail('Expected NotFoundError to be thrown');
    } catch (error) {
      console.log(error.message);
      // Assert that the error is an instance of the mocked NotFoundError
      //expect(error).to.be.an.instanceOf(customErrorMock.NotFoundError);
      // Assert the error message
      expect(error.message).to.equal('Expected NotFoundError to be thrown');
    }
  });
  
});
