import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
  console.log('Request body:', req.body);

  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: 'missing details',
    });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'user already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // SENDING WELCOME EMAIL
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `welcome to excel analytics `,
      text: `welcome to excel analytics website . your account has been created with email id ${email}`,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }

    return res.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Registration error:', error);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  console.log('Request body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: 'email and password are required',
    });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'Invalid email ' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, role: user.role });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
    });
    return res.json({ success: true, message: 'logged Out' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const CheckUser = async (req, res) => {
  try {
    const userFromToken = req.user;
    if (!userFromToken) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Fetch full user data from DB excluding password
    const user = await userModel.findById(userFromToken._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in database' });
    }
    return res.status(200).json({ success: true, user, role: user.role });
  } catch (error) {
    console.error('CheckUser error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

