# Plate Picks PRD

## 1. Project Overview

**Plate Picks** is a mobile-first collaborative food recommendation service. It allows a group of users to join a session via an invite code, set meal preferences, vote on recommended dishes, and receive a final optimized menu suggestion that reflects the group’s collective taste.

## 2. Product Goal

The service helps groups make meal decisions faster and with less friction by:

- collecting individual preferences,
- aggregating group feedback,
- and presenting a final recommendation with high group satisfaction.

## 3. Target Experience

The product should feel:

- clean,
- lightweight,
- intuitive,
- and mobile-first.

The overall UX follows a **Modern Minimalist** style inspired by Toss, with immersive full-screen layouts and minimal persistent navigation.

## 4. Design System & Brand Identity

### 4.1 Visual Style

- **Style Direction:** Modern Minimalist (Toss-inspired)
- **Primary Color:** `#0064FF`
- **Background:** `#FFFFFF`
- **Surface Color:** `#F2F4F6`

### 4.2 Typography

- **Font Family:** Inter / Pretendard / other clean sans-serif fonts
- **Headline Style:** Bold and large
- **Text Hierarchy:** Clear visual contrast between titles, descriptions, and controls

### 4.3 Component Principles

- Full-width primary buttons
- Rounded buttons and cards (`round-full` or large border radius)
- Soft shadows for card separation
- No persistent top app bar
- No persistent bottom navigation bar
- Content-first immersive screen layouts

## 5. Core User Flow

1. User opens the app and either creates a new group or joins an existing one.
2. The group organizer sets meal conditions such as time, method, budget, and cravings.
3. The app generates a unique invite code and link for participants.
4. Each participant evaluates suggested dishes through a lightweight voting flow.
5. The group monitors voting progress in real time.
6. The system calculates and displays the final recommendation.

## 6. Screens & Requirements

### 6.1 Home Screen — Start Organizing

**Purpose**  
Initial entry point for creating a new group or joining an existing one.

**Key Elements**

- Large headline: **"Start organizing a group meal"**
- Numeric input for participant count
- Primary CTA: **Create Group**
- Secondary CTA: **Join Existing Group**

**Reference**  
`{{DATA:SCREEN:SCREEN_34}}`

---

### 6.2 Condition Setting — Preference Filter

**Purpose**  
Allows the organizer to define recommendation conditions before participants vote.

**Key Elements**

- Segmented controls for time:
  - Breakfast
  - Lunch
  - Dinner
- Icon cards for dining method:
  - Delivery
  - Dine-In
- Price range slider
- Quick budget chips for per-person budget
- Multi-select craving chips such as:
  - Italian
  - Mexican
  - Sushi
  - etc.

**Reference**  
`{{DATA:SCREEN:SCREEN_32}}`

---

### 6.3 Group Invite — Social Sharing

**Purpose**  
Provides access information so other users can join the session.

**Key Elements**

- Success message: **"Group Created!"**
- Large invite code display (example: `XP9-KL2`)
- Copy icon button next to the code
- Primary CTA: **Share Invite Link**

**Reference**  
`{{DATA:SCREEN:SCREEN_30}}`

---

### 6.4 Taste Assessment — Swipe / Vote

**Purpose**  
Enables each participant to quickly evaluate recommended dishes.

**Key Elements**

- Large, high-quality food image
- Dish name
- Category tags
- Binary feedback actions:
  - **No thanks** (gray)
  - **Looks good** (blue / heart icon)

**Reference**  
`{{DATA:SCREEN:SCREEN_25}}`

---

### 6.5 Voting Status — Real-Time Progress

**Purpose**  
Shows how many users have completed the voting process before final recommendation is shown.

**Key Elements**

- Overall progress bar
- Participant list
- Status labels:
  - Completed
  - Pending
- Checkmark indicator for completed users
- **Notify** button to remind pending participants

**Reference**  
`{{DATA:SCREEN:SCREEN_14}}`

---

### 6.6 Final Recommendation — The Perfect Match

**Purpose**  
Displays the final dish chosen for the group.

**Key Elements**

- Hero image of the selected dish
- Match badge (example: **98% Match**)
- Dish description
- Flavor profile summary
- Action buttons:
  - **Get Recommendation Again**
  - **Save to Profile**

**Reference**  
`{{DATA:SCREEN:SCREEN_21}}`

## 7. Functional Requirements

### 7.1 Group Creation

- Users must be able to create a new group session.
- The organizer must be able to input participant count.
- The system must generate a unique invite code and invite link.

### 7.2 Group Joining

- Users must be able to join an existing group using an invite code or shared link.

### 7.3 Preference Configuration

- The organizer must be able to set:
  - meal time,
  - dining method,
  - budget range,
  - and craving categories.

### 7.4 Dish Voting

- Each participant must be able to review dishes one by one.
- Each dish must support simple binary evaluation.
- Voting should be fast and mobile-friendly.

### 7.5 Real-Time Progress Tracking

- The system must reflect each participant’s completion state in real time.
- The status screen must update as users finish voting.

### 7.6 Recommendation Result

- The system must calculate a final menu recommendation based on group preferences.
- The final result screen must show:
  - the winning dish,
  - a match percentage,
  - summary information,
  - and follow-up actions.

## 8. Interaction & UX Notes

- Use smooth transitions for swipe or vote interactions.
- Animate progress bar updates naturally.
- Prioritize thumb-friendly interaction zones on mobile.
- Keep screens visually uncluttered.
- Maintain strong CTA emphasis using the primary brand color.

## 9. Technical Notes

### 9.1 Layout

- Use Flexbox and Grid for responsive screen composition.
- Design primarily for mobile widths first.

### 9.2 State Management

- Real-time synchronization is required for the voting status screen.
- Participant completion data should update without requiring a full refresh.

### 9.3 Motion

- Use subtle transitions for:
  - card swiping,
  - state changes,
  - and progress feedback.

## 10. Summary

Plate Picks is a collaborative group food decision service designed to reduce indecision and improve satisfaction in group meal planning. The product combines lightweight preference setup, quick dish voting, real-time participation tracking, and a polished final recommendation flow within a clean mobile-first interface.
