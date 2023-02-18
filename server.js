const express = require('express');
const app = express();
var path = require('path')
const port = 3000;
const fileUpload = require('express-fileupload');
const {
    body,
    validationResult,
    check
} = require('express-validator');

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json())
app.use(fileUpload());

app.listen(port, function () {
    console.log('See where it all happens at http://localhost:' + port);
});


app.post('/register',
    body('firstname').not().isEmpty().trim().escape().withMessage('FirstName must not be empty.'),
    body('lastname').not().isEmpty().trim().escape().withMessage('LastName must not be empty.'),
    body('email').isEmail().normalizeEmail().withMessage('Email must not be empty.'),
    body('userImage').custom((value, {
        req,
        res,
        next
    }) => {
        console.log('DD::::::::::>>', path.extname(req.files.userImage.name))
        let file_ex = ['.docx', '.doc'];
        if (file_ex.includes(path.extname(req.files.userImage.name))) {
            return true;
        } else {
            return false;
        }
    })
    .withMessage('Please only submit document file.'),
    (req, res) => {
        console.log(req.body);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        res.status(200).json({
            status: 200,
            data: req.body
        })
    });