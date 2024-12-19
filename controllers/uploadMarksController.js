const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Email = require("../models/Email");

const directoryPath = path.resolve(__dirname, '../USN_Results');

const deleteDirectory = (directoryPath) => {
    if (fs.existsSync(directoryPath)) {
        // Read all files and directories inside the given directory
        fs.readdirSync(directoryPath).forEach((file) => {
            const currentPath = path.join(directoryPath, file);
            
            // Check if it's a directory or file
            if (fs.lstatSync(currentPath).isDirectory()) {
                // Recursively delete subdirectory
                deleteDirectory(currentPath);
            } else {
                // Delete file
                fs.unlinkSync(currentPath);
            }
        });

        // Remove the now-empty directory
        fs.rmdirSync(directoryPath);
        console.log(`Directory deleted: ${directoryPath}`);
    } else {
        console.log(`Directory not found: ${directoryPath}`);
    }
}

const uploadFile = async (req, res) => {
    const files = req.files;
    console.log(files);

    Object.keys(files).forEach(key => {
        // filepath needs to be changed
        const filepath = path.join(__dirname, "..", 'USN_Results', files[key].name);
        files[key].mv(filepath, (err) => {
            if (err) return res.status(500).json({ status: "error", message: err });
        })
    })

    return res.status(201).json({ status: "success", message: Object.keys(files).toString() });
}

const sendFileViaMail = async (req, res) => {
    try {
        const {semVal} = req.query
        console.log(semVal);

        const files = await fs.promises.readdir(directoryPath);
        console.log(files);

        if (files.length === 0) {
            return res.status(404).json({ message: 'No files found in the directory' });
        }

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            // Configure your email provider details here
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });

        const attachments = files.map((file) => {
            const filePath = path.join(directoryPath, file);
            if (fs.existsSync(filePath)) {  
                return { path: filePath };
            }
            return null;
        }).filter((attachment) => attachment !== null);

        console.log("Attachments ", attachments);

        const obj = await Email.findOne({ sem: semVal }, { emails: 1, _id: 0 });

        const emailList = obj.emails;
        console.log(emailList);

        // return res.status(200).json({ message: 'Email sent successfully' });

        for (const email of emailList) {
            // Prepare the email message
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Seat arrangement Excel Files',
                text: 'Please find the files attached.',
                attachments: attachments  // Assuming attachments is an array
            };

            // Send the email
            const sendMailPromise = new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            });

            try {
                await sendMailPromise; // Wait for each email to be sent
                console.log(`Email sent to ${email}`);
            } catch (error) {
                console.error(`Error sending email to ${email}:`, error);
            }
        }

        deleteDirectory(directoryPath);

        return res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'An error occurred while sending the email' });
    }
}

module.exports = { uploadFile, sendFileViaMail };