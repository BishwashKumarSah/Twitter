# Twitter Clone

A full-featured Twitter clone built with Next.js, Tailwind CSS, GraphQL, and Prisma. This application provides real-time updates, infinite scrolling for tweets, an explore search feature, and more, closely resembling the functionality of Twitter.

---

## Features

### Frontend

- **User Authentication:** Sign up, log in, and log out using Google OAuth.
- **Tweeting:** Post tweets with real-time updates.
- **Follow/Unfollow:** Follow and unfollow other users seamlessly.
- **Profile Viewing:** View profiles of other users.
- **Infinite Scroll:** Smooth infinite scrolling to load tweets using TanStack Query.
- **Explore Search:** Search for users and tweets similar to Twitter’s explore feature.
- **Server-Side Rendering:** Improved performance and SEO using Next.js SSR.

### Backend

- **GraphQL API:** Efficient querying and mutations for seamless data interaction.
- **Prisma ORM:** Type-safe interaction with a PostgreSQL database hosted on Supabase.
- **Redis Caching:** Enhanced query performance with Redis for caching.
- **Secure Authentication:** Managed with Google OAuth and JSON Web Tokens.
- **AWS Integration:** Storage, deployment, and CDN for scalability and reliability.

---

## Tech Stack

### Frontend

- **Next.js:** For building the application with server-side rendering.
- **Tailwind CSS:** Enables rapid styling and reusable components.
- **TanStack Query:** Optimizes client-side data caching for smooth performance.
- **Codegen:** Ensures type-safe GraphQL interactions.

### Backend

- **Node.js:** Hosts the GraphQL server.
- **Apollo Server:** Provides a flexible and efficient API layer.
- **Prisma ORM:** Simplifies database interactions with a PostgreSQL database hosted on Supabase.
- **Redis:** Boosts server performance with caching.
- **AWS:** Offers robust storage, deployment, and CDN functionalities.

---

## Project Setup

### Repository Structure

The repository is structured into two main folders:
- `client`: Contains the frontend code.
- `server`: Contains the backend code.

### Frontend

1. Clone the repository:

   ```bash
   git clone https://github.com/BishwashKumarSah/Twitter.git
   ```

2. Navigate into the client directory:

   ```bash
   cd Twitter/client
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn add
   ```

4. Start the development server:

   ```bash
   yarn dev
   ```

The application should now be running at:

```
http://localhost:3000
```

### Backend

1. Navigate into the server directory:

   ```bash
   cd Twitter/server
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

   or

   ```bash
   npm install
   ```

3. Run Prisma migrations to set up the database:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the server:

   ```bash
   yarn dev
   ```

The server will be running at:

```
http://localhost:8000
```

---

## Contributions

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

For issues, feel free to open a new issue on GitHub.

---

## License


[https://github.com/BishwashKumarSah/Twitter.git](https://github.com/BishwashKumarSah/Twitter.git)

