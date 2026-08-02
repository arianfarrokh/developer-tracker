# Developer OS

## Product Vision

Developer OS is a personal productivity platform built specifically for software developers.

The goal is to replace multiple tools (Notion, Todoist, Calendar, Notes, Habit Tracker, Learning Tracker) with a single application that I actually use every day.

This project is not intended to be a generic productivity application. Every feature should answer the question:

"What helps me become a better developer today?"

---

# Tech Stack

Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend
- ASP.NET Core
- GraphQL (HotChocolate)
- MediatR
- EF Core
- SQL Server

Architecture
- Clean Architecture
- Feature-based folders
- CQRS
- Repository Pattern

---

# MVP Modules

## Dashboard

Purpose

Dashboard should NOT own any data.

It only aggregates information from other modules.

Widgets

- Welcome Card
- Today's Focus
- Current Project
- Quick Statistics
- Calendar Preview
- Goals Summary
- Habits Summary
- Learning Summary
- Recent Notes
- Recent Activity

---

## Projects

Projects are the heart of the application.

Every other module can optionally connect to a project.

Features

- Create Project
- Edit Project
- Archive Project
- Delete Project
- Progress Tracking
- Technologies
- GitHub Repository(first phase just a link to my repository is enough)
- Milestones

Project Tabs

- Overview
- Tasks
- Calendar
- Notes
- Learning
- Analytics

Project Entity

- Name
- Description
- Status
- Color
- Progress
- RepositoryUrl
- LiveUrl
- StartDate
- TargetDate
- IsPinned

---

## Calendar (its frotens is completly ready dont fucus on its frontend)

Purpose

Plan the day.

Features

- Month View
- Week View
- Day View
- Agenda
- Recurring Events
- Drag & Drop
- Time Blocking
- Event Categories

Events can optionally belong to:

- Project
- Goal

---

## Habits

Purpose

Track consistency.

Examples

- Workout
- No Smoking
- Reading
- Gaming
- Water
- Meditation

Features

- Daily Check
- Streak
- Heatmap
- Statistics
- Completion Rate
- History

Entities

Habit

HabitRecord

---

## Goals

Purpose

Track long-term progress.

Examples

- Finish Developer OS
- Read 20 Books
- Reach 75kg
- Learn Kubernetes

Features

- Progress
- Milestones
- Deadline
- Categories
- Linked Project

---

## Learning

Purpose

Track what I study.

Features

Learning Topics

Study Sessions

Study Time

Learning Notes

Resources

Statistics

Examples

React

.NET

DDD

GraphQL

Docker

Redis

RabbitMQ

---

## Notes

Purpose

Simple markdown notes.

Features

Markdown

Folders

Tags

Project Linking

Learning Linking

Search

---

# Domains

Identity

Projects

Calendar

Habits

Goals

Learning

Notes

Dashboard (Aggregation only)

---

# Relationships

User

owns

Projects

Goals

Habits

Learning

Notes

Calendar

Projects

contain

Tasks

Notes

Calendar Events

Learning Topics

Milestones

Goals may belong to Projects.

Calendar Events may belong to Projects.

Notes may belong to Projects.

Learning Topics may belong to Projects.

Dashboard has NO entities.

Dashboard only aggregates data.

---

# Development Phases


## Phase 1

Projects

Implement:

- CRUD
- Cards
- Detail Page
- Overview
- Progress
- Technologies
- Milestones

Goal:
Projects become the central module.

---

## Phase 2

Dashboard

Implement dashboard widgets.

Dashboard consumes APIs from other modules.

Dashboard never stores data.

Goal:
First usable home page.

---

## Phase 3

Calendar

just backend
Goal:
Plan daily work.

---

## Phase 4

Habits

Implement

- Habit CRUD
- Daily Tracking
- Heatmap
- Statistics
- Streaks

Goal:
Track consistency.

---

## Phase 5

Goals

Implement

- Goal CRUD
- Progress
- Milestones
- Deadlines
- Categories

Goal:
Track long-term objectives.

---

## Phase 6

Learning

Implement

- Topics
- Sessions
- Resources
- Notes
- Statistics

Goal:
Measure learning instead of estimating it.

---

## Phase 7

Notes

Implement

- Markdown Editor
- Tags
- Folders
- Search
- Project Linking

Goal:
Become the primary note-taking tool.

---

## Phase 8

Analytics

Build charts from existing data.

Examples

- Weekly Coding Hours
- Learning Hours
- Habit Success Rate
- Goal Completion
- Project Progress

No additional entities.

---

## Phase 9

Polish

- Animations
- Keyboard Shortcuts
- Empty States
- Skeletons
- Mobile Improvements
- Performance
- Accessibility
- Dark/Light Theme Improvements

---

# Design Principles

- Modern dark UI
- Inspired by Linear, Raycast, Vercel and Notion
- Card-based dashboard
- Large spacing
- Minimal colors
- Purple accent color
- Fast interactions
- Keyboard-first experience
- Responsive
- Smooth animations
- Clean typography

---

# Rules

- Dashboard owns no entities.
- Every feature must belong to a domain.
- Keep the UI minimal.
- Do not over-engineer.
- Build production-quality components.
- Reuse components whenever possible.
- Every page should answer one question for the user.