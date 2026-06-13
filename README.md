# Busintory Admin

A modern web-based admin dashboard for managing product catalogs, brands, categories, and staff. Built with vanilla JavaScript and Supabase, providing an intuitive interface for product inventory management.

## Features

- **Authentication System** - Secure login with Supabase Auth
- **Dashboard** - Overview and key metrics
- **Product Management** - Create, update, and manage products
- **Brand Management** - Organize products by brands
- **Category Management** - Create and manage product categories
- **Forms & Variants** - Manage product variants and form types
- **Staff Management** - Role-based staff administration
- **Role-Based Access Control** - Three permission levels: Super Admin, Data Manager, Data Entry
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS
- **Icons**: Tabler Icons
- **Backend**: Supabase (Firebase alternative)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

## Project Structure

```
busintory_product_catalog/
├── index.html              # Main HTML entry point
├── style.css              # Global styles
├── js/
│   ├── app.js            # Application initialization
│   ├── config.js         # Supabase configuration
│   ├── auth.js           # Authentication logic
│   ├── navigation.js     # Page routing
│   ├── shared.js         # Shared utilities
│   ├── utils/
│   │   ├── ui.js         # UI helper functions
│   │   ├── dom.js        # DOM manipulation utilities
│   │   └── badges.js     # Badge/status components
│   └── pages/
│       ├── dashboard.js  # Dashboard page
│       ├── products.js   # Products page
│       ├── brands.js     # Brands page
│       ├── categories.js # Categories page
│       ├── forms.js      # Forms/Variants page
│       └── staff.js      # Staff management page
└── images/               # Logo and branding assets
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Supabase project with configured authentication

### Setup

1. Clone or download the repository
2. Open `index.html` in your web browser
3. The application will automatically load the Supabase configuration from `js/config.js`

### Configuration

Update Supabase credentials in `js/config.js`:

```javascript
const SUPABASE_URL = 'your-supabase-url'
const SUPABASE_KEY = 'your-supabase-key'
```

## User Roles

The application supports three permission levels:

| Role | Level | Permissions |
|------|-------|-------------|
| Super Admin | 3 | Full access to all features |
| Data Manager | 2 | Can manage products, brands, categories |
| Data Entry | 1 | Limited to data entry tasks |

## Usage

1. **Login** - Enter your email and password on the login screen
2. **Navigate** - Use the sidebar menu to access different sections
3. **Mobile** - Bottom navigation bar appears on mobile devices
4. **Logout** - Click the logout icon in the sidebar footer

## Key Files

- `index.html` - Application layout and HTML structure
- `style.css` - All styling (layout, components, responsive design)
- `js/config.js` - Supabase configuration and role definitions
- `js/auth.js` - Login/logout and session management
- `js/navigation.js` - Page routing and navigation logic

## Development

### Adding New Features

1. Create a new file in `js/pages/` for the feature
2. Export a function that renders the page content
3. Add navigation entry in `index.html`
4. Import the script in `index.html`

### Styling

Global styles are in `style.css`. Components use CSS classes with the `btn-`, `form-`, `nav-` prefixes for easy identification.

## Supabase Integration

The application uses Supabase for:
- User authentication
- Session management
- Data storage and retrieval

Ensure your Supabase project has the necessary tables and RLS policies configured for the application to work correctly.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is a Personal Project of Great Onyemaechi(jnr) Joseph, All rights reserved &copy; 2026 ™️Busintory. 
