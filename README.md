# 🧠 MindMap Mentor

> **AI-Powered Student Productivity & Career Guidance Platform**

MindMap Mentor is a full-stack AI-powered web application that helps students improve productivity, plan their studies, and receive personalized career guidance using Large Language Models (LLMs). The platform combines task management, productivity tracking, AI-generated study plans, career recommendations, roadmaps, journaling, and weekly reviews into one intelligent dashboard.

---

## 🚀 Features

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing using PBKDF2
- Protected user routes

### 📊 Productivity Dashboard
- Daily productivity score
- Progress tracking
- Interactive dashboard
- Daily motivation
- Progress visualization

### ✅ Daily Task Planner
- Create daily tasks
- Interactive checklist
- Automatic productivity calculation
- Task completion tracking

### 🤖 AI Career Analyzer
- Personalized career recommendations
- Career match percentage
- Skill recommendations
- Career summary
- Daily motivation

### 📚 AI Study Planner
- Personalized study plans
- Subject-wise schedules
- Learning recommendations
- Exam preparation guidance

### 🛣️ AI Career Roadmap
- Step-by-step career roadmap
- Required skills
- Learning path
- Future career guidance

### 📝 Journal & Weekly Review
- Daily journal entries
- AI-generated weekly performance review
- Personalized improvement suggestions

### 🏆 Achievement System
- Productivity tracking
- Streak tracking
- Achievement badges

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose

## Artificial Intelligence
- Groq API
- Meta Llama 4 Scout 17B 16E Instruct
- Prompt Engineering
- Large Language Model (LLM)

## Authentication & Security
- JWT Authentication
- PBKDF2 Password Hashing
- Environment Variables (.env)

## APIs
- REST API
- Fetch API

## Tools
- Visual Studio Code
- Git
- GitHub
- MongoDB Atlas

---

# 🏗️ System Architecture

```
                   User
                     │
                     ▼
      HTML + CSS + JavaScript Frontend
                     │
               Fetch API Requests
                     │
                     ▼
          Node.js + Express Backend
            │                    │
            ▼                    ▼
     MongoDB Atlas         Groq API (LLM)
            │                    │
            └──────────┬─────────┘
                       ▼
               AI Generated Response
                       ▼
                  User Dashboard
```

---

# ⚙️ Project Workflow

1. User registers and logs into the application.
2. User profile is securely stored in MongoDB Atlas.
3. User creates daily tasks and tracks productivity.
4. Productivity score updates dynamically based on completed tasks.
5. User submits academic and personal information.
6. Backend sends structured prompts to the Groq LLM.
7. AI generates:
   - Career recommendations
   - Study plans
   - Career roadmaps
   - Weekly reviews
   - Daily motivation
8. Responses are stored in MongoDB and displayed on the dashboard.

---

# 📂 Folder Structure

```
MindMap-Mentor
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── css
│   ├── js
│   ├── assets
│   ├── index.html
│   └── dashboard.html
│
├── screenshots
├── README.md
└── .gitignore
```

---

# 💾 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/MindMap-Mentor.git
```

### Navigate

```bash
cd MindMap-Mentor
```

### Install Backend Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

### Start Backend

```bash
npm start
```

Open the frontend in your browser or serve it through your preferred local server.

---

# 📸 Screenshots

Add screenshots of:

- Login Page
- Dashboard
- Career Analyzer
- Study Planner
- Roadmap Generator
- Productivity Tracker

Example:

```
screenshots/
├── login.png
├── dashboard.png
├── career-analysis.png
├── study-plan.png
├── roadmap.png
```

---

# 🔐 Security Features

- JWT Authentication
- PBKDF2 Password Hashing
- Protected REST APIs
- Environment Variable Configuration
- Secure API Integration

---

# 💡 Future Enhancements

- AI Chatbot Mentor
- Mobile Application
- Calendar Integration
- Pomodoro Timer
- Email Notifications
- Push Notifications
- Voice Assistant
- Habit Analytics
- Leaderboards

---

# 🎯 Key Highlights

- Full Stack Web Application
- AI-Powered Student Guidance
- Personalized Career Recommendations
- Productivity Tracking
- Dynamic Study Planning
- Secure Authentication
- RESTful API Architecture
- MongoDB Cloud Database
- Prompt Engineering with LLMs

---

# 👩‍💻 Developed By

**Akshohini Goud**

Computer Science Engineering Student

---

# 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, consider giving it a **Star** on GitHub!