# UI Component Design Guide

This document outlines the design specifications for reusable UI components in the Beans Coffee Shop website.

## Design System Overview

The component design system follows these principles:
- **Consistency**: Unified look and feel across all components
- **Reusability**: Components built for multiple contexts
- **Responsiveness**: Components adapt fluidly to all screen sizes
- **Accessibility**: WCAG 2.1 AA compliant components

## Button Components

### Primary Button

**Usage**: Main calls-to-action, such as "Add to Cart", "Checkout", "Subscribe"

**Design Specifications**:
- Height: 48px (desktop), 56px (mobile)
- Padding: 16px 24px
- Background: #D65E25 (Burnt orange)
- Text Color: #FFFFFF
- Font: Open Sans, 16px, medium weight
- Border Radius: 8px
- Hover Effect: Darken by 10%, slight scale (1.02)
- Active Effect: Darken by 15%, slight scale down (0.98)
- Disabled State: 50% opacity, not clickable

```jsx
// Usage example
<Button variant="primary" size="large">Add to Cart</Button>
```

### Secondary Button

**Usage**: Secondary actions like "View Details", "Continue Shopping"

**Design Specifications**:
- Height: 44px (desktop), 52px (mobile)
- Padding: 12px 20px
- Background: Transparent
- Border: 2px solid #4A3520 (Deep coffee brown)
- Text Color: #4A3520
- Font: Open Sans, 16px, medium weight
- Border Radius: 8px
- Hover Effect: Background fill 10% opacity, scale (1.02)
- Active Effect: Background fill 15% opacity, scale down (0.98)
- Disabled State: 50% opacity, not clickable

```jsx
// Usage example
<Button variant="secondary" size="medium">View Details</Button>
```

### Text Button

**Usage**: Tertiary actions like "Learn More", "See All"

**Design Specifications**:
- Padding: 8px 4px
- Background: None
- Text Color: #4A3520
- Font: Open Sans, 16px, medium weight
- Underline: 2px solid, appears on hover
- Hover Effect: Darker text color
- Active Effect: Darker text color
- Disabled State: 50% opacity, not clickable

```jsx
// Usage example
<Button variant="text">Learn More</Button>
```

## Card Components

### Product Card

**Usage**: Displaying coffee products in grid or carousel layouts

**Design Specifications**:
- Width: Flexible, minimum 240px
- Height: Auto, minimum 340px
- Background: #FFFFFF
- Border Radius: 8px
- Shadow: 0px 4px 12px rgba(0, 0, 0, 0.08)
- Padding: 16px
- Image Container: 1:1 aspect ratio
- Hover Effect: Slight elevation (increase shadow)
- Animation: Fade-in when entering viewport

**Structure**:
- Product Image (top)
- Product Name (16px, semi-bold)
- Origin (14px, regular)
- Short Description (14px, regular, max 2 lines)
- Price (16px, semi-bold)
- Rating (star icons)
- "Add to Cart" button

```jsx
// Usage example
<ProductCard 
  image="/images/products/ethiopian.jpg"
  name="Ethiopian Yirgacheffe"
  origin="Ethiopia"
  description="Light roast with fruity notes and floral aroma"
  price={14.99}
  rating={4.5}
/>
```

### Subscription Card

**Usage**: Displaying subscription plan options

**Design Specifications**:
- Width: Flexible, minimum 280px
- Height: Auto, minimum 380px
- Background: #F5F1E8 (Warm cream)
- Border Radius: 8px
- Border: 1px solid rgba(74, 53, 32, 0.1)
- Padding: 24px
- Highlight (Popular): Accent border color
- Hover Effect: Slight elevation and scale

**Structure**:
- Plan Name (20px, bold)
- Price (24px, bold) with frequency (/month)
- Feature List (check icons)
- Description paragraph
- CTA Button (full width)
- Optional badge for "Most Popular"

```jsx
// Usage example
<SubscriptionCard 
  name="Coffee Enthusiast"
  price={24.99}
  frequency="month"
  features={["2 bags monthly", "Free shipping", "Exclusive access"]}
  description="Perfect for daily coffee drinkers"
  isPopular={true}
/>
```

## Navigation Components

### Main Navigation

**Usage**: Primary site navigation in header

