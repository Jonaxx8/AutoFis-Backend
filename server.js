const express = require('express');
const multer = require('multer');
const fs = require('fs'); // Import the fs module
const path = require('path'); // Import the path module
const app = express();
const port = process.env.PORT || 3000; // Use a different port for AWS

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
    const imageBuffer = req.file.buffer;

    // Save the image to a folder on the server
    const imageName = 'uploaded-image.jpg'; // Choose a suitable name
    const imagePath = path.join(__dirname, 'images', imageName);
    //remove image before saving
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    fs.writeFileSync(imagePath, imageBuffer);
    
    // Respond with a success message
    res.json({ message: 'Image uploaded successfully' });
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(port, () => console.log(`Server listening on port ${port}!`));