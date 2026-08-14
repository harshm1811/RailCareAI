import os
from google import genai
from pydantic import BaseModel, Field
from typing import Optional
from PIL import Image
from dotenv import load_dotenv

# This loads the hidden variables from your .env file
load_dotenv()

# =============================================================
# 1. API KEY SETUP
# =============================================================
# Make sure to replace this with your actual Google AI Studio key!
API_KEY = os.environ.get("GEMINI_API_KEY", "PASTE_FALLBACK_HERE")
client = genai.Client(api_key=API_KEY)


# =============================================================
# 2. THE DATABASE CONTRACT (JSON BLUEPRINT)
# =============================================================
class RailCareOutput(BaseModel):
    category: str = Field(
        description="Must be one of: Cleanliness, Electrical, Mechanical, Security/RPF, Medical, Staff Behavior, Other"
    )
    priority: str = Field(
        description="Must be one of: P1 - Urgent, P2 - High, P3 - Medium, P4 - Low"
    )
    department: str = Field(
        description="Must be one of: Sanitation, Electrical, Mechanical, RPF, Commercial, Medical"
    )
    summary: str = Field(
        description="Short 1-sentence description of the issue."
    )
    confidence: float = Field(
        description="AI confidence score from 0.0 to 1.0"
    )
    train_number: Optional[str] = Field(
        description="Train number if visible, otherwise null"
    )
    coach_number: Optional[str] = Field(
        description="Coach number if visible, otherwise null"
    )
    seat_number: Optional[str] = Field(
        description="Seat number if visible, otherwise null"
    )
    severity_score: int = Field(
        description="Score from 1 (minor) to 10 (critical)"
    )
    requires_human_review: bool = Field(
        description="True if confidence < 0.70 or severity is 8 or higher, else False"
    )
    input_type: str = Field(
        description="For now, always return 'photo'"
    )

    # =============================================================
# 3. GEMINI VISION AI FUNCTION (PROMPT & EXECUTION)
# =============================================================
def analyze_complaint(image_path: str):
    print(f"\n🔍 Scanning {image_path} with RailCare AI...\n")

    # This prompt tells the AI exactly how to behave
    prompt = """
    You are an AI Inspector for the Indian Railways RailCare system. 
    Analyze this passenger complaint photo carefully.
    
    Instructions:
    1. Identify the primary issue (e.g., garbage, broken fan, exposed wire).
    2. Read any visible text to find the train number, coach number (e.g., B4, S3), or seat number.
    3. If a number is NOT visible in the photo, you MUST return null for that field. Do not hallucinate or guess.
    4. Estimate a confidence score (0.0 to 1.0) based on how clear the image is.
    5. Categorize the priority, severity (1-10), and route it to the correct department based on the allowed list.
    """

    # Call the Gemini model (using gemini-2.0-flash or gemini-1.5-flash)
    response = client.models.generate_content(
        model="gemini-3.7-flash", 
        contents=[Image.open(image_path), prompt],
        config={
            "response_mime_type": "application/json",
            "response_schema": RailCareOutput,
        },
    )

    print("✅ JSON Generated Successfully!")
    return response.text


# =============================================================
# 4. RUN THE PROGRAM
# =============================================================
if __name__ == "__main__":
    TEST_IMAGE = "test.jpg"

    if os.path.exists(TEST_IMAGE):
        analyze_complaint(TEST_IMAGE)
    else:
        print(f"❌ Error: Please make sure '{TEST_IMAGE}' is in your folder!")