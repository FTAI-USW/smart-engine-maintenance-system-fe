# Montreal Workshop

A modern web application for managing and monitoring engine maintenance operations. This frontend application provides an intuitive interface for tracking maintenance schedules, analyzing engine performance, and managing maintenance tasks.

## 🚀 Technologies

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Shadcn UI (based on Radix UI)
  - Custom components
- **State Management & Data Fetching**: 
  - React Query (TanStack Query)
  - React Hook Form
- **Data Visualization**:
  - Plotly.js
  - Recharts
- **Routing**: React Router DOM
- **Form Validation**: Zod
- **Development Tools**:
  - TypeScript
  - ESLint
  - SWC (for fast compilation)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn or bun
- Git

## 🛠️ Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd smart-engine-maintenance-system-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add necessary environment variables:
   ```env
   VITE_API_URL=your_api_url_here
   ```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
```

For development build:
```bash
npm run build:dev
```

## 📦 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── services/      # API services
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── assets/        # Static assets
```

## 🧪 Testing

```bash
npm run test
```

## 📝 Code Quality

Run linting:
```bash
npm run lint
```

## 🤝 Contributing

Please read our [Contribution Guide](contribution-guide.md) for details on our code of conduct and the process for submitting pull requests.