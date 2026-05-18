# Interactive Map App

A Genially-style interactive image map. An **admin** uploads a custom
background image, places clickable pins and toggleable layers on top of it, and
**viewers** access it via a password-protected page to explore the content.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Storage:** JSON file (`data/map-data.json`) + uploaded images in `uploads/`
- No database required.

## Modes

| Mode | Route | Capabilities |
| --- | --- | --- |
| **User** | `/` | Password-protected. Click pins to read content, toggle layers, zoom & pan. Read-only. |
| **Admin** | `/admin` | Password-protected. Upload a background image, place/drag/edit/delete pins, create layers, preview layer visibility. |

## Project structure

```
client/        React frontend (Vite)
server/        Express backend + REST API
uploads/       Stored background images
data/          map-data.json (persisted map state)
.env           Passwords & port (you create this)
```

## Setup

### 1. Configure passwords

Copy the example env file and edit the values:

```bash
cp .env.example .env
```

```ini
ADMIN_PASSWORD=your-admin-password
VIEWER_PASSWORD=your-viewer-password
PORT=4000
```

The `.env` file lives at the **project root** and is read by the server.
The admin password also works for entering User Mode.

### 2. Install dependencies

```bash
npm run install:all
```

This installs the root tooling plus `server/` and `client/` dependencies.
(Equivalent: `npm install && npm install --prefix server && npm install --prefix client`.)

### 3. Run locally

Start both the API and the frontend together:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API:      http://localhost:4000

The Vite dev server proxies `/api` and `/uploads` to the backend, so you only
need to open the frontend URL.

To run them separately:

```bash
npm run server   # Express API only
npm run client   # Vite dev server only
```

## Usage

1. Open http://localhost:5173/admin and sign in with the **admin password**.
2. Upload a background image.
3. Click **+ Add pin**, then click anywhere on the map to drop a pin. Fill in
   the title, description (Markdown supported), optional image/link, and assign
   layers.
4. Drag pins to reposition them; click a pin to edit it.
5. Create layers and toggle them to preview what viewers will see.
6. All changes save automatically to `data/map-data.json`.
7. Open http://localhost:5173/ and sign in with the **viewer password** to use
   the read-only experience.

## Production build

```bash
npm run build              # builds client/dist
npm --prefix server start  # runs the API
```

Serve `client/dist` with any static host (point its `/api` and `/uploads`
requests at the running Express server).

## Data model (`data/map-data.json`)

```json
{
  "backgroundImage": "uploads/map.jpg",
  "layers": [
    { "id": "layer-1", "name": "Layer Name", "visible": true }
  ],
  "pins": [
    {
      "id": "pin-1",
      "x": 45.2,
      "y": 30.8,
      "title": "Pin Title",
      "description": "Markdown content",
      "imageUrl": "",
      "linkUrl": "",
      "layers": ["layer-1"]
    }
  ]
}
```

Pin coordinates `x`/`y` are percentages of the image width/height, so pins stay
correctly placed across screen sizes.
