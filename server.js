const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload-image', upload.single('image'), async (req, res) => {
    const imageBuffer = req.file.buffer;
    const imageName = 'uploaded-image.jpg';
    const imagePath = path.join(__dirname, 'images', imageName);
    
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    fs.writeFileSync(imagePath, imageBuffer);

    // Load your TensorFlow.js model
    const model = await tf.loadLayersModel('./model/model.json'); // Replace with your model path

    // Preprocess the image
    const image = preprocessImage(imagePath); // Implement preprocessImage function

    // Perform inference
    const predictions = model.predict(image);
    
    // Assuming you have a function to get the predicted fish name from predictions
    const predictedFishName = getPredictedFishName(predictions);

    res.json({ fishName: predictedFishName }); // Send the predicted fish name as the response
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
