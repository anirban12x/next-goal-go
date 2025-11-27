# Goal Tracker - Habit Calendar App

A beautiful, modern web application for tracking habits and achieving goals with an interactive calendar interface. Built with Next.js 16, MongoDB, and TailwindCSS.

## Features

- 📅 **Interactive Habit Calendar** - Visualize your daily completions with a color-coded calendar
- 🎯 **Multiple Goals** - Create and manage multiple goals across different categories
- 📊 **Progress Statistics** - Track completion rates, current streaks, and total days active
- 🎨 **Customizable Goals** - Choose custom colors and categories for each goal
- 🔐 **Secure Authentication** - User registration and login with JWT tokens
- 📱 **Mobile Responsive** - Beautiful design that works on all devices
- ✨ **Smooth Animations** - Polished interactions and transitions

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt password hashing
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add the following variables:
   \`\`\`
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/goal-tracker
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   NEXT_PUBLIC_API_URL=http://localhost:3000
   \`\`\`

   **Environment Variables Explanation:**
   - `MONGODB_URI`: Your MongoDB connection string. You can get this from MongoDB Atlas.
   - `JWT_SECRET`: A secret key for signing JWT tokens. Use a strong, random string (min 32 characters).
   - `NEXT_PUBLIC_API_URL`: The base URL for API calls (used in development).

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## MongoDB Setup

### Using MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster
4. Click "Connect" and choose "Drivers"
5. Copy the connection string and update your `.env.local` file
6. Replace `<username>` and `<password>` with your database credentials

### Database Collections

The application automatically uses the following collections:

- **users**: Stores user account information
  - `_id`: MongoDB ObjectId
  - `email`: User email
  - `name`: User name
  - `password`: Hashed password
  - `createdAt`: Account creation timestamp
  - `updatedAt`: Last update timestamp

- **goals**: Stores user goals and habits
  - `_id`: MongoDB ObjectId
  - `userId`: Reference to the user
  - `title`: Goal title
  - `description`: Goal description
  - `category`: Category (health, fitness, learning, productivity, personal, finance)
  - `frequency`: Daily or weekly goal
  - `color`: Custom color for visualization
  - `completions`: Array of completion dates
  - `createdAt`: Goal creation timestamp
  - `updatedAt`: Last update timestamp

## Usage

### Creating an Account

1. Visit the landing page
2. Click "Get Started"
3. Fill in your name, email, and password
4. Click "Create Account"

### Creating a Goal

1. Click "+ New Goal" on the dashboard
2. Enter goal title, description, category, frequency, and select a color
3. Click "Create Goal"

### Tracking Progress

1. Click on a goal to view its calendar
2. Click on any day to mark it as complete/incomplete
3. View your statistics including:
   - Total completions
   - Current streak
   - Completion rate
   - Days active

### Editing or Deleting Goals

1. Click on a goal to view details
2. Click "Edit Goal" to modify it
3. Use the "Delete Goal" button to remove a goal

## Project Structure

\`\`\`
├── app/
│   ├── api/                    # API routes
│   │   └── auth/              # Authentication endpoints
│   │   └── goals/             # Goal management endpoints
│   ├── auth/                  # Authentication pages
│   ├── dashboard/             # Dashboard pages
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/                # React components
│   ├── ui/                    # shadcn/ui components
│   ├── navigation.tsx         # Navigation component
│   ├── goals-list.tsx         # Goals list component
│   ├── habit-calendar.tsx     # Calendar component
│   └── goal-stats.tsx         # Statistics component
├── lib/
│   ├── mongodb.ts             # MongoDB connection
│   ├── schemas.ts             # TypeScript schemas
│   └── auth.ts                # Authentication utilities
└── public/                    # Static assets
\`\`\`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### Goals

- `GET /api/goals` - Get all user goals
- `POST /api/goals` - Create a new goal
- `GET /api/goals/[id]` - Get a specific goal
- `PUT /api/goals/[id]` - Update a goal
- `DELETE /api/goals/[id]` - Delete a goal
- `POST /api/goals/[id]/completion` - Toggle completion for a date

## Development

### Running Tests

\`\`\`bash
npm run test
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

Update your environment variables and deploy using your preferred platform's CLI or dashboard.

## Contributing

Contributions are welcome! Feel free to submit a pull request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section below
2. Review the code comments
3. Check MongoDB documentation for database-related issues

## Troubleshooting

### "MONGODB_URI is not defined"
- Make sure you have `.env.local` in your project root
- Verify the variable name is exactly `MONGODB_URI`

### "Invalid credentials" on login
- Ensure the user is registered with that email
- Check that you're entering the correct password
- Passwords are case-sensitive

### Goals not appearing
- Clear browser local storage and log in again
- Check MongoDB connection is working
- Verify your JWT token is valid

### Calendar not showing completions
- Refresh the page
- Check your browser's local storage is enabled
- Verify the completion date format in MongoDB

## Future Enhancements

- [ ] Goal reminders and notifications
- [ ] Sharing goals with friends
- [ ] Backup and export data
- [ ] Dark mode toggle
- [ ] Mobile app version
- [ ] Advanced statistics and insights
- [ ] Goal templates
- [ ] Community challenges
