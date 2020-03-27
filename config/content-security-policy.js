module.exports = {
  'script-src': [
    "'self'",
    "'unsafe-eval'"
  ],
  'connect-src': [
    "'self'",
    'localhost'
  ],
  'manifest-src': [],
  'img-src': [
    "'self'",
    "data:",
    "data: blob: "
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'"
  ],
  'frame-src': [
    "'self'"
  ],
  'font-src': [
    "'self'",
    "data: "
  ],
  'media-src': [
    "'self'",
  ],
  'child-src': [
    "'self'",
    "blob: "
  ]
}; 