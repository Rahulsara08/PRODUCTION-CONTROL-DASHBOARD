# Production Control Dashboard

A clean, minimalist web dashboard for factory operations managers to track shop floor production jobs, spot delayed orders quickly, and update job statuses in real time.

## Features

- **Summary Metrics**: High-level floor counts for Total Jobs, Delayed orders, Due Today / Soon, and Completed jobs. Values recalculate immediately upon status changes.
- **Jobs Table**: Comprehensive work order table with Job ID, part name, customer, quantity, due date with relative delivery window, status indicator, and assigned machine station.
- **Instant Search**: Case-insensitive live search matching job ID, part name, customer, and machine.
- **Status Filtering**: One-click status filter tabs (All, Delayed, In Progress, Pending, Completed) with live counts.
- **Multi-Column Sorting**: Sort by due date, quantity, job ID, or customer name in ascending/descending order.
- **Job Detail Slide-out Sheet**: Inspect full work order details, machine assignment, and floor notes. Supports keyboard navigation (`Esc` to dismiss).
- **Inline Status Updates**: Change job status directly from the side panel with immediate reflection across the table and summary cards.
- **Shop Floor Notes**: Add and update operator notes and issue logs.
- **Responsive & Accessible**: Fully functional on desktop, tablet, and mobile screens.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm run start
```
