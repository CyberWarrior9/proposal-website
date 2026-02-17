# 💍 Romantic Proposal Website

A beautiful, mobile-first romantic proposal website with a playful "impossible NO button" and backend integration to record YES responses.

![Preview](https://img.shields.io/badge/Mobile--First-💕-ff6b9d)
![Express](https://img.shields.io/badge/Backend-Express.js-404040)

## ✨ Features

- **Mobile-First Design**: Optimized for touch devices with large, accessible buttons
- **Floating Hearts Animation**: Romantic background with continuously floating heart emojis
- **Impossible NO Button**: 
  - On mobile: Instantly moves away when touched (minimum 100px from touch point)
  - On desktop: Slides away on hover
  - Tracks attempts and shows witty messages
- **YES Button with Backend**: Records responses with timestamp
- **Success Celebration**: Modal popup + confetti animation
- **Responsive**: Works on all screen sizes

## 📁 Project Structure

```
proposal-website/
├── backend/
│   ├── package.json      # Node.js dependencies
│   ├── server.js         # Express.js server
│   └── responses.json    # Data storage (auto-created)
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── styles.css        # All styling
│   └── script.js         # Interactive logic
└── README.md             # This file
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 14+ installed

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:3000`

**Backend Endpoints:**
- `POST /yes` - Records a YES response
- `GET /responses` - View all responses
- `GET /health` - Health check
- `GET /` - API info

### 2. Serve the Frontend

Option A: Open directly
```bash
cd frontend
# Open index.html in your browser
```

Option B: Use a simple server (recommended for mobile testing)
```bash
cd frontend
npx serve -p 8080
# Or with Python
python -m http.server 8080
```

The frontend will be at `http://localhost:8080`

### 3. Update API URL

In `frontend/script.js`, update the API_BASE_URL:

```javascript
const API_BASE_URL = 'http://localhost:3000'; // For local dev
```

## 🌐 Deployment

### Backend Deployment (Free Options)

#### Option 1: Render (Recommended)
1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo or upload files
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
5. Deploy!

Your backend will be at: `https://your-app-name.onrender.com`

#### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo
4. Railway auto-detects Node.js
5. Deploy!

#### Option 3: Glitch
1. Go to [glitch.com](https://glitch.com)
2. Create new Node.js project
3. Upload `backend/server.js` and `backend/package.json`
4. Project will be live instantly

### Frontend Deployment (Static Hosting)

#### Option 1: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `frontend` folder
3. Site is live instantly!

#### Option 2: Vercel
```bash
cd frontend
npx vercel --prod
```

#### Option 3: GitHub Pages
1. Push code to GitHub
2. Go to Settings → Pages
3. Select source as main branch /docs folder (or use GitHub Actions)

### Update Frontend API URL for Production

After deploying backend, update `frontend/script.js`:

```javascript
const API_BASE_URL = 'https://your-backend-name.onrender.com';
```

Then redeploy frontend.

## 📱 Mobile Testing

### Test on Your Phone

1. Find your computer's local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Update `API_BASE_URL` in script.js to use your IP:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.X:3000';
   ```

3. Start backend with host 0.0.0.0:
   ```bash
   cd backend
   # Edit server.js, change last line to:
   app.listen(PORT, '0.0.0.0', () => {...})
   ```

4. Access from phone: `http://192.168.1.X:8080`

### Chrome DevTools Mobile Simulation
1. Open frontend in Chrome
2. Press F12 → Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device (iPhone, Pixel, etc.)
4. Test touch interactions

## 🔧 Customization

### Change the Question
Edit `frontend/index.html`:
```html
<h1 class="question">Your custom question here?</h1>
```

### Change Colors
Edit `frontend/styles.css` CSS variables:
```css
:root {
    --primary-pink: #ff6b9d;
    --dark-pink: #ff4785;
    /* ... more colors ... */
}
```

### Change Messages
Edit `frontend/script.js`:
```javascript
// In handleNoClick()
alert('Your custom message');

// In sendYesResponse()
body: JSON.stringify({ message: "Your custom message 💍" })
```

### Change NO Button Behavior
Adjust `MIN_ESCAPE_DISTANCE` in script.js:
```javascript
const MIN_ESCAPE_DISTANCE = 150; // Pixels away from touch
```

## 🛠️ API Documentation

### POST /yes
Records a YES response.

**Request Body:**
```json
{
  "message": "Your custom message"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "message": "Your Billota is ready to marry you 💍"
  },
  "totalResponses": 5
}
```

### GET /responses
Returns all recorded responses.

**Response:**
```json
{
  "count": 5,
  "responses": [...]
}
```

## 📝 Notes

- **Data Persistence**: Responses are saved to `backend/responses.json`
- **CORS**: Backend allows all origins for easy frontend deployment
- **Mobile Detection**: Uses CSS `pointer: coarse` media query
- **Session Storage**: NO attempts are tracked per session (cleared on browser close)

## 💖 Credits

Made with love for that special someone 💕

## 📄 License

MIT License - Feel free to use and customize!
