module.exports = {
  'script-src': [
    "'self'",
    "'unsafe-eval'"
  ],
  'connect-src': [
    "'self'",
    'localhost',
    "https://bed-checker.gigalixirapp.com/api"
  ],
  'manifest-src': [],
  'img-src': [
    "'self'",
    "data:",
    "data: blob: "
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com"
  ],
  'style-src-elem': [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com"
  ],
  'frame-src': [
    "'self'"
  ],
  'font-src': [
    "'self'",
    "data: ",
    "https://fonts.gstatic.com"
  ],
  'media-src': [
    "'self'",
  ],
  'child-src': [
    "'self'",
    "blob: "
  ]
}; 
