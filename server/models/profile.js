const mongoose = require("mongoose");

// Define the possible options for personalityType
const personalityTypeOptions = ["MBTI", "Enneagram", "Zodiac"];

// Define the possible values for each personality type
const personalityTypeValues = {
  MBTI: [
    "INFP",
    "INFJ",
    "ENFP",
    "ENFJ",
    "INTJ",
    "INTP",
    "ENTP",
    "ENTJ",
    "ISFP",
    "ISFJ",
    "ESFP",
    "ESFJ",
    "ISTP",
    "ISTJ",
    "ESTP",
    "ESTJ",
  ],
  Enneagram: [
    "1w2",
    "2w3",
    "3w2",
    "3w4",
    "4w3",
    "4w5",
    "5w4",
    "5w6",
    "6w5",
    "6w7",
    "7w6",
    "7w8",
    "8w7",
    "8w9",
    "9w8",
    "9w1",
  ],
  Zodiac: [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ],
};

// Create the Mongoose schema
const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  profilePic: {
    type: String, // You can store the URL or file path of the profile picture
    required: false,
  },
  comments: [
    {
      text: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      personality: [
        {
          type: {
            type: String,
            enum: personalityTypeOptions, // Restrict values to the defined options
            required: true,
          },
          value: {
            type: String,
            validate: {
              validator: function (value) {
                // Ensure the selected value is one of the allowed values for the specified personality type
                return personalityTypeValues[this.type].includes(value);
              },
              message: "Invalid personality type value",
            },
            required: true,
          },
        },
      ],

      likes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile", // Replace with the actual User model name
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

// Create the Mongoose model
const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
