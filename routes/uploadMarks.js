const express = require('express');
const router = express.Router();
const uploadMarksController = require("../controllers/uploadMarksController");
const fileUpload = require('express-fileupload');
const filePayloadExists = require('../middlewares/filePayloadExists');
const fileExtLimiter = require('../middlewares/fileExtLimiter');
const fileSizeLimiter = require('../middlewares/fileSizeLimiter');

router.get('/send-files', uploadMarksController.sendFileViaMail)
      .post('/file-upload', fileUpload({ createParentPath: true }),
        filePayloadExists,
        fileExtLimiter([".pdf"]),
        fileSizeLimiter,
        uploadMarksController.uploadFile);

module.exports = router;