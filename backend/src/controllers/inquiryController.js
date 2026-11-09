const Inquiry = require('../models/Inquiry');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
  const { name, phone, email, serviceType, message } = req.body;

  if (!name || !phone || !serviceType) {
    return res.status(400).json({ message: 'Please provide name, phone and service type' });
  }

  try {
    const inquiry = await Inquiry.create({
      name,
      phone,
      email,
      serviceType,
      message,
    });
    return res.status(201).json(inquiry);
  } catch (error) {
    console.error('Create inquiry error:', error.message);
    return res.status(500).json({ message: 'Failed to submit inquiry' });
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin)
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    return res.json(inquiries);
  } catch (error) {
    console.error('Get inquiries error:', error.message);
    return res.status(500).json({ message: 'Failed to retrieve inquiries' });
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id
// @access  Private (Admin)
const updateInquiryStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Reviewed', 'Contacted'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.status = status;
    const updatedInquiry = await inquiry.save();
    return res.json(updatedInquiry);
  } catch (error) {
    console.error('Update inquiry error:', error.message);
    return res.status(500).json({ message: 'Failed to update inquiry status' });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await inquiry.deleteOne();
    return res.json({ message: 'Inquiry removed successfully' });
  } catch (error) {
    console.error('Delete inquiry error:', error.message);
    return res.status(500).json({ message: 'Failed to delete inquiry' });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
};
