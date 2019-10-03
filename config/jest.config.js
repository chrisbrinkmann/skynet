// runs before every Jest test in the test environment.
require('dotenv').config({
  path: './config/.env.test' // path is relative to project directory (package.json)
})
