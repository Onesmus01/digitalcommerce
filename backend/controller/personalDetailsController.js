import PersonalDetails from "../models/PersonalDetailsModel.js";

// CREATE or UPDATE personal details
export const upsertPersonalDetails = async (req, res) => {
  try {
    const personalDetails = await PersonalDetails.findOneAndUpdate(
      { user: req.userId },
      { ...req.body, user: req.userId },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      personalDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET personal details
export const getPersonalDetails = async (req, res) => {
  try {
    const details = await PersonalDetails.findOne({
      user: req.userId,
    });

    res.status(200).json({
      success: true,
      details,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
