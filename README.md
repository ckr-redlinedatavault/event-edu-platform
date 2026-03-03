# EventEdu Platform

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

### Core Modules

*   **Super Admin GCHQ:** Global system oversight, institution management, and platform-wide analytics.
*   **Institutional Control:** Dedicated dashboards for college administrators to deploy events and manage registries.
*   **Smart Ticketing:** Automated QR code generation and PDF ticket delivery for participants.
*   **Dynamic Discovery:** Automated event feeds and institutional public showcases.

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
