

```markdown
# RailCare AI - Intelligent Complaint Triage

An AI-powered multimodal inspection and routing engine for Indian Railways passenger complaints.

## 👥 Core Team
* Harsh Mishra
* Harsha Soans
* Soham Shingade
* Gaurang Gohil
* Mrunmayee Joshi
* Harsh Sawant


## 🚀 Quick Setup Guide

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/harshm1811/RailCareAI.git](https://github.com/harshm1811/RailCareAI.git)
   cd RailCareAI

```

2. **Create and activate the virtual environment:**
```bash
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

```


3. **Install dependencies:**
```bash
pip install -r requirements.txt

```


4. **Configure Environment:**
Create a hidden `.env` file in the root directory and add your API key:
```text
GEMINI_API_KEY=your_gemini_api_key_here

```


5. **Run the AI Engine:**
```bash
python app.py

```

## 🗄️ Database

The application uses PostgreSQL through Supabase.

### Core Tables

- `users` — Passenger, admin, and officer accounts
- `departments` — Complaint handling departments
- `complaints` — Main passenger complaint records
- `ai_analysis` — AI classification and extracted complaint information
- `incidents` — Incident tracking
- `officers` — Officer information and assignments
- `media` — Complaint image, audio, and video references
- `status_history` — Tracks complaint status changes

### Database Design

The database uses PostgreSQL enums for controlled values including:

- `user_role`
- `complaint_category`
- `complaint_priority`
- `complaint_status`
- `incident_severity`
- `incident_status`
- `media_type`

The complete database schema is available in:

```text
schema.sql