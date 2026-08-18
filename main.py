import uuid
import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from sqlalchemy import (
    create_engine,
    Column,
    String,
    Text,
    Integer,
    Numeric,
    Boolean,
    DateTime,
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, sessionmaker, Session


# ============================================================
# DATABASE CONNECTION
# ============================================================


DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in the environment")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="RailCare Backend"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE MODELS
# ============================================================

class Department(Base):
    __tablename__ = "departments"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True
    )

    name = Column(
        String,
        nullable=False
    )


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True
    )

    complaint_number = Column(
        String,
        nullable=False
    )

    user_id = Column(
        UUID(as_uuid=True),
        nullable=True
    )

    train_number = Column(
        String,
        nullable=True
    )

    coach_number = Column(
        String,
        nullable=True
    )

    seat_number = Column(
        String,
        nullable=True
    )

    summary = Column(
        Text,
        nullable=True
    )

    category = Column(
        String,
        nullable=True
    )

    priority = Column(
        String,
        nullable=True
    )

    department_id = Column(
        UUID(as_uuid=True),
        nullable=True
    )

    officer_id = Column(
        UUID(as_uuid=True),
        nullable=True
    )

    incident_id = Column(
        UUID(as_uuid=True),
        nullable=True
    )

    status = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    severity_score = Column(
        Integer,
        nullable=True
    )

    sla_minutes = Column(
        Integer,
        nullable=True
    )

    deadline = Column(
        DateTime(timezone=True),
        nullable=True
    )

    passenger_name = Column(
        String,
        nullable=True
    )

    requires_human_review = Column(
        Boolean,
        nullable=True
    )

    input_type = Column(
        String,
        nullable=True
    )


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True
    )

    complaint_id = Column(
        UUID(as_uuid=True),
        nullable=False
    )

    category = Column(
        String,
        nullable=True
    )

    priority = Column(
        String,
        nullable=True
    )

    department_id = Column(
        UUID(as_uuid=True),
        nullable=True
    )

    summary = Column(
        Text,
        nullable=True
    )

    confidence = Column(
        Numeric,
        nullable=True
    )

    extracted_train_number = Column(
        String,
        nullable=True
    )

    extracted_coach_number = Column(
        String,
        nullable=True
    )

    extracted_seat_number = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=True
    )


class Media(Base):
    __tablename__ = "media"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True
    )

    complaint_id = Column(
        UUID(as_uuid=True),
        nullable=False
    )

    media_type = Column(
        String,
        nullable=True
    )

    file_url = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=True
    )
class StatusHistory(Base):
    __tablename__ = "status_history"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True
    )

    complaint_id = Column(
        UUID(as_uuid=True),
        nullable=False
    )

    old_status = Column(
        String,
        nullable=True
    )

    new_status = Column(
        String,
        nullable=False
    )

    changed_by = Column(
        UUID(as_uuid=True),
        nullable=True
    )

    remarks = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

# ============================================================
# AI JSON FORMAT
#
# THIS MATCHES THE JSON YOU GAVE ME
# ============================================================

class AIComplaint(BaseModel):

    category: str

    priority: str

    department: str

    summary: str

    confidence: float

    train_number: Optional[str] = None

    coach_number: Optional[str] = None

    seat_number: Optional[str] = None

    severity_score: int

    requires_human_review: bool

    input_type: str

    image_url: Optional[str] = None


# ============================================================
# OPTIONAL INFORMATION FROM FRONTEND
# ============================================================

class AIComplaintRequest(BaseModel):

    # The AI JSON
    complaint: AIComplaint

    # Optional frontend/user information
    passenger_name: Optional[str] = None

    user_id: Optional[str] = None


# ============================================================
# AI → DATABASE ENUM MAPPING
# ============================================================

CATEGORY_MAP = {

    # AI JSON             → PostgreSQL enum

    "Cleanliness":
        "CLEANLINESS",

    "Electrical":
        "ELECTRICAL",

    "Mechanical":
        "COACH_DAMAGE",

    "Security/RPF":
        "SECURITY",

    "Medical":
        "OTHER",

    "Staff Behavior":
        "STAFF_BEHAVIOUR",

    "Other":
        "OTHER",
}
DEPARTMENT_MAP = {
    "Sanitation":
        "Sanitation",
    "Electrical":
        "Electrical",
    "Mechanical": 
        "Coach_Maintenance",
    "RPF":
        "Security",
    "Commercial":
        "General",
    "Medical":
        "General",
}

