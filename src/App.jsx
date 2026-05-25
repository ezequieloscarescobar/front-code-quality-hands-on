import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import OrdersListPage from './pages/OrdersListPage'
import OrderDetailPage from './pages/OrderDetailPage'
import CreateOrderPage from './pages/CreateOrderPage'
import ReportsPage from './pages/ReportsPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">⚙ Orders Dashboard</div>
          <div className="navbar-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Órdenes
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Reportes
            </NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<OrdersListPage />} />
            <Route path="/orders/new" element={<CreateOrderPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
