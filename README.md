# Immersive Event Discovery & Management Platform

**Event Registration Platform** is an immersive, client-side event discovery and administration platform. Built with vanilla web technologies, it features an interactive interface, fluid animations, and a comprehensive organizer dashboard for managing events and registrations seamlessly.

This application is frontend-focused, utilizing local storage and client-side logic to deliver a fast, responsive, and engaging user experience with zero external database dependencies.

## 🌟 Overview

The platform is built to bridge the gap between high-aesthetic visual experiences and operational utility. Designed for premium events, it offers distinct portals tailored to different user roles:

- **Member Space**: An interactive experience where guests can explore curated events using custom categories, view detailed event information, and easily register for their favorite upcoming experiences.
- **Admin Command**: A functional interface for event organizers to orchestrate events, manage registrations, track attendee statistics, and oversee the entire platform ecosystem.

## ✨ Key Features

### 1. Interactive Event Discovery
- **Smart Categorization**: Browse through a wide array of events seamlessly organized by categories.
- **Detailed Event Profiles**: In-depth event pages featuring dates, venues, host information, and dynamic visual layouts.
- **Immersive Visuals**: Integrates advanced libraries like Three.js and Globe.gl to render stunning visual representations.

### 2. Comprehensive Event Registration
- **Seamless Registration Flow**: User-friendly sign-in and registration forms tailored for quick onboarding.
- **Personal Ticket Vault (My Events)**: A dedicated dashboard where users can view their active registrations, track event statuses, and manage their schedules.

### 3. Admin Management Dashboard
- **Event CRUD Operations**: Full capabilities to add, edit, or delete custom event listings.
- **Real-time Metrics**: Displays crucial count stats for organizers to monitor platform activity and attendance.

### 4. Immersive Design Foundations
- **Responsive Layouts**: Designed to be pixel-perfect across desktop, tablet, and mobile displays.
- **Polished Micro-Animations**: Smooth transitions, hover effects, and modern UI tokens ensuring a premium, cinematic feel.

## 🖥️ Screens & Modules

- **Landing Hub (`index.html`)**: The immersive entrance featuring highlighted events and clean navigation.
- **Categories Explorer (`categories.html`)**: The primary events directory organized by themes and topics.
- **Detail Gateway (`event-details.html`)**: Details event itineraries, metadata, and provides the registration trigger.
- **My Events Portal (`my-events.html`)**: The user's active pass directory to track upcoming registered events.
- **Authentication (`signin.html` & `registration.html`)**: Secure portals for user login and new account creation.
- **Admin Portal (`admin.html`)**: The organizer dashboard hosting metrics, user lists, and event database controls.
- **Information Pages (`about.html`, `help.html`, `partner.html`, `privacy.html`, `terms.html`)**: Comprehensive platform documentation and support resources.

## ⚙️ Technical Stack

- **Languages**: HTML5, CSS3, JavaScript (ES6)
- **Libraries**: Three.js & Globe.gl (for 3D visual data representations and animations)
- **Storage**: Web LocalStorage (Structured key-value serialization for data persistence)

## 📂 Folder Structure

```text
├── admin.html               # Admin Dashboard Portal
├── index.html               # Landing Hub (Home Page)
├── about.html               # About Us Page
├── categories.html          # Categories Explorer
├── event-details.html       # Detailed Event Information
├── my-events.html           # User Bookings & Registered Events
├── registration.html        # New User Registration
├── signin.html              # User Authentication Portal
├── README.md                # Project Technical Documentation
├── css/                     # Stylesheets and Design Tokens
└── js/                      # Core Logic and Component Scripts
```

## 🚀 Installation & Usage

Because this platform is a client-side vanilla web application, no dependency compilation or installation is necessary.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd Event-Registration-Platform-2
```

### 2. Launch Local Server
To bypass browser CORS policy restrictions on local module imports, run a local server from the root directory to access the application.

**Using Python 3:**
```bash
python3 -m http.server 5050
```
*(Access the portal at http://localhost:5050)*

**Using Node.js (via npx):**
```bash
npx http-server -p 5050
```
*(Access the portal at http://localhost:5050)*

## 👥 Authors / Credits

The platform was developed by the following engineering team members:
- **Aditya Vawhal**
- **Sumit tiwari**
- **Rehan Azim**
- **Sai Shendge**
- **Khushi Shah**

## 🙏 Acknowledgments

Special thanks to the **LeapX Internship Program mentorship team**, and contributors to the **vanilla JS animation libraries, Three.js and Globe.gl communities**.
