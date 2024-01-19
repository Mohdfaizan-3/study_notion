const Section = require("../models/section");
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.createSubsection = async (req, res) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;
    const video = req.files.videoFile;

    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
        success: true,
        message: "section created successfully",
        updatedSection
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "subsection not created",
    });
  }
};
