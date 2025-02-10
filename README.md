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

- [ ] error logging (w/ axiom - paid)
- [x] correct client side auth errors
- [ ] customised user settings page
- [ ] chat/profile configuration button and popup
- [x] build routes for all chat pages
  - [x] figure out best routing conventions
  - [ ] chat headers route only called once during login, or after create-chat invocation
  - [ ] delete chat functionality
- [x] load database with mock data for testing (one db for testing and one for production)
- [ ] add image upload capabilities
- [ ] connect to openAI API
- [ ] test calls to openAI and routes (w/ tRPC)
- [ ] error management (w/ sentry)
- [ ] routing pages (parallel routes)
- [ ] set up analytics (w/ posthog maybe highlight?)
- [ ] payment processing (w/ stripe)
- [ ] performace optimization testing (w/ react-scan)
