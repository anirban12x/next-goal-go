# Daily Goals - Goal Tracking Web App

A modern, mobile-first web application for tracking daily goals and building consistent habits. Built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## 🎯 Features

### 🔐 Authentication
- **Seamless Login Experience**: Landing page with integrated login/register forms
- **30-Day Session**: Stay logged in for 30 days without re-authentication
- **Secure**: JWT-based authentication with bcrypt password hashing

### 📱 Mobile-First Design  
- **Responsive**: Optimized for mobile devices with touch-friendly interface
- **Modern UI**: Clean, minimalistic design with gradient backgrounds
- **Smooth Animations**: Hover effects and transitions for enhanced UX
- **Floating Action Button**: Fixed bottom button for easy goal creation

### 🎯 Goal Management
- **Simple Creation**: Create goals with just name, start date, and end date
- **Easy Editing**: Update goal details or delete goals with confirmation
- **Dashboard View**: Stack-wise display of all goals with progress indicators

### 📅 Interactive Calendar Tracking
- **Monthly View**: Navigate through months with left/right arrows
- **Visual Progress**: Green checks for completed days, red X for missed days
- **Smart Date Handling**: 
  - Gray out dates outside goal range
  - Highlight current date with circle
  - Only allow toggling past and current dates
- **Real-time Updates**: Instant visual feedback without page refreshes

### 📊 Live Statistics
- **5 Key Metrics** displayed in 2x2x1 format:
  - Total days completed
  - Total days missed  
  - Current streak count
  - Total goal duration
  - Days remaining
- **Auto-updating**: Statistics update instantly when toggling dates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd goal-tracking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/goal-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the application**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 How to Use

### First Time Setup
1. **Landing Page**: Opens directly with login form
2. **Create Account**: Click "Don't have an account? Create one"
3. **Auto Login**: Automatically logs you in after registration

### Creating Your First Goal  
1. **Dashboard**: After login, you'll see "Start Your Journey" if no goals exist
2. **Add Goal**: Click the floating "+" button (bottom right)
3. **Fill Details**: Enter goal name, start date, and end date
4. **Create**: Click "Create Goal" to save

### Daily Tracking
1. **Select Goal**: Tap any goal from dashboard
2. **Calendar View**: Opens on current date's month
3. **Mark Progress**: Tap dates to toggle between completed (✓) and missed (✗)
4. **Navigate**: Use arrow buttons to change months
5. **Live Stats**: Watch statistics update in real-time below calendar

### Managing Goals
1. **Edit**: Click pencil icon on goal page to modify details
2. **Delete**: Use delete button in edit page (with confirmation)
3. **Progress**: All completed dates are preserved when editing date ranges

## 🏗️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with native driver
- **Authentication**: JWT tokens (30-day expiry)
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **State Management**: React hooks

## 📁 Project Structure

```
goal-tracking-app/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Login/register endpoints
│   │   └── goals/          # Goal CRUD + completion toggle
│   ├── dashboard/          # Main app pages
│   │   ├── create-goal/    # Goal creation form
│   │   └── goal/[id]/      # Goal detail + edit pages
│   ├── page.tsx            # Landing page with login
│   └── layout.tsx          # Root layout
├── lib/
│   ├── auth.ts             # JWT utilities
│   ├── mongodb.ts          # Database connection
│   └── schemas.ts          # TypeScript interfaces
└── components/ui/          # Reusable UI components
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | User login |
| GET | `/api/goals` | Get user's goals |
| POST | `/api/goals` | Create new goal |
| GET | `/api/goals/[id]` | Get specific goal |
| PUT | `/api/goals/[id]` | Update goal |
| DELETE | `/api/goals/[id]` | Delete goal |
| POST | `/api/goals/[id]/completion` | Toggle date completion |

## 💾 Database Schema

### Users
```typescript
{
  _id: ObjectId
  email: string
  name: string  
  password: string // bcrypt hashed
  createdAt: Date
  updatedAt: Date
}
```

### Goals  
```typescript
{
  _id: ObjectId
  userId: ObjectId
  name: string
  startDate: Date
  endDate: Date
  completedDates: string[] // ["2024-01-15", "2024-01-16"]
  createdAt: Date
  updatedAt: Date
}
```

## 🎨 Design Philosophy

- **Mobile First**: Designed primarily for mobile users
- **Simplicity**: Minimal features, maximum impact
- **Visual Feedback**: Immediate response to user actions
- **Accessibility**: Clear visual indicators and touch-friendly sizing
- **Performance**: Fast loading and smooth interactions

## 🔮 Future Enhancements

- Push notifications for daily reminders
- Streak celebrations and achievements
- Goal categories and tags  
- Export progress data
- Social sharing of achievements
- Dark mode support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for consistent habit building and goal achievement**
