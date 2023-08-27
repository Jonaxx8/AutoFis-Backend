const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const tmImage = require('@teachablemachine/image');

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Load the Teachable Machine model
const modelURL = './model/model.json';
const metadataURL = './model/metadata.json';
let model, maxPredictions;

async function initModel() {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Initialize the model
initModel();

app.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;

        // Process the image using the Teachable Machine model
        const image = await tmImage.image.load(imageBuffer);
        const prediction = await model.predict(image);

        // Respond with the predictions
        res.json({ predictions: prediction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
