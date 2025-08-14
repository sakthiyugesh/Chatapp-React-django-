# React + Django Realtime Chat Application

A real-time chat application built with **React (frontend)** and **Django + Django Channels (backend)**.  
Features email-based login, WebSocket-based real-time messaging, and Daphne as the ASGI server.

---

## 🚀 Features
- **Email Login & Registration** (Django Authentication)
- **Real-time Chat** using WebSockets (Django Channels)
- **Daphne ASGI Server** for WebSocket handling
- **REST API** for authentication and message history
- **Frontend:** React with Hooks and Axios
- **Backend:** Django, Django Rest Framework, Django Channels, Redis
- **Secure Secret Key** handling with `.env`
- **Responsive Design** for mobile and desktop

---

## 🛠 Tech Stack

**Frontend**
- React.js
- Axios (HTTP requests)
- React Router (Navigation)
- WebSocket API (Real-time communication)

**Backend**
- Django (Python web framework)
- Django Rest Framework (DRF) for REST API
- Django Channels (WebSockets)
- Daphne (ASGI server)
- SQLite (Database)

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm/yarn

###  Clone the Repository

```bash
git clone https://github.com/sakthiyugesh/Chatapp-React-django-





cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your settings (SECRET_KEY, DATABASE_URL, etc.)

# Run migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Run development server
python manage.py runserver

# OR run with Daphne for WebSocket support
daphne backend.asgi:application --port 8000



### Frontend setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend API URL

# Start development server
npm start
