'use strict'
module.exports = {
  NODE_ENV: '"production"',
  CHOPPING_BOARD_KEY: JSON.stringify(process.env.CHOPPING_BOARD_KEY),
  DROPBOX_KEY: JSON.stringify(process.env.DROPBOX_KEY),
  GOOGLE_DRIVE_KEY: JSON.stringify(process.env.GOOGLE_DRIVE_KEY),
  APP_MODE: JSON.stringify(process.env.APP_MODE),
}
