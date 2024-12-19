const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const univeristyExamController = require('../controllers/universityExamController');
const filePayloadExists = require('../middlewares/filePayloadExists');
const fileExtLimiter = require('../middlewares/fileExtLimiter');
const fileSizeLimiter = require('../middlewares/fileSizeLimiter');

router.get('/subjects', univeristyExamController.getSubjects)
      .get('/subcode', univeristyExamController.getSubcode)
      .get('/schedule', univeristyExamController.viewSchedules)
      .post('/', univeristyExamController.addSchedule)
      .post('/file-upload', fileUpload({ createParentPath: true }),
        filePayloadExists,
        fileExtLimiter([".xlsx"]),
        fileSizeLimiter,
        univeristyExamController.uploadFile)
      .delete('/:id', univeristyExamController.deleteSchedule);

module.exports = router;