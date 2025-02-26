let model;
let webcam;
let canvas;
let ctx;
let isWebcamActive = false;

// Initialize the face detection model
async function initializeModel() {
    try {
        model = await blazeface.load();
        console.log('Face detection model loaded successfully');
    } catch (error) {
        console.error('Error loading face detection model:', error);
    }
}

// Initialize the application
async function init() {
    canvas = document.getElementById('output');
    ctx = canvas.getContext('2d');
    webcam = document.getElementById('webcam');

    // Set up event listeners
    document.getElementById('webcamButton').addEventListener('click', toggleWebcam);
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

    // Initialize the model
    await initializeModel();
}

// Toggle webcam on/off
async function toggleWebcam() {
    if (!isWebcamActive) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcam.srcObject = stream;
            webcam.style.display = 'block';
            isWebcamActive = true;
            document.getElementById('webcamButton').innerHTML = '<i class="fas fa-camera-slash"></i> Stop Webcam';
            detectFromVideo();
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    } else {
        const stream = webcam.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        webcam.style.display = 'none';
        isWebcamActive = false;
        document.getElementById('webcamButton').innerHTML = '<i class="fas fa-camera"></i> Use Webcam';
        clearCanvas();
    }
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('uploadedImage');
            img.onload = () => detectFromImage(img);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Detect faces from video stream
async function detectFromVideo() {
    if (!isWebcamActive) return;

    // Set canvas dimensions to match video
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;

    // Detect faces
    const predictions = await model.estimateFaces(webcam, false);
    
    // Draw results
    ctx.drawImage(webcam, 0, 0);
    drawDetections(predictions);

    // Update results display
    updateResults(predictions);

    requestAnimationFrame(detectFromVideo);
}

// Detect faces from uploaded image
async function detectFromImage(img) {
    // Set canvas dimensions to match image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw image and detect faces
    ctx.drawImage(img, 0, 0);
    const predictions = await model.estimateFaces(img, false);
    
    // Draw detections and update results
    drawDetections(predictions);
    updateResults(predictions);
}

// Draw face detections on canvas
function drawDetections(predictions) {
    predictions.forEach(prediction => {
        // Draw bounding box
        ctx.strokeStyle = '#3D8D7A';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            prediction.topLeft[0],
            prediction.topLeft[1],
            prediction.bottomRight[0] - prediction.topLeft[0],
            prediction.bottomRight[1] - prediction.topLeft[1]
        );

        // Estimate age based on face size and position
        const faceWidth = prediction.bottomRight[0] - prediction.topLeft[0];
        const estimatedAge = estimateAge(faceWidth, prediction);

        // Draw age label
        ctx.fillStyle = '#3D8D7A';
        ctx.font = '16px Arial';
        ctx.fillText(
            `Age: ~${estimatedAge}`,
            prediction.topLeft[0],
            prediction.topLeft[1] - 5
        );
    });
}

// Update results display
function updateResults(predictions) {
    const resultsDiv = document.getElementById('results');
    if (predictions.length === 0) {
        resultsDiv.innerHTML = '<p class="placeholder-text">No faces detected</p>';
        return;
    }

    let resultsHTML = '<ul style="list-style: none; padding: 0;">';
    predictions.forEach((prediction, index) => {
        const faceWidth = prediction.bottomRight[0] - prediction.topLeft[0];
        const estimatedAge = estimateAge(faceWidth, prediction);
        resultsHTML += `
            <li style="margin-bottom: 10px;">
                <strong>Face ${index + 1}:</strong><br>
                Estimated Age: ~${estimatedAge} years<br>
                Confidence: ${(prediction.probability[0] * 100).toFixed(1)}%
            </li>`;
    });
    resultsHTML += '</ul>';
    resultsDiv.innerHTML = resultsHTML;
}

// Estimate age based on face features
function estimateAge(faceWidth, prediction) {
    // This is a simple estimation based on face size and position
    // In a real application, you would use a proper age estimation model
    const baseAge = 25;
    const sizeFactorAge = (faceWidth / 100) * 15;
    const randomVariation = Math.floor(Math.random() * 10) - 5;
    return Math.max(1, Math.min(99, Math.floor(baseAge + sizeFactorAge + randomVariation)));
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('results').innerHTML = '<p class="placeholder-text">No faces detected</p>';
}

// Initialize when the page loads
window.addEventListener('load', init);