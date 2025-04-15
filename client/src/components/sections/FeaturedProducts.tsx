import { useRef } from 'react'

const products = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    description: 'Bright and floral with notes of citrus and jasmine',
    price: '$18.99',
    image: '/images/ethiopian.jpg'
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    description: 'Rich and balanced with hints of chocolate and nuts',
    price: '$16.99',
    image: '/images/colombian.jpg'
  },
  {
    id: 3,
    name: 'Kenyan AA',
    description: 'Bold and fruity with a wine-like acidity',
    price: '$19.99',
    image: '/images/kenyan.jpg'
  }
]

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  }

  const imageStyle = {
    height: '16rem',
    backgroundColor: '#d9b8a3',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }

  const contentStyle = {
    padding: '1.5rem'
  }

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#5d342f',
    marginBottom: '0.5rem'
  }

  const descriptionStyle = {
    color: '#85493d',
    marginBottom: '1rem'
  }

  const flexBetweenStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const priceStyle = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#5d342f'
  }

  const buttonStyle = {
    backgroundColor: '#a05c4a',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    transition: 'background-color 0.3s',
    border: 'none',
    cursor: 'pointer'
  }

  return (
    <div style={cardStyle}>
      <div 
        style={{
          ...imageStyle, 
          backgroundImage: `url(${product.image})`
        }} 
      />
      <div style={contentStyle}>
        <h3 style={titleStyle}>{product.name}</h3>
        <p style={descriptionStyle}>{product.description}</p>
        <div style={flexBetweenStyle}>
          <span style={priceStyle}>{product.price}</span>
          <button style={buttonStyle}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

const FeaturedProducts = () => {
  const sectionStyle = {
    padding: '5rem 0',
    backgroundColor: '#faf6f2'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  }

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    color: '#5d342f',
    marginBottom: '3rem'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  }

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={headingStyle}>
          Our Featured Beans
        </h2>
        <div style={gridStyle}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 