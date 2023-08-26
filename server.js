const express = require('express');
const multer = require('multer');
const fs = require('fs'); // Import the fs module
const path = require('path'); // Import the path module
const app = express();
const port = process.env.PORT || 80; // Use a different port for AWS

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
    const imageBuffer = req.file.buffer;
    
    // Save the image to AWS S3 bucket instead of local file system
    // Refer to AWS SDK documentation for S3 usage

    // Respond with a success message
    res.json({ message: 'Image uploaded successfully' });
});

// Serve uploaded images using a URL
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
