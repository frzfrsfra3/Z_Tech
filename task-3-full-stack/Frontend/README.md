# Article Management Platform (Frontend)

**Technologies**: Next.js 15, TypeScript, Redux, JWT, Tailwind CSS, Material UI  
**Features**: Auth, Articles Creating, Day-Based Visibility, Stars Rating, Protected Routes  

## Overview
Completed frontend implementation for the Article Management Platform using Next.js 15 (App Router) as per the Code Station requirements. The application features user authentication, article management with visibility scheduling, and a rating system.

## Note
The System has been tested on Nodejs 18 and NextJS 15

## Technologies
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **API Layer**: Service layer architecture
- **Authentication**: JWT decode & storage
- **Styling**: Tailwind CSS + Material UI + custom styles
- **Form Handling**: React Hook Form

## Key Features
✅ User authentication (register/login)  
✅ Article creation with day-based visibility  
✅ Current-day article filtering  
✅ 5-star rating system  
✅ Protected routes  
✅ Responsive UI with loading states  

## Project Structure
```
/src
├── app/           # App router pages
├── components/    # Reusable components
├── hooks/         # Custom hooks
├── lib/           # API services & utilities
├── redux/         # Redux store
├── styles/        # CSS modules
└── types/         # TypeScript types
├── services/      # some API integrations
└── public/        # some public images 

```

## Route Size Report

```
Route (app)                             | Size     | First Load JS
-------------------------------------- | -------- | --------------
○ `/`                                   | 1.43 kB  | 131 kB
○ `/_not-found`                         | 898 B    | 101 kB
○ `/add-post`                           | 2.35 kB  | 133 kB
○ `/login`                              | 1.25 kB  | 131 kB
○ `/my-posts`                           | 3.8 kB   | 175 kB
○ `/posts`                              | 4.45 kB  | 165 kB
ƒ `/posts/[id]`                         | 18.6 kB  | 170 kB
○ `/register`                           | 1.28 kB  | 121 kB

### First Load JS Shared by All

File                                        | Size
-----------------------------------------  | --------
`chunks/4bd1b696-147f9ec121febacb.js`      | 52.5 kB
`chunks/517-310b7ad3453faeb5.js`           | 45.6 kB
Other shared chunks (total)                | 1.95 kB

> ○  (Static)   prerendered as static content  
> ƒ  (Dynamic)  server-rendered on demand
```


## 🛠 Local Setup

1. **Clone & Install**  
  ```bash
git clone https://github.com/frzfrsfra3/frontend_devteam.git
cd frontend_devteam
npm i or npm i --force
```
   

2. **Configure Environment**  
   Create `.env.local` for development environment or `.env.prod` for production environment and add your backend url to variable of NEXT_PUBLIC_API_BASE_URL :
   ```env
   NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
   ```

3. **Run Development Server**  
   ```bash
   npm run dev
   ```

4. **Production Build**  
   ```bash
   npm run build
   npm start
   ```
