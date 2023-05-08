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
* Fix: Primary drawer stays open after navigation
* Tech Debt: Add more unit and E2E tests

## Development

### Tech Stack

* [Remix](https://remix.run): React SSR web framework
* [SQLite](https://www.sqlite.org): File based relational database
* [Prisma](https://www.prisma.io/): Node TS ORM
* [Vitest](https://vitest.dev): Unit test framework

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
