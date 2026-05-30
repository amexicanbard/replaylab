const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-admin';
const VIEWER_PASSWORD = process.env.VIEWER_PASSWORD || 'change-me-viewer';

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const UPLOADS_DIR = path.join(ROOT, 'uploads');
const DATA_FILE = path.join(DATA_DIR, 'map-data.json');

const DEFAULT_PIN_TYPES = [
  { id: 'type-battle', name: 'Battle', icon: '⚔️', color: '#dc2626' },
  { id: 'type-town', name: 'Town', icon: '🏠', color: '#16a34a' },
  { id: 'type-event', name: 'Event', icon: '★', color: '#eab308' },
  { id: 'type-poi', name: 'Point of Interest', icon: '📍', color: '#2563eb' },
];
const DEFAULT_MAP = {
  backgroundImage: '',
  layers: [],
  pinTypes: DEFAULT_PIN_TYPES,
  pins: [],
};

for (const dir of [DATA_DIR, UPLOADS_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_MAP, null, 2));
}

function readMap() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return { ...DEFAULT_MAP };
  }
}
function writeMap(map) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(map, null, 2));
}

// In-memory session tokens: token -> role
const tokens = new Map();
function issueToken(role) {
  const token = crypto.randomBytes(24).toString('hex');
  tokens.set(token, role);
  return token;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

function auth(allowedRoles) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const role = token ? tokens.get(token) : null;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.role = role;
    next();
  };
}

// --- Auth ---
app.post('/api/login', (req, res) => {
  const { mode, password } = req.body || {};
  if (mode === 'admin' && password === ADMIN_PASSWORD) {
    return res.json({ token: issueToken('admin'), role: 'admin' });
  }
  if (mode === 'viewer' && password === VIEWER_PASSWORD) {
    return res.json({ token: issueToken('viewer'), role: 'viewer' });
  }
  // The admin password can also be used to enter viewer mode.
  if (mode === 'viewer' && password === ADMIN_PASSWORD) {
    return res.json({ token: issueToken('admin'), role: 'admin' });
  }
  return res.status(401).json({ error: 'Incorrect password' });
});

// --- Map data ---
app.get('/api/map', auth(['admin', 'viewer']), (req, res) => {
  res.json(readMap());
});

app.put('/api/map', auth(['admin']), (req, res) => {
  const body = req.body || {};
  const map = {
    backgroundImage:
      typeof body.backgroundImage === 'string' ? body.backgroundImage : '',
    layers: Array.isArray(body.layers) ? body.layers : [],
    pinTypes: Array.isArray(body.pinTypes) ? body.pinTypes : [],
    pins: Array.isArray(body.pins) ? body.pins : [],
  };
  writeMap(map);
  res.json(map);
});

// --- Image upload ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    cb(null, `bg-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

app.post('/api/upload', auth(['admin']), (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ path: `uploads/${req.file.filename}` });
  });
});

app.listen(PORT, () => {
  console.log(`Interactive Map server running on http://localhost:${PORT}`);
});
