# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## How to initialize?

```
pnpm create t3-app@latest
```

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## To-do list

### DEMO

- [ ] front-end

  - [x] create home/chat/login pages
  - [x] personify home page (can be improved) - more relatable ui
  - [x] fix chat page ui
  - [x] update sidebar ui, completely hidden
  - [ ] personify sidebar ui + classify by relationship maybe(?) (can be improved)
  - [ ] fix create-chat page ui (languages greyed out)

- [x] correct client side auth errors (import session from clerk not next-auth)

- [ ] auth + trpc

  - [x] fix login page ui (just styling)
  - [x] remove user id input from all routes use id from ctx.session
  - [x] seed current users into vercel db
  - [ ] user with no plan is rerouted to "/plans" page when navigating to 'new chat'
  - [ ] update clerk webhooks to send data to vercel db (for production do manually depending on external account)
  - [ ] update config.ts/index.ts and src/api/auth (not for demo, read up!)

- [ ] profile

  - [ ] customised user settings page (optional)
  - [ ] chat/profile configuration button and popup
  - [ ] create updateProfile route, only updates necessary info
  - [ ] delete chat functionality

- [ ] homepage + chat headers

  - [x] test chatHeaders routes
  - [x] figure out best routing conventions
  - [ ] route createChat to new page with the chat once complete
  - [ ] chat headers route only called once during login, or after create-chat invocation (not for demo)
  - [ ] create chat scrollbox

- [ ] openAI API (text-to-text)

  - [x] system prompt optimization (can be improved)
  - [x] write sendMessage route
  - [ ] test sendMessage call to openAI and check response
  - [ ] route only required data from db to server, add context window library and tokenizer, figure out embedding
  - [ ] optimize speed and payload size

- [ ] clean up all code and add comments for ease of reading
  - [ ] /app
    - [ ] /\_components
    - [ ] all other pages
  - [ ] /server

### PRODUCTION

- [ ] performace optimization testing (w/ react-scan) (not for demo)

  - [ ] optimize front-end data fetching with react-query
  - [ ] learn all different types of queries
  - [ ] minimize rerenders

- [ ] separate dbs for production and dev (w/ vercel - paid, not for demo)
- [ ] check auth caching state (not for demo?)
- [ ] add image upload capabilities (not for demo)
- [ ] error logging (w/ axiom - paid) (not for demo)
- [ ] error management (w/ sentry)
- [ ] routing pages (parallel routes)
- [ ] set up analytics (w/ posthog maybe highlight?)
- [ ] payment processing + webhooks (w/ stripe)