**Design Specifications**:
- Height: 80px (desktop), 64px (mobile)
- Background: Transparent (scrolled: white with shadow)
- Text Color: #FFFFFF (scrolled: #4A3520)
- Logo Height: 40px
- Link Spacing: 32px between items
- Active State: Underline or color change
- Hover Effect: Slight opacity change
- Mobile: Collapses to hamburger menu

```jsx
// Usage example
<MainNav 
  links={[
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Menu', href: '#menu' },
    // More links...
  ]}
  activeLink="#hero"
/>
```

### Section Indicator

**Usage**: Visual indicator showing current section in long scroll

**Design Specifications**:
- Position: Fixed right side
- Dots: 8px diameter
- Active Dot: 12px diameter
- Spacing: 16px between dots
- Color: #D65E25 (active), rgba(74, 53, 32, 0.3) (inactive)
- Hover Effect: Slight scale and tooltip
- Tooltip: Section name appears on hover
- Mobile: Hidden on screens < 768px

```jsx
// Usage example
<SectionIndicator 
  sections={[
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Us' },
    // More sections...
  ]}
  currentSection="about"
/>
```

## Form Components

### Input Field

**Usage**: Text input in forms (contact, login, etc.)

**Design Specifications**:
- Height: 48px
- Background: #FFFFFF
- Border: 1px solid rgba(74, 53, 32, 0.3)
- Border Radius: 8px
- Padding: 12px 16px
- Text: 16px, regular
- Focus State: Border color #D65E25, slight glow
- Error State: Border color #E74C3C, error message below
- Placeholder: 60% opacity text
- Icon: Optional left or right icon

```jsx
// Usage example
<Input 
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  error="Please enter a valid email"
  rightIcon={<EmailIcon />}
/>
```

### Checkbox

**Usage**: Boolean selections in forms

**Design Specifications**:
- Size: 20px × 20px
- Border: 2px solid rgba(74, 53, 32, 0.5)
- Border Radius: 4px
- Checked Background: #D65E25
- Check Mark: White
- Label: 16px, 8px spacing from box
- Focus State: Blue outline (accessibility)
- Hover State: Border darken

```jsx
// Usage example
<Checkbox 
  label="Subscribe to newsletter"
  checked={isSubscribed}
  onChange={handleSubscriptionChange}
/>
```

### Radio Button

**Usage**: Single selection from multiple options

**Design Specifications**:
- Size: 20px × 20px
- Border: 2px solid rgba(74, 53, 32, 0.5)
- Border Radius: 50%
- Selected: Inner circle #D65E25
- Label: 16px, 8px spacing from button
- Focus State: Blue outline (accessibility)
- Hover State: Border darken

```jsx
// Usage example
<RadioGroup 
  name="grind"
  options={[
    { value: 'whole', label: 'Whole Bean' },
    { value: 'medium', label: 'Medium Grind' },
    { value: 'fine', label: 'Fine Grind' }
  ]}
  selectedValue={selectedGrind}
  onChange={handleGrindChange}
/>
```

## Feedback Components

### Toast Notification

**Usage**: Temporary feedback about operations

**Design Specifications**:
- Width: Auto, max 400px
- Padding: 16px
- Border Radius: 8px
- Colors:
  - Success: #2ECC71 background, #FFFFFF text
  - Error: #E74C3C background, #FFFFFF text
  - Info: #3498DB background, #FFFFFF text
- Position: Top-right corner
- Animation: Slide in, fade out
- Duration: 4 seconds default
- Dismissible: X button or swipe

```jsx
// Usage example
<Toast 
  type="success"
  message="Item added to cart successfully"
  duration={4000}
  onDismiss={handleDismiss}
/>
```

### Modal

**Usage**: Focus-requiring interactions like quick-view, confirmations

**Design Specifications**:
- Width: 480px (desktop), 90% (mobile)
- Background: #FFFFFF
- Border Radius: 12px
- Shadow: 0px 8px 24px rgba(0, 0, 0, 0.15)
- Header: 20px semi-bold, 16px padding
- Body: 16px padding
- Footer: 16px padding, right-aligned buttons
- Overlay: Black at 50% opacity
- Animation: Fade in, slight scale up
- Close: X button or click overlay

