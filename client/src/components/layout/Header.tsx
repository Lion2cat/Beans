import { useState } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const headerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)'
  }

  const navContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px'
  }

  const flexBetweenStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#5d342f'
  }

  const desktopNavStyle = {
    display: window.innerWidth > 768 ? 'flex' : 'none',
    gap: '2rem'
  }

  const mobileMenuBtnStyle = {
    display: window.innerWidth > 768 ? 'none' : 'block'
  }

  const mobileMenuStyle = {
    display: isMenuOpen ? 'block' : 'none',
    marginTop: '1rem'
  }

  const linkStyle = {
    color: '#85493d',
    textDecoration: 'none'
  }

  return (
    <header style={headerStyle}>
      <nav style={navContainerStyle}>
        <div style={flexBetweenStyle}>
          <Link to="/" style={logoStyle}>
            Beans
          </Link>
          
          {/* Desktop Navigation */}
          <div style={desktopNavStyle}>
            <Link to="/menu" style={linkStyle}>Menu</Link>
            <Link to="/about" style={linkStyle}>About</Link>
            <Link to="/contact" style={linkStyle}>Contact</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            style={mobileMenuBtnStyle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={mobileMenuStyle}>
            <div style={{ marginBottom: '1rem' }}>
              <Link to="/menu" style={linkStyle}>Menu</Link>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Link to="/about" style={linkStyle}>About</Link>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Link to="/contact" style={linkStyle}>Contact</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header 