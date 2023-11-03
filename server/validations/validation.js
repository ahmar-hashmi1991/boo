const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Request validation middleware function
const isValidObjectId = (value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid profile ID');
    }
    return true;
  };

const personalityTypeOptions = ["MBTI", "Enneagram", "Zodiac"];


const personalityTypeValues = {
  MBTI: ["INFP", "INFJ", /* Add more MBTI values here */],
  Enneagram: ["1w2", "2w3", /* Add more Enneagram types here */],
  Zodiac: ["Aries", "Taurus", /* Add more Zodiac signs here */]
};

const orderOptions = ["asc", "desc"];
const sortByOptions = ["likes", "timestamp"];
const personalityTypeOptionsForOrdering = ["MBTI", "Enneagram", "Zodiac", "all"]; // Include "all" as an option


const validatePersonalityTypes = (personalityTypes) => {
    if (!Array.isArray(personalityTypes) || personalityTypes.length === 0) {
      throw new Error('personalityTypes must be an array with at least one item');
    }
  
    const seenTypes = new Set();
  
    for (const typeObj of personalityTypes) {
      const { type, value } = typeObj;
  
      if (!type || !value) {
        throw new Error('Each personality type object must have "type" and "value" properties');
      }
  
      if (!personalityTypeOptions.includes(type)) {
        throw new Error(`Invalid personality type: ${type}`);
      }
  
      if (seenTypes.has(type)) {
        throw new Error(`Duplicate personality type: ${type}`);
      }
      seenTypes.add(type);
  
      if (!personalityTypeValues[type] || !personalityTypeValues[type].includes(value)) {
        throw new Error(`Invalid value "${value}" for personality type "${type}"`);
      }
    }
  
    return true;
  };
  
  // Create a route with request validation for the personalityTypes object

  
  
  
  
  

  const validateAuthorizationHeader = (value) => {
    if (!value) {
      throw new Error('Authorization header is missing');
    }
    return true;
  };

module.exports = {
    validateCreateProfileRequest() {
        // Define validation rules for the 'name' and 'profilePic' fields
        return [
            check('name').notEmpty().withMessage('Name is required'),
    check('description').optional(), // 'description' is optional
    check('profilePic').optional(),  //
        ]
          
       
      
      
      },
      validateGetProfileRequest(){
        return [
            check('profileId').custom(isValidObjectId).withMessage('Give a Valid Profile ID as it is  required'),
        ]
      },
      addCommentValidation(){
        return [
            check('profileId').custom(isValidObjectId).withMessage('Give a Valid Profile ID as it is  required'),
        ]
      },
      validateLikeComment(){
        return [
            check('profileId').custom(isValidObjectId).withMessage('Give a Valid Profile ID as it is  required'),
            check('commentId').custom(isValidObjectId).withMessage('Give a Valid CommentId ID as it is  required'),
            check('Authorization').custom(validateAuthorizationHeader).withMessage('Authorization header is missing'),
        ]
      },
      addPersonalityValidation(){
        return [
            check('profileId').custom(isValidObjectId).withMessage('Give a Valid Profile ID as it is  required'),
            check('commentId').custom(isValidObjectId).withMessage('Give a Valid CommentId ID as it is  required'),
            check('personalityTypes').custom(validatePersonalityTypes),
        ]
      },
      filteredAndsortedCommentsValidation(){
        return [
            check('profileId').custom(isValidObjectId).withMessage('Give a Valid Profile ID as it is  required'),
            
                // Validate the 'order' query parameter
                check('order')
                  .optional()
                  .custom((value) => {
                    if (!value || orderOptions.includes(value)) {
                      return true;
                    }
                    throw new Error('Invalid value for order');
                  }),
              
                // Validate the 'sortBy' query parameter
                check('sortBy')
                  .optional()
                  .custom((value) => {
                    if (!value || sortByOptions.includes(value)) {
                      return true;
                    }
                    throw new Error('Invalid value for sortBy');
                  }),
              
                // Validate the 'filterPersonalityType' query parameter
                check('filterPersonalityType')
                  .optional()
                  .custom((value) => {
                    if (!value || personalityTypeOptionsForOrdering.includes(value)) {
                      return true;
                    }
                    throw new Error('Invalid value for filterPersonalityType');
                  }),
              ]
        
      }
      
}
 