PRIORITY_MAP = {

    # AI JSON             → PostgreSQL enum

    "P1 - Urgent":
        "CRITICAL",

    "P2 - High":
        "HIGH",

    "P3 - Medium":
        "MEDIUM",

    "P4 - Low":
        "LOW",
}


# ============================================================
# SLA
# ============================================================

SLA_MAP = {

    "CRITICAL": 15,

    "HIGH": 45,

    "MEDIUM": 120,

    "LOW": 240,
}


# ============================================================
# DEPARTMENT LOOKUP
# ============================================================

def get_department_id(
    db: Session,
    department_name: str
):

    department = (
        db.query(Department)
        .filter(
            Department.name.ilike(
                department_name.strip()
            )
        )
        .first()
    )

    if department is None:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Department "
                f"'{department_name}' "
                f"was not found."
            )
        )

    return department.id


# ============================================================
# COMPLAINT NUMBER
# ============================================================

def generate_complaint_number():

    return (
        "RM-"
        + uuid.uuid4().hex[:8].upper()
    )


# ============================================================
# MAIN CONVERSION FUNCTION
# ============================================================
MEDIA_TYPE_MAP = {
    "photo": "IMAGE",
    "audio": "AUDIO",
    "video": "VIDEO",
}
def save_ai_complaint(
    db: Session,
    ai: AIComplaint,
    passenger_name: Optional[str] = None,
    user_id: Optional[str] = None,
):

    # --------------------------------------------------------
    # 1. CONVERT CATEGORY
    # --------------------------------------------------------

    db_category = CATEGORY_MAP.get(
        ai.category
    )

    if db_category is None:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Unknown AI category: "
                f"'{ai.category}'"
            )
        )


    # --------------------------------------------------------
    # 2. CONVERT PRIORITY
    # --------------------------------------------------------

    db_priority = PRIORITY_MAP.get(
        ai.priority
    )

    if db_priority is None:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Unknown AI priority: "
                f"'{ai.priority}'"
            )
        )


    # --------------------------------------------------------
    # 3. FIND DEPARTMENT UUID
    # --------------------------------------------------------

    # Get department name from AI
    ai_department = ai.department.strip()

# Convert AI department name to database department name
    db_department = DEPARTMENT_MAP.get(ai_department)

    if db_department is None:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown AI department: '{ai.department}'"
        )

# Get UUID from departments table
    department_id = get_department_id(
        db,
        db_department
    )

    # --------------------------------------------------------
    # 4. CALCULATE SLA
    # --------------------------------------------------------

    sla_minutes = SLA_MAP[
        db_priority
    ]

    now = datetime.now(
        timezone.utc
    )

    deadline = (
        now
        + timedelta(
            minutes=sla_minutes
        )
    )


    # --------------------------------------------------------
    # 5. CREATE COMPLAINT UUID
    # --------------------------------------------------------

    complaint_id = uuid.uuid4()


    # --------------------------------------------------------
    # 6. CREATE COMPLAINT ROW
    # --------------------------------------------------------

    complaint = Complaint(

        id=complaint_id,

        complaint_number=
            generate_complaint_number(),

        user_id=user_id,

        train_number=
            ai.train_number,

        coach_number=
            ai.coach_number,

        seat_number=
            ai.seat_number,

        summary=
            ai.summary,

        category=
            db_category,

        priority=
            db_priority,

        department_id=
            department_id,

        # Not supplied by AI
        officer_id=None,

        incident_id=None,

        status=
            "SUBMITTED",

        created_at=
            now,

        updated_at=
            now,

        severity_score=
            ai.severity_score,

        sla_minutes=
            sla_minutes,

        deadline=
            deadline,

        passenger_name=
            passenger_name,

        requires_human_review=
            ai.requires_human_review,

        input_type=
            ai.input_type,
    )

    db.add(complaint)

    db.flush()


    # --------------------------------------------------------
    # 7. CREATE AI_ANALYSIS ROW
    # --------------------------------------------------------

    analysis = AIAnalysis(

        id=uuid.uuid4(),

        complaint_id=
            complaint_id,

        category=
            db_category,

        priority=
            db_priority,

        department_id=
            department_id,

        summary=
            ai.summary,

        confidence=
            ai.confidence,

        extracted_train_number=
            ai.train_number,

        extracted_coach_number=
            ai.coach_number,

        extracted_seat_number=
            ai.seat_number,

        created_at=
            now,
    )

    db.add(analysis)
    # --------------------------------------------------------
