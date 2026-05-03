# 🏛️ SKAP Architecture Solution

> AI-powered architectural floor plan generator using Google Gemini API

![SKAP Architecture Solution](https://img.shields.io/badge/SKAP-Architecture-gold?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange?style=flat-square&logo=google)

---

## 📋 Overview

SKAP Architecture Solution is a full-stack web application that lets users generate professional 2D architectural floor plans using Google Gemini AI. Users enter their plot dimensions and room requirements, and the AI generates a detailed, labeled floor plan within seconds.

---

## 🗂️ Project Structure

```
skap-architecture/
├── backend/                      # Node.js + Express API
│   ├── server.js                 # Main server entry point
│   ├── routes/
│   │   ├── planRoutes.js         # POST /api/plan/generate-plan
│   │   └── clientRoutes.js       # POST /api/client/submit
│   ├── controllers/
│   │   ├── planController.js     # Floor plan generation logic
│   │   └── clientController.js   # Client inquiry handler
│   ├── services/
│   │   └── geminiService.js      # Google Gemini API integration
│   ├── .env.example              # Environment variables template
│   └── package.json
│
├── frontend/                     # React.js application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                # Router + layout
│   │   ├── index.js              # React entry point
│   │   ├── index.css             # Global styles + design tokens
│   │   ├── components/
│   │   │   └── Navbar.js         # Navigation bar
│   │   ├── pages/
│   │   │   ├── HomePage.js       # Hero + client form
│   │   │   ├── CreatePlanPage.js # Plan builder (Step 1 & 2)
│   │   │   └── ContactPage.js    # Contact form
│   │   └── hooks/
│   │       └── useApi.js         # Custom API hooks
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
├── package.json                  # Root scripts
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+ and npm v8+
- A Google Gemini API key ([Get one free here](https://aistudio.google.com/app/apikey))

---

### Step 1: Clone / Download the project

```bash
cd skap-architecture
```

### Step 2: Set up the Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Install dependencies and start:
```bash
npm install
npm run dev      # Development (with nodemon auto-restart)
# or
npm start        # Production
```

The backend will run at **http://localhost:5000**

---

### Step 3: Set up the Frontend

```bash
cd frontend
cp .env.example .env
```

The `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Install and start:
```bash
npm install
npm start
```

The frontend will run at **http://localhost:3000**

---

## 🔑 Getting Your Gemini API Key

1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API key"**
4. Copy the key and paste it into `backend/.env`

> **Free tier**: Gemini 1.5 Flash is available on the free tier with generous limits (15 requests/min, 1500 requests/day).

---

## 🧠 Gemini API Integration

### How It Works

The app uses a two-model strategy for maximum reliability:

**Primary**: `gemini-2.0-flash-preview-image-generation`
- Generates actual raster images (PNG) of floor plans
- Most visually accurate results
- Requires image generation capability access

**Fallback**: `gemini-1.5-flash`
- Generates SVG vector floor plans via structured prompting
- Works on all Gemini API accounts
- Clean, scalable vector output

### Sample API Call (from `geminiService.js`)

```javascript
// Primary: Image generation model
const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`,
  {
    contents: [{
      parts: [{ text: "Generate a 2D floor plan for: 40x30 feet, 3 bedrooms, 1 kitchen..." }]
    }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  }
);

// Extract base64 image from response
const imagePart = response.data.candidates[0].content.parts
  .find(p => p.inlineData?.mimeType?.startsWith("image/"));

const base64Image = imagePart.inlineData.data;
const mimeType = imagePart.inlineData.mimeType; // e.g. "image/png"
```

### Sample Prompt Generated

```
Generate a detailed, professional 2D architectural floor plan for a residential 
house with the following specifications:

PLOT DIMENSIONS: 40 x 30 feet
NUMBER OF FLOORS: 2

ROOM REQUIREMENTS:
- Bedrooms: 3
- Kitchens: 1 (closed kitchen layout)
- Drawing Room: Include
- Dining Area: Include
- Store Room: Not required

DESIGN REQUIREMENTS:
- Clean top-view (bird's-eye) floor plan perspective
- Clearly labeled rooms with room names
- Proper wall thickness representation
- Door placements shown with standard architectural door symbols (arc)
- Window placements on exterior walls
...
```

---

## 🌐 API Endpoints

### `POST /api/plan/generate-plan`

Generate a floor plan from requirements.

**Request Body:**
```json
{
  "length": 40,
  "breadth": 30,
  "unit": "feet",
  "bedrooms": 3,
  "kitchens": 1,
  "drawingRoom": "yes",
  "diningArea": "yes",
  "storeRoom": "no",
  "kitchenType": "closed",
  "floors": 2
}
```

**Success Response (Image):**
```json
{
  "success": true,
  "model": "gemini-2.0-flash-preview-image-generation",
  "type": "image",
  "imageBase64": "iVBORw0KGgo...",
  "mimeType": "image/png",
  "prompt": "Generate a detailed..."
}
```

**Success Response (SVG Fallback):**
```json
{
  "success": true,
  "model": "gemini-1.5-flash (SVG fallback)",
  "type": "svg",
  "svgContent": "<svg viewBox=\"0 0 900 700\"...>...</svg>",
  "prompt": "Generate a detailed..."
}
```

---

### `POST /api/client/submit`

Submit a client inquiry.

**Request Body:**
```json
{
  "name": "John Smith",
  "contactNumber": "+91 98765 43210",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! We'll get in touch with you shortly.",
  "clientId": "SKAP-1717123456789"
}
```

### `GET /health`

Health check endpoint.

---

## 🔐 Security

- ✅ Gemini API key stored server-side only (`.env`)
- ✅ Never exposed to frontend
- ✅ Rate limiting: 20 requests per 15 minutes
- ✅ Helmet.js security headers
- ✅ CORS restricted to frontend URL
- ✅ Input validation on all endpoints

---

## 🎨 UI Features

- **Luxury architecture aesthetic** — dark obsidian theme with gold accents
- **Cormorant Garamond** display font — elegant and architectural
- **Blueprint grid background** on Plan Builder page — technical/drafting feel
- **3-step wizard** — Plot → Requirements → Result
- **Real-time form validation** with field-level error messages
- **Plan summary preview** before generation
- **Download as PNG or SVG**
- **Print-ready output** with project details header
- **Responsive design** — works on mobile and desktop
- **Loading animation** with spinning concentric rings

---

## 🚀 Production Deployment

### Backend (Railway / Render / Heroku)

1. Set environment variables:
   - `GEMINI_API_KEY` = your key
   - `NODE_ENV` = production
   - `FRONTEND_URL` = your frontend URL

2. Deploy the `backend/` folder

### Frontend (Vercel / Netlify)

1. Set environment variable:
   - `REACT_APP_API_URL` = your backend URL + `/api`

2. Build command: `npm run build`
3. Deploy the `frontend/` folder

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| `GEMINI_API_KEY is not configured` | Add your key to `backend/.env` |
| `403 / 401 from Gemini` | Invalid API key — check aistudio.google.com |
| `404 model not found` | Your key may not have image generation access — SVG fallback will activate |
| `CORS error` | Set `FRONTEND_URL` correctly in backend `.env` |
| `Request timeout` | Gemini can take up to 60s — the frontend waits up to 3 min |
| `Rate limit (429)` | Wait 15 minutes or upgrade your Gemini tier |

---

## 📦 Dependencies

### Backend
- `express` — Web server
- `axios` — HTTP client for Gemini API calls
- `dotenv` — Environment variable management
- `cors` — Cross-Origin Resource Sharing
- `helmet` — Security HTTP headers
- `morgan` — HTTP request logging
- `express-rate-limit` — API rate limiting

### Frontend
- `react` + `react-dom` — UI framework
- `react-router-dom` — Client-side routing
- `axios` — API calls
- `tailwindcss` — Utility CSS (via CDN in this setup)

---

## 📄 License

MIT © SKAP Architecture Solution 2024

---

*Built with ❤️ by the SKAP team — Powered by Google Gemini AI*
