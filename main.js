const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

require('dotenv').config();

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;
const dataFilePath = path.join(__dirname, 'customers-100000.csv');

let customers = [];
let isLoading = false;
let loadPromise = null;

const loadCustomers = () => {
  if (customers.length) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  isLoading = true;
  const rows = [];
  let index = 0;

  loadPromise = new Promise((resolve, reject) => {
    fs.createReadStream(dataFilePath)
      .pipe(csv())
      .on('data', (row) => {
        index += 1;
        rows.push({
          id: index,
          companyId: row['Customer Id'],
          name: row['Company'],
          email: row['Email'],
          status: row['Country'],
          updatedAt: row['Subscription Date'],
          city: row['City'],
          phone: row['Phone 1'],
          website: row['Website']
        });
      })
      .on('end', () => {
        customers = rows;
        isLoading = false;
        loadPromise = null;
        console.info(`Loaded ${customers.length} customers from CSV`);
        resolve();
      })
      .on('error', (error) => {
        isLoading = false;
        loadPromise = null;
        console.error('Failed to load CSV data', error);
        reject(error);
      });
  });

  return loadPromise;
};

app.get('/api/customers/load', async (req, res) => {
  try {
    await loadCustomers();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load customer data', error: error?.message ?? error });
  }
  return res.status(200).json({ message: 'Customer data loaded successfully' });
});

app.get('/api/customers', async (req, res) => {

  const start = parseInt(req.query.start ?? '0', 10);
  const limit = parseInt(req.query.limit ?? '10', 10);

  if (Number.isNaN(start) || Number.isNaN(limit) || start < 0 || limit <= 0) {
    return res.status(400).json({ message: 'Invalid start or limit parameters' });
  }

  const sliceStart = Math.min(start, customers.length);
  const sliceEnd = Math.min(sliceStart + limit, customers.length);
  const data = customers.slice(sliceStart, sliceEnd);

  res.json({
    data,
    start: sliceStart,
    limit,
    total: customers.length,
    hasMore: sliceEnd < customers.length
  });
});


app.listen(port, () => {
  console.info(`Server is running on port ${port}`);
});