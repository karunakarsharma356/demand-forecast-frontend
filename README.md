# AI Demand Forecasting & Inventory Optimization — Dashboard

React frontend for visualizing AI-driven demand forecasts and inventory optimization
recommendations, built on top of a FastAPI + XGBoost/Prophet backend.

See the backend repo for the full ML pipeline, methodology, and results:
[demand-forecast-backend](https://github.com/karunakarsharma356/demand-forecast-backend)

## Features

- Category selector across 15 top-performing product categories
- Live next-day demand forecast (XGBoost model)
- Inventory metrics: safety stock, reorder point, Economic Order Quantity (EOQ)
- Comparative bar chart of average daily demand vs. safety stock across categories
- Full inventory plan table for all categories

## Tech stack

- React (Vite)
- Recharts (data visualization)
- Axios (API calls)

## Running locally

1. Make sure the backend API is running (see backend repo README) at `http://127.0.0.1:8000`
2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

3. Open `http://localhost:5173`


## Author

Karunakar Sharma — final-year B.Tech CSE student, NIET Noida