# 🌿 Starwood Library

A responsive web application for managing book catalog. Users can browse books, track their reading progress, and save their favorite books, while Administrators can manage the entire library inventory and handle user requests.

## Features

### For Users 
* **Authentication:** Secure signup and login using Supabase Auth.
* **The Grand Catalog:** Browse the library with real-time text search and category filtering.
* **Profile:** Track reading statistics and view personal shelves.
* **Interactive Shelves:** Add books to "Want to Read", "Finished", or "Adored" (Favorites) lists.
* **Pigeon Post:** A dedicated contact form to send book requests to the Head Librarian.
* **Theming:** Toggle between Sunlight (Light) and Starlight (Dark) modes.

### For Admins
* **Protected Dashboard:** Secured via Role-Based Access Control.
* **Inventory CMS:** Full CRUD capabilities to add, edit, or banish (delete) books from the catalog.
* **Image Hosting:** Upload book covers directly to Supabase Storage.
* **Pigeon Inbox:** Read, manage, and resolve user requests and messages.


## 🗄️ Database Schema Overview

The application relies on a relational PostgreSQL database with the following core tables:
* `tomes`: The global catalog of books (title, author, description, coverUrl, category).
* `profiles`: User roles (admin/user) linked securely to Supabase Auth IDs.
* `user_library`: A pivot table tracking relationships between users and books (status, is_favorite).
* `pigeons`: A table storing user contact requests and their resolution status.



   
