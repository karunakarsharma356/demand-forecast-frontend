import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import './App.css'

const API_BASE = 'http://127.0.0.1:8000'

function App() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [forecast, setForecast] = useState(null)
  const [inventory, setInventory] = useState(null)
  const [dashboardData, setDashboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [catRes, dashRes] = await Promise.all([
          axios.get(`${API_BASE}/categories`),
          axios.get(`${API_BASE}/dashboard-summary`)
        ])
        setCategories(catRes.data.categories)
        setDashboardData(dashRes.data.summary)
        if (dashRes.data.summary.length > 0) {
          setSelectedCategory(dashRes.data.summary[0].category)
        }
        setLoading(false)
      } catch (err) {
        setError('Could not connect to the API. Make sure the FastAPI server is running on port 8000.')
        setLoading(false)
      }
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    if (!selectedCategory) return

    async function loadCategoryDetails() {
      try {
        const [forecastRes, inventoryRes] = await Promise.all([
          axios.get(`${API_BASE}/forecast/${encodeURIComponent(selectedCategory)}`),
          axios.get(`${API_BASE}/inventory/${encodeURIComponent(selectedCategory)}`)
        ])
        setForecast(forecastRes.data)
        setInventory(inventoryRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    loadCategoryDetails()
  }, [selectedCategory])

  if (loading) return <div className="status-message">Loading dashboard...</div>
  if (error) return <div className="status-message error">{error}</div>

  return (
    <div className="dashboard">
      <header>
        <h1>AI Demand Forecasting & Inventory Optimization</h1>
        <p className="subtitle">DataCo Supply Chain — XGBoost + Prophet Ensemble</p>
      </header>

      <div className="category-selector">
        <label htmlFor="category-select">Select Category: </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {dashboardData.map((item) => (
            <option key={item.category} value={item.category}>
              {item.category}
            </option>
          ))}
        </select>
      </div>

      {forecast && inventory && (
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Predicted Next-Day Demand</h3>
            <p className="metric-value">{forecast.predicted_next_day_demand}</p>
            <span className="metric-sub">Last actual: {forecast.last_actual_demand} on {forecast.last_date}</span>
          </div>
          <div className="metric-card">
            <h3>Safety Stock</h3>
            <p className="metric-value">{inventory.safety_stock}</p>
            <span className="metric-sub">units buffer @ {inventory.service_level * 100}% service level</span>
          </div>
          <div className="metric-card">
            <h3>Reorder Point</h3>
            <p className="metric-value">{inventory.reorder_point}</p>
            <span className="metric-sub">trigger new order at this level</span>
          </div>
          <div className="metric-card">
            <h3>Economic Order Quantity</h3>
            <p className="metric-value">{inventory.economic_order_quantity}</p>
            <span className="metric-sub">optimal order size</span>
          </div>
        </div>
      )}

      <div className="chart-section">
        <h2>Average Daily Demand — Top Categories</h2>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={dashboardData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
  dataKey="category"
  angle={-45}
  textAnchor="end"
  interval={0}
  height={120}
  tick={{ fontSize: 11, fill: '#94a3b8' }}
/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg_daily_demand" fill="#4f46e5" name="Avg Daily Demand" />
            <Bar dataKey="safety_stock" fill="#f59e0b" name="Safety Stock" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-section">
        <h2>Full Inventory Plan — All Categories</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Avg Daily Demand</th>
              <th>Safety Stock</th>
              <th>Reorder Point</th>
              <th>EOQ</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.map((item) => (
              <tr key={item.category}>
                <td>{item.category}</td>
                <td>{item.avg_daily_demand}</td>
                <td>{item.safety_stock}</td>
                <td>{item.reorder_point}</td>
                <td>{item.economic_order_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App