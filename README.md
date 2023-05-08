# Awesome Radio

Awesome Radio is a personal internet radio station aggregator.

![Screenshot](screenshot.png)

## Features

* Browse radio stations by tag
* Listen while navigating
* Fully responsive UI for mobile, tablets, and desktop
* Light and dark theme automatically enabled by OS settings
* Deep linking for all UI actions
* User accounts
* Add content sources to import stations

## Roadmap

* Support user favorites
* Support importing from other source types
* Support manually adding/editing/disabling stations
* Support [PWA](https://web.dev/progressive-web-apps/) to allow user to save to home screen on mobile devices
* User profile page
* Fix: Primary drawer stays open after navigation
* Fix: Station id in deep-link url...should be station slug
* Fix: Missing form validation and error handling
* Tech Debt: Add more unit and E2E tests

## Development

### Tech Stack

* [Remix](https://remix.run): React SSR web framework
* [SQLite](https://www.sqlite.org): File based relational database
* [Prisma](https://www.prisma.io/): Node TS ORM
* [Vitest](https://vitest.dev): Unit test framework
* [Cypress](https://www.cypress.io): Browser automation test framework
* [Tailwind CSS](https://tailwindcss.com): CSS utility framework
* [DaisyUI](https://daisyui.com/): Component CSS library built with Tailwind
* [PostCSS](https://postcss.org): CSS pre-processor
* [Typescript](https://www.typescriptlang.org/): Typed Javascript

### Project Structure Summary

```
.
├── .github/              Deployment workflow to fly.io    
├── app/                  Main app folder...contains components, routes, etc   
│   ├── models      Primsa DB queries
│   ├── root.tsx    Root of the Remix UI
│   └── routes      File based http routing         
├── cypress/              Cypress E2E tests 
├── prisma/               DB ORM: db migrations and seed
└── public/               Public static assets
```

### Getting Started

1. Create `.env` file from `.env.example`

```shell
cp .env.example .env
```

2. Migrate & Seed the SQLite DB

```shell
npx prisma migrate deploy
npx prisma db seed
```

### Running

```shell
npm run dev
```

### Testing

Run unit tests

```shell
npm run test
```

Run E2E tests

```shell
npm run test:e2e:run
```

Run all checks

```shell
npm run validate
```
