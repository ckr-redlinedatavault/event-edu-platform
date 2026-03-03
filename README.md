<div align="center">
  <img src="public/logo.png" alt="EventEdu Logo" width="200" />
  <h1>EventEdu Platform</h1>
  <p>
    <a href="#tech-stack">Tech Stack</a> | 
    <a href="#features">Features</a> | 
    <a href="#development-setup">Setup</a> | 
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

A high-performance, institutional event management infrastructure designed for scalability and seamless student engagement.

---

### Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| **Frontend** | [React 19](https://react.dev/) / [Tailwind CSS 4](https://tailwindcss.com/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Motion** | [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll) |
| **Security** | [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) |

---

### Features

| Feature | Description |
| :--- | :--- |
| **Global Overlord Dashboard** | Total control over institutions, events, and system-wide analytics. |
| **Institutional Portals** | Dedicated management for college admins to host and track events. |
| **Automated Ticketing** | Instant QR code generation with high-resolution PDF delivery. |
| **Smart Registration** | Multi-tier ticketing with real-time capacity monitoring. |
| **Event Discovery** | Institutional event feeds with advanced filtering and search. |
| **Smooth Experience** | Modern UI with smooth scrolling and dynamic micro-animations. |

---

### Development Setup

1. **Environmental Configuration**
   ```bash
   # Create a .env file with the following:
   DATABASE_URL="your_postgresql_url"
   DIRECT_URL="your_direct_postgresql_url"
   SUPER_ADMIN_EMAIL="admin@platform.com"
   SUPER_ADMIN_PASSWORD="secure_master_key"
   ```

2. **Installation**
   ```bash
   npm install
   ```

3. **Database Synchronization**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Runtime**
   ```bash
   npm run dev
   ```

---

### Deployment

Optimized for **Vercel** with integrated Prisma generation in the build pipeline. All schema changes are automatically synchronized using the pre-build `prisma generate` hook.

---

<div align="center">
  <p>Built for the next generation of academic ecosystems.</p>
</div>
