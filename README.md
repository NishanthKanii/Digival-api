# NRecords API

A RESTful API service for serving customer data from CSV files. This API provides endpoints to load and retrieve customer records with pagination support.

## Features

- Load customer data from CSV files
- Paginated customer data retrieval
- CORS enabled for cross-origin requests
- Environment-based configuration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the API directory:
```bash
cd api
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the `api` directory (optional):
```env
PORT=3000
```

If no `.env` file is provided, the API will default to port 3000.

## Running the API

### Development Mode
```bash
npm run dev
```
This uses `nodemon` to automatically restart the server on file changes.

### Production Mode
```bash
npm start
```

## API Endpoints

### Load Customer Data
Loads customer data from the CSV file into memory.

**Endpoint:** `GET /api/customers/load`

**Response:**
```json
{
  "message": "Customer data loaded successfully"
}
```

**Error Response:**
```json
{
  "message": "Failed to load customer data",
  "error": "Error message"
}
```

### Get Customers (Paginated)
Retrieves a paginated list of customers.

**Endpoint:** `GET /api/customers`

**Query Parameters:**
- `start` (optional): Starting index for pagination (default: 0)
- `limit` (optional): Number of records to return (default: 10)

**Example Request:**
```
GET /api/customers?start=0&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "companyId": "CUST001",
      "name": "Company Name",
      "email": "email@example.com",
      "status": "Country",
      "updatedAt": "2024-01-01",
      "city": "City Name",
      "phone": "123-456-7890",
      "website": "https://example.com"
    }
  ],
  "start": 0,
  "limit": 10,
  "total": 100000,
  "hasMore": true
}
```

**Error Response:**
```json
{
  "message": "Invalid start or limit parameters"
}
```

## Data Structure

The API reads from `customers-100000.csv` and maps the following fields:
- `Customer Id` → `companyId`
- `Company` → `name`
- `Email` → `email`
- `Country` → `status`
- `Subscription Date` → `updatedAt`
- `City` → `city`
- `Phone 1` → `phone`
- `Website` → `website`

Each record is assigned a sequential `id` starting from 1.

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server in development mode with auto-reload
- `npm run build` - Build/run the server
- `npm run clean` - Remove node_modules and package-lock.json
- `npm test` - Run tests (currently not implemented)

## Dependencies

- **express** - Web framework
- **cors** - Cross-Origin Resource Sharing middleware
- **csv-parser** - CSV file parsing
- **dotenv** - Environment variable management

## Development Dependencies

- **rimraf** - Cross-platform file deletion utility
- **nodemon** - Development server with auto-reload

## Notes

- Customer data is loaded into memory on first access or when explicitly requested via `/api/customers/load`
- The data remains in memory for the duration of the server process
- The CSV file must be present in the API directory as `customers-100000.csv`

