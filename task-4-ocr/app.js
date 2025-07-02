const express = require('express');
const multer = require('multer');
const path = require('path');
const { createWorker } = require('tesseract.js');
const app = express();

// Simple storage configuration
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { amenities: null, imagePath: null });
});

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    console.log('Starting OCR...');
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(req.file.path);
    await worker.terminate();
    
    const amenities = processAmenities(text);
    res.render('index', { 
      amenities: amenities, 
      imagePath: null // Skip image display for now
    });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).send('OCR Processing Failed');
  }
});

function processAmenities(text) {
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' '); // Normalize whitespace

  const amenities = [];

  // Keyword patterns and aliases
  const patterns = [
    { label: 'wifi', pattern: /\bwifi\b/ },
    { label: 'pool', pattern: /\bpool\b/ },
    { label: 'gym', pattern: /\bgym\b/ },
    { label: 'house', pattern: /\bhouse\b/ },
    { label: 'resort', pattern: /\bresort\b/ },
    { label: 'parking', pattern: /\bparking\b/ },
    { label: 'restaurant', pattern: /\brestaurant\b/ },
    { label: 'spa', pattern: /\bspa\b/ },
    { label: 'bar', pattern: /\bbar\b/ },
    { label: 'beach', pattern: /\bbeach\b/ },
    { label: 'breakfast', pattern: /\bbreakfast\b/ },
    { label: 'laundry', pattern: /\blaundry\b/ },
    { label: 'air conditioning', pattern: /\b(air conditioning|air cond\.?|a\/c)\b/ },
    { label: 'living room', pattern: /(\d+)?\s*(living ?room)/ },
    { label: 'bedroom', pattern: /(\d+)?\s*(bed ?room|bedroom|br)\b/ },
    { label: 'bathroom', pattern: /(\d+)?\s*(bath ?room|bath|ba)\b/ },
    { label: 'eat-in kitchen', pattern: /\beat[ -]?in kitchen\b/ },
    { label: 'open house', pattern: /\bopen ?house\b/ },
    { label: 'commission', pattern: /\bcommission\b/ },
  ];

  for (const { label, pattern } of patterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      // Check for quantity like "3 bedrooms"
      if (match[1]) {
        amenities.push(`${match[1]} ${label}`);
      } else {
        amenities.push(label);
      }
    }
  }

  // Remove duplicates
  return [...new Set(amenities)];
}

app.listen(4000, () => console.log('Server running on http://localhost:4000'));