# Admin Panel Documentation

## Overview
The admin panel provides a secure interface for managing products in the Al Safa Filter system. It features a dark theme to differentiate it from the main website and includes authentication, product management, and password reset functionality.

## Features

### Authentication
- **Login**: Email and password authentication using Supabase Auth
- **Password Reset**: Forgot password functionality with email reset links
- **Session Management**: Automatic session handling and logout

### Product Management
- **Product Listing**: View all products with pagination and search
- **Product Editing**: Edit product details through a modal interface
- **Search**: Search products by ALSAFA, ORIGINE, SAFI, or FLEETG fields
- **Pagination**: Navigate through large product datasets

### UI/UX
- **Dark Theme**: Consistent dark color scheme throughout admin interface
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages and alerts

## Access

### Admin Login
- URL: `/admin/login`
- Features:
  - Email/password authentication
  - Show/hide password toggle
  - Forgot password link
  - Back to main website link

### Admin Dashboard
- URL: `/admin/dashboard`
- Features:
  - Product listing with search and pagination
  - Statistics cards showing total products and current page info
  - Edit product functionality
  - User session display and logout

### Password Reset
- URL: `/admin/reset-password`
- Features:
  - New password entry with confirmation
  - Password strength validation
  - Automatic redirect to login after successful reset

## Security

### Authentication Flow
1. User accesses admin routes
2. System checks for valid session
3. If no session, redirects to login page
4. After successful login, redirects to dashboard
5. Session persists until logout or expiration

### Password Requirements
- Minimum 6 characters
- Confirmation must match
- Secure password reset via email

## Technical Implementation

### Technologies Used
- **Next.js 15**: React framework with App Router
- **Supabase**: Authentication and database
- **Tailwind CSS**: Styling with dark theme
- **Radix UI**: Accessible component library
- **TypeScript**: Type safety

### File Structure
```
app/admin/
├── layout.tsx              # Admin layout wrapper
├── login/page.tsx          # Login page
├── dashboard/page.tsx      # Main dashboard
└── reset-password/page.tsx # Password reset page

components/admin/
└── ProductEditModal.tsx    # Product editing modal

middleware.ts               # Route protection
```

### Database Integration
- Uses existing `test2` table from Supabase
- Product fields: ALSAFA, Ext, Int, H, SAFI, SARL F, FLEETG, ASAS, MECA F, ORIGINE, divers_vehicules
- Search functionality across multiple fields
- Pagination for performance

## Usage Instructions

1. **Access Admin Panel**: Navigate to `/admin/login`
2. **Login**: Enter admin credentials
3. **View Products**: Dashboard shows paginated product list
4. **Search Products**: Use search bar to find specific products
5. **Edit Product**: Click "Edit" button to modify product details
6. **Save Changes**: Modal allows editing all product fields
7. **Logout**: Use logout button to end session

## Notes

- Admin users must be created in Supabase Auth dashboard
- No signup functionality - admin accounts are created manually
- Dark theme is applied consistently across all admin pages
- Responsive design works on all screen sizes
- Error handling provides clear feedback to users
