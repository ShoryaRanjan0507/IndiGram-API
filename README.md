# 🇮🇳 IndiGram API

A production-grade SaaS platform providing standardized, hierarchical geographical data (State/District/Sub-District/Village) and Pincode mappings for India. Built for speed, scale, and seamless developer integration.

![IndiGram Hero Interface](public/hero.jpg)

## ✨ Features

- **Blazing Fast Search**: Real-time geographical queries (Village, District, State) utilizing optimized Prisma queries on a Serverless NeonDB PostgreSQL database.
- **Rich Data Set**: Comprehensive Indian geographical hierarchy linked with official Pincodes.
- **RESTful API**: Clean `/api/v1/search` endpoint built on Next.js App Router.
- **Smart Rate Limiting**: Built-in API quota tracking distinguishing between anonymous users and premium API keys.
- **Premium User Interface**: A highly polished, dynamic, and responsive search experience with debounced inputs and instant results mapping.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Hosted on NeonDB)
- **ORM:** Prisma Client
- **Deployment:** Vercel
- **Styling:** Vanilla CSS with modern dynamic aesthetics (Glassmorphism, animations)
- **Language:** TypeScript

## 🚀 Getting Started Locally

### Prerequisites
- Node.js installed
- A PostgreSQL database (NeonDB recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShoryaRanjan0507/IndiGram-API.git
   cd "IndiGram API"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   Create a `.env` file in the root directory and add your database URL:
   ```env
   DATABASE_URL="postgresql://username:password@your-database-url"
   ```

4. **Generate the Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the search interface.

## 📡 API Usage

### `GET /api/v1/search`

Search the geographical database by village, district, or state.

**Parameters:**
- `q` (string): Your search query.

**Headers:**
- `x-api-key` (optional): Your developer API key (Defaults to `anonymous` tracking).
- `x-plan-tier` (optional): Set to `FREE` or `PREMIUM`.

**Example Request:**
```bash
curl -X GET "https://indi-gram-api.vercel.app/api/v1/search?q=Bengaluru" \
     -H "x-api-key: your-api-key"
```

## 🌐 Live Production
The API and frontend are currently deployed and running on Vercel:
**[https://indi-gram-api.vercel.app](https://indi-gram-api.vercel.app)**
