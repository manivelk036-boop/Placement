# CareerPilot AI

**Learn, Practice, Track, and Get Placed.**

AI-powered placement and career development platform that helps students learn skills, follow personalized career roadmaps, practice aptitude and interviews, track placement readiness, and earn rewards through a gamified learning experience.

## Features

- **Student Profile** – Store academic details, skills, projects, and career goals
- **AI Career Roadmap** – Personalized 7-month learning paths
- **Learning System** – Notes, videos, assignments, and mini projects
- **Topic Assessments** – MCQ, coding, and logical quizzes with proficiency levels
- **Gamification** – XP, Career Coins, levels, streaks, and achievement badges
- **Placement Readiness Score** – Multi-factor scoring with weak area detection
- **Resume Analyzer** – ATS scoring and improvement recommendations
- **AI Mock Interview** – HR, technical, and situational practice
- **Company Match Engine** – Skill-based company recommendations
- **Salary Predictor** – Current and future salary estimates
- **Leaderboard** – Compare XP, coins, streaks, and placement scores
- **AI Career Twin** – Growth predictions based on milestones

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Vite |
| Backend | Spring Boot 3.2, Java 17 |
| Database | MySQL |
| Auth | JWT |
| AI | OpenAI API (configurable) |

## Project Structure

```
Placement/
├── backend/          # Spring Boot REST API
│   └── src/main/java/com/careerpilot/
│       ├── controller/
│       ├── entity/
│       ├── repository/
│       ├── service/
│       ├── security/
│       └── config/
├── frontend/         # React SPA
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── services/
└── README.md
```

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

## Setup

### 1. Database

Create a MySQL database (auto-created if using default config):

```sql
CREATE DATABASE careerpilot;
```

Update credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

API runs at `http://localhost:8080`

Health check: `GET http://localhost:8080/api/health`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register student |
| POST | `/api/auth/login` | Login |
| GET | `/api/students/me` | Get profile |
| PUT | `/api/students/me` | Update profile |
| GET | `/api/students/me/dashboard` | Dashboard data |
| POST | `/api/students/me/career-goal?goal=` | Generate roadmap |
| GET | `/api/students/me/roadmap` | Get roadmap |
| GET | `/api/learning/topics` | List topics |
| POST | `/api/learning/topics/{id}/activity` | Mark learning activity |
| GET | `/api/learning/topics/{id}/quiz` | Get quiz |
| POST | `/api/learning/quizzes/{id}/submit` | Submit quiz |
| POST | `/api/resume/analyze` | Analyze resume |
| GET | `/api/mock-interview/generate` | Generate interview |
| POST | `/api/mock-interview/submit` | Submit interview |
| GET | `/api/students/me/placement-score` | Placement score |
| GET | `/api/students/me/company-matches` | Company matches |
| GET | `/api/salary-predictor` | Salary estimate |
| GET | `/api/students/leaderboard` | Leaderboard |

## Gamification Rules

| Action | XP | Coins |
|--------|-----|-------|
| Read Notes | +5 | — |
| Watch Tutorial | +5 | — |
| Pass Quiz | +50 | +50 |
| Complete Assignment | +75 | — |
| Complete Project | +200 | +200 |
| Topic Completed | — | +20 |
| Mock Interview | — | +75 |
| 7-Day Streak | — | +100 |

## Student Levels

1. Career Explorer (0 XP)
2. Learner (500 XP)
3. Developer (1,500 XP)
4. Problem Solver (3,500 XP)
5. Placement Ready (6,000 XP)
6. Interview Master (10,000 XP)
7. Career Champion (15,000 XP)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for AI features |

## License

MIT