```jsx
// Usage example
<Modal 
  title="Confirm Order"
  isOpen={isModalOpen}
  onClose={closeModal}
  footer={
    <>
      <Button variant="secondary" onClick={closeModal}>Cancel</Button>
      <Button variant="primary" onClick={confirmOrder}>Confirm</Button>
    </>
  }
>
  <p>Are you sure you want to place this order?</p>
</Modal>
```

## Content Components

### Section Heading

**Usage**: Main headings for page sections

**Design Specifications**:
- Font: Playfair Display, 40px (desktop), 32px (mobile)
- Weight: Bold
- Color: #4A3520
- Margin Bottom: 24px
- Optional Decorative Element: Coffee bean icon or line accent
- Animation: Fade in and slide up when entering viewport

```jsx
// Usage example
<SectionHeading 
  text="Our Coffee Selection"
  decorative={true}
/>
```

### Product Showcase

**Usage**: Highlighting featured products

**Design Specifications**:
- Layout: Image left, content right (desktop)
- Layout: Stacked (mobile)
- Image: 50% width (desktop), 100% (mobile)
- Content Padding: 40px
- Background: Optional light pattern
- Border Radius: 12px
- Call-to-action: Primary button
- Animation: Reveal on scroll

```jsx
// Usage example
<ProductShowcase 
  image="/images/featured/seasonal-blend.jpg"
  title="Fall Harvest Blend"
  description="A medium-dark roast with notes of caramel, chocolate and autumn spices."
  price={16.99}
  ctaText="Try Now"
  onCtaClick={handleCtaClick}
/>
```

## Utility Components

### Loader

**Usage**: Loading state indication

**Design Specifications**:
- Size: 40px (large), 24px (medium), 16px (small)
- Color: #D65E25
- Animation: Spinning animation (2s duration)
- Variant: Circle spinner or coffee cup with "steam"
- Optional Text: Below spinner, 14px, light gray

```jsx
// Usage example
<Loader size="medium" text="Loading your order..." />
```

### Divider

**Usage**: Separating content sections

**Design Specifications**:
- Height: 1px
- Color: rgba(74, 53, 32, 0.1)
- Margin: 32px 0
- Width: 100% or custom
- Variant: Solid, dashed, or with centered text/icon

```jsx
// Usage example
<Divider width="80%" centered={true} icon={<CoffeeBean />} />
```

### Badge

**Usage**: Status indicators, counts, tags

**Design Specifications**:
- Height: 24px
- Padding: 4px 8px
- Border Radius: 12px
- Font: 12px, semi-bold
- Colors:
  - Default: #F5F1E8 background, #4A3520 text
  - Primary: #D65E25 background, #FFFFFF text
  - Success: #2ECC71 background, #FFFFFF text
  - Info: #3498DB background, #FFFFFF text

```jsx
// Usage example
<Badge type="primary" text="New" />
<Badge type="success" text="In Stock" />
```

## Animation Guidelines

Define consistent animations for components:

1. **Entry Animations**:
   - Fade In: 300ms ease-in
   - Slide In: 400ms ease-out
   - Scale: 300ms ease-in-out

2. **Hover/Interaction**:
   - Scale: 150ms ease
   - Color Change: 200ms ease
   - Shadow Change: 200ms ease

3. **Exit Animations**:
   - Fade Out: 250ms ease-out
   - Slide Out: 300ms ease-in
   - Scale Down: 250ms ease-in-out

## Responsive Behavior

All components should follow these responsive guidelines:

1. **Breakpoints**:
   - Mobile: < 768px
   - Tablet: 768px - 1023px
   - Desktop: ≥ 1024px

2. **Mobile Adaptations**:
   - Increased touch targets
   - Stacked layouts
   - Simplified UI
   - Reduced padding/margins

3. **Accessibility**:
   - Support keyboard navigation
   - Meet color contrast requirements
   - Include appropriate ARIA attributes
   - Support screen readers

## Reserved Space for Three.js Integration

When implementing Three.js, these components can integrate 3D elements:

1. **Product Card**: 3D model viewer on hover
2. **Section Background**: Three.js canvas as section background
3. **Hero Banner**: Animated 3D elements integrated with content

Leave designated containers with proper naming:

```jsx
// Example integration point
<div className="product-model-container" data-model-url="/models/coffee-cup.glb">
  {/* Three.js content will be mounted here */}
</div>
``` 