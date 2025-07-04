const dotenv = require('dotenv');
dotenv.config();

const pool = require('../config/postgresdb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    [username, email, hashed]
  );
  res.status(201).json(result.rows[0]);
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

// Logout (frontend just deletes token, but we simulate it here)
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// Get all users
exports.getAll = async (req, res) => {
  const result = await pool.query('SELECT id, username, email FROM users');
  res.json(result.rows);
};

// Get user by ID
exports.getById = async (req, res) => {
  const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
};

// Update user
exports.update = async (req, res) => {
  const { username, email, id } = req.body;
  const result = await pool.query(
    'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
    [username, email, id]
  );
  res.json(result.rows[0]);
};

// Delete user
exports.delete = async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ message: 'User deleted' });
};
