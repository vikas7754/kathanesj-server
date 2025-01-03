const queryMail = require("../emails/emails/query-email");
const Enquiry = require("../models/enquiry");

const addEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    queryMail(enquiry);
    return res.status(201).json({ message: "Enquiry added successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEnquiries = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Enquiry.countDocuments();
    return res.status(200).json({ enquiries, total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addEnquiry, getEnquiries };
