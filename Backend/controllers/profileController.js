const Profile = require('../models/Profile');

exports.createProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const userId = req.user.uid;
    const photoPath = req.file ? req.file.path : '';

    // Check if profile already exists for this Firebase UID
    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = new Profile({
      user: userId,
      name,
      bio,
      photo: photoPath,
    });

    await profile.save();

    res.status(201).json(profile);
  } catch (err) {
    console.error('Create profile error:', err);
    res.status(500).json({ error: 'Server error while creating profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.file) updates.photo = req.file.path;

    updates.updatedAt = Date.now();

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: updates },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.uid;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};
