const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const directoryPath = path.resolve(__dirname, '../uploadedExcels');

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

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    deleteDirectory(directoryPath);

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    res.sendStatus(204);
}

module.exports = { handleLogout };