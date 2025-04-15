import { BrowserRouter as Router } from 'react-router-dom'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import FeaturedProducts from './components/sections/FeaturedProducts'

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
        <Header />
        <main>
          <Hero />
          <FeaturedProducts />
        </main>
      </div>
    </Router>
  )
}

export default App