# CREATE INITIAL STATUS HISTORY
# --------------------------------------------------------

    status_history = StatusHistory(
        id=uuid.uuid4(),

        complaint_id=complaint_id,

        old_status=None,

        new_status="SUBMITTED",

        changed_by=None,

        remarks="Complaint submitted",

        created_at=now,
    )

    db.add(status_history)
    db_media_type = MEDIA_TYPE_MAP.get(ai.input_type)

    if db_media_type is None:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown AI input type: '{ai.input_type}'"
    )
    # --------------------------------------------------------
    # 8. CREATE MEDIA ROW
    # --------------------------------------------------------

    if ai.image_url:

        media = Media(
            id=uuid.uuid4(),
            complaint_id=complaint_id,
            media_type=db_media_type,
            file_url=ai.image_url,
            created_at=now,
        )

        db.add(media)


    # --------------------------------------------------------
    # 9. COMMIT EVERYTHING
    # --------------------------------------------------------

    try:

        db.commit()

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Database insert failed: "
                + str(e)
            )
        )


    # --------------------------------------------------------
    # 10. RETURN RESULT TO AI/FRONTEND
    # --------------------------------------------------------

    return {

        "success": True,

        "message":
            "Complaint stored successfully",

        "complaint_id":
            str(complaint_id),

        "complaint_number":
            complaint.complaint_number,

        "department_id":
            str(department_id),

        "database_category":
            db_category,

        "database_priority":
            db_priority,
    }


# ============================================================
# AI → BACKEND ENDPOINT
# ============================================================


@app.post("/api/ai/complaint")
def receive_ai_complaint(
    ai: AIComplaint,
    db: Session = Depends(get_db),
):
    return save_ai_complaint(
        db=db,
        ai=ai,
    )

# ============================================================
# GET ALL COMPLAINTS
# ============================================================

@app.get(
    "/api/complaints"
)
def get_complaints(
    db: Session = Depends(get_db)
):

    complaints = (
        db.query(Complaint)
        .order_by(
            Complaint.created_at.desc()
        )
        .all()
    )

    output = []

    for complaint in complaints:

        department_name = None

        if complaint.department_id:

            department = (
                db.query(Department)
                .filter(
                    Department.id
                    ==
                    complaint.department_id
                )
                .first()
            )

            if department:

                department_name = (
                    department.name
                )


        output.append({

            "id":
                str(complaint.id),

            "complaint_number":
                complaint.complaint_number,

            "train_number":
                complaint.train_number,

            "coach_number":
                complaint.coach_number,

            "seat_number":
                complaint.seat_number,

            "summary":
                complaint.summary,

            "category":
                complaint.category,

            "priority":
                complaint.priority,

            "department":
                department_name,

            "department_id":
                (
                    str(
                        complaint.department_id
                    )
                    if complaint.department_id
                    else None
                ),

            "severity_score":
                complaint.severity_score,

            "requires_human_review":
                complaint.requires_human_review,

            "input_type":
                complaint.input_type,

            "status":
                complaint.status,

            "sla_minutes":
                complaint.sla_minutes,

            "deadline":
                complaint.deadline,

            "created_at":
                complaint.created_at,

            "updated_at":
                complaint.updated_at,
        })


    return output


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():

    return {
        "status":
            "RailCare backend is running",

        "ai_endpoint":
            "/api/ai/complaint",

        "complaints_endpoint":
            "/api/complaints",
    }


# ============================================================
# LOCAL RUN
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )