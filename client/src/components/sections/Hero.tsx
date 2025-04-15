const Hero = () => {
  const heroStyle = {
    position: 'relative' as const,
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }

  const bgStyle = {
    position: 'absolute' as const,
    inset: 0,
    backgroundColor: '#5d342f',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }

  const overlayStyle = {
    position: 'absolute' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }

  const contentStyle = {
    position: 'relative' as const,
    zIndex: 10,
    textAlign: 'center' as const,
    color: 'white',
    padding: '0 16px'
  }

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem'
  }

  const descStyle = {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    maxWidth: '42rem',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  const buttonStyle = {
    backgroundColor: '#a05c4a',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '9999px',
    fontSize: '1.125rem',
    transition: 'background-color 0.3s',
    border: 'none',
    cursor: 'pointer'
  }

  return (
    <section style={heroStyle}>
      {/* Background with fallback color */}
      <div style={bgStyle} />
      
      {/* Overlay */}
      <div style={overlayStyle} />
      
      {/* Content */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          Discover the Perfect Brew
        </h1>
        <p style={descStyle}>
          Experience the finest coffee beans from around the world, 
          carefully selected and roasted to perfection.
        </p>
        <button style={buttonStyle}>
          Explore Our Menu
        </button>
      </div>
    </section>
  )
}

export default Hero 