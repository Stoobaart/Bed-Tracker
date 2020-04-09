module.exports = {
  'script-src': [
    "'self'",
    "'unsafe-eval'",
    "'unsafe-inline'",
    "http://*.hotjar.com",
    "https://*.hotjar.com",
    "http://*.hotjar.io",
    "https://*.hotjar.io"
  ],
  'connect-src': [
    "'self'",
    'localhost',
    "https://bed-checker.gigalixirapp.com/api",
    "https://bed-checker-staging.gigalixirapp.com/",
    "http://*.hotjar.com:*",
    "https://*.hotjar.com:*",
    "http://*.hotjar.io",
    "https://*.hotjar.io",
    "wss://*.hotjar.com"
  ],
  'manifest-src': [],
  'img-src': [
    "'self'",
    "data:",
    "data: blob: ",
    "http://*.hotjar.com",
    "https://*.hotjar.com",
    "http://*.hotjar.io",
    "https://*.hotjar.io"
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
    "'self'",
    "https://*.hotjar.com",
    "http://*.hotjar.io",
    "https://*.hotjar.io"
  ],
  'font-src': [
    "'self'",
    "data: ",
    "https://fonts.gstatic.com",
    "http://*.hotjar.com",
    "https://*.hotjar.com",
    "http://*.hotjar.io",
    "https://*.hotjar.io"
  ],
  'media-src': [
    "'self'",
  ],
  'child-src': [
    "'self'",
    "blob: "
  ]
}; 
