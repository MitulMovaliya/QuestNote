# QuestNote

A full-stack AI-powered note-taking application that combines traditional note management with intelligent conversational AI capabilities. Built with React, Node.js, and integrated with ChromaDB for vector search and AI models for natural language interactions.

## 🌟 Features

### Core Features

- **User Authentication**

  - Email/Password registration and login
  - Google OAuth integration
  - Email verification system
  - Password reset functionality
  - Protected routes and session management

- **Note Management**

  - Create, read, update, and delete notes
  - Rich text content support
  - Pin important notes
  - Archive notes
  - Tag-based organization
  - Link/URL attachment
  - Search and filter capabilities
  - Pagination support

- **AI-Powered Features**
  - Chat with your notes using AI
  - Vector embeddings for semantic search (ChromaDB)
  - Context-aware conversations about note content
  - Message history per note
  - Integration with Google GenAI and OpenAI

### Additional Features

- Responsive UI with Tailwind CSS
- Real-time toast notifications
- Protected and public route handling
- RESTful API architecture
- Error handling and logging

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport.js** - Authentication
  - Local strategy
  - Google OAuth 2.0
- **ChromaDB** - Vector database for embeddings
- **OpenAI API** - AI capabilities
- **Google GenAI** - Alternative AI model
- **Nodemailer** - Email service
- **Winston** - Logging
- **Helmet** - Security headers
- **Express Session** - Session management

## 📁 Project Structure

```
QuestNote/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── api/           # API integration layer
│   │   │   ├── auth.api.ts
│   │   │   ├── message.api.ts
│   │   │   └── note.api.ts
│   │   ├── components/    # React components
│   │   │   ├── ui/        # UI components (shadcn/ui)
│   │   │   ├── Layout.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NoteModel.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Notes.tsx
│   │   │   ├── NotePage.tsx
│   │   │   ├── Archived.tsx
│   │   │   └── Tags.tsx
│   │   ├── stores/        # Zustand state stores
│   │   ├── types/         # TypeScript types
│   │   └── config/        # Configuration files
│   └── package.json
│
└── server/                # Backend application
    ├── src/
    │   ├── config/        # Configuration files
    │   │   ├── database.js
    │   │   ├── passport.js
    │   │   ├── chromadb.js
    │   │   ├── genai.js
    │   │   └── openai.js
    │   ├── controllers/   # Request handlers
    │   │   ├── auth.controller.js
    │   │   ├── note.controller.js
    │   │   └── message.controller.js
    │   ├── middleware/    # Express middleware
    │   │   ├── auth.middleware.js
    │   │   └── errorHandler.js
    │   ├── models/        # MongoDB models
    │   │   ├── user.model.js
    │   │   ├── note.model.js
    │   │   └── message.model.js
    │   ├── routes/        # API routes
    │   │   ├── auth.routes.js
    │   │   ├── note.routes.js
    │   │   └── ai.routes.js
    │   └── utils/         # Utility functions
    │       ├── email.js
    │       ├── embedding.js
    │       └── logger.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Cloud Console account (for OAuth)
- OpenAI API key or Google GenAI API key
- Email service credentials (for Nodemailer)

### Environment Variables

#### Backend (.env in /server)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/questnote

# Session
SESSION_SECRET=your-session-secret-key

# Client URL
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# AI Services (choose one or both)
OPENAI_API_KEY=your-openai-api-key
GOOGLE_GENAI_API_KEY=your-google-genai-api-key

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@questnote.com

# Frontend URL for email links
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env in /client)

```env
VITE_API_URL=http://localhost:3000/api
```

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd QuestNote
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies**

```bash
cd ../client
npm install
```

4. **Set up environment variables**

   - Create `.env` files in both `server` and `client` directories
   - Add the required environment variables as shown above

5. **Start MongoDB**
   - Make sure MongoDB is running locally or use MongoDB Atlas

### Running the Application

#### Development Mode

**Terminal 1 - Start Backend:**

```bash
cd server
npm run dev
```

Backend will run on http://localhost:3000

**Terminal 2 - Start Frontend:**

```bash
cd client
npm run dev
```

Frontend will run on http://localhost:5173

#### Production Mode

**Build Frontend:**

```bash
cd client
npm run build
```

**Start Backend:**

```bash
cd server
npm start
```

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Note Endpoints

- `GET /api/notes` - Get all notes (with pagination, search, filters)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/pin` - Toggle pin status
- `PATCH /api/notes/:id/archive` - Toggle archive status
- `GET /api/notes/tags/all` - Get all unique tags

### AI Chat Endpoints

- `POST /api/ai/chat/:noteId` - Send message to AI about note
- `GET /api/ai/chat/:noteId/history` - Get chat history for note

## 🎨 Features in Detail

### Note Management

- **Create Notes**: Add title, content, optional link, and tags
- **Edit Notes**: Update any note information
- **Pin Notes**: Keep important notes at the top
- **Archive Notes**: Move less relevant notes to archive
- **Tag System**: Organize notes with custom tags (alphanumeric, no spaces)
- **Search**: Find notes by title, content, or tags
- **Filtering**: Filter by pinned status, archived status, or specific tags

### AI Chat

- Ask questions about your note content
- Get summaries and insights
- Semantic search using vector embeddings
- Persistent chat history per note
- Context-aware responses

### Authentication

- Secure password hashing with bcrypt
- Session-based authentication
- Email verification required for new accounts
- Password reset via email
- Google OAuth for quick sign-up/login

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- HTTP-only cookies
- Session management with MongoDB store
- Password hashing
- Protected API routes
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ by the QuestNote team

## 🙏 Acknowledgments

- shadcn/ui for beautiful UI components
- ChromaDB for vector storage
- OpenAI and Google GenAI for AI capabilities
- All open-source contributors

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Happy Note Taking! 📝✨**
