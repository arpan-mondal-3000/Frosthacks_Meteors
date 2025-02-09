import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve API credentials
API_KEY = os.getenv("GEM_API_KEY")
MODEL_NAME = os.getenv("GEM_MODEL", "gemini-pro")  # Default model

# Check if API Key exists
if not API_KEY:
    raise ValueError("API Key is missing! Set GEM_API_KEY in .env file.")

# Configure Gemini API
os.environ["GENABLE_GRPC"] = "False"  # Force HTTP instead of gRPC
genai.configure(api_key=API_KEY)

# Initialize the Gemini model
model = genai.GenerativeModel(MODEL_NAME)

def AI_FILTER(prompt):
    """Processes the prompt with Gemini AI and returns optimized content."""
    try:
        response = model.generate_content(prompt)
        return response.text.strip()  # Ensuring clean output
    except Exception as e:
        return f"Error: {str(e)}"

# if __name__ == "__main__":
#     # Input JSON for medicine optimization
#     with open("\output\medicine_name.json","r") as r:
#         medicines_data = json.load(r)

    # medicines_data = {
    #     "medicines": [
    #         {
    #             "name": "Betaloc 100mg",
    #             "dosage": "100mg",
    #             "frequency": "Twice a day (Every 12 hours)",
    #             "duration": "As needed",
    #             "route": "Oral",
    #             "purpose": "Unknown",
    #             "special_instructions": "No additional instructions provided."
    #         },
    #         {
    #             "name": "Dorzolamidum 10 mg",
    #             "dosage": "10 mg",
    #             "frequency": "Twice a day (Every 12 hours)",
    #             "duration": "As needed",
    #             "route": "Oral",
    #             "purpose": "Unknown",
    #             "special_instructions": "No additional instructions provided."
    #         },
    #         {
    #             "name": "Cimetidine 50 mg",
    #             "dosage": "50 mg",
    #             "frequency": "Three times a day (Every 8 hours)",
    #             "duration": "As needed",
    #             "route": "Oral",
    #             "purpose": "Unknown",
    #             "special_instructions": "No additional instructions provided."
    #         },
    #         {
    #             "name": "Oxprelol 50mg",
    #             "dosage": "50 mg",
    #             "frequency": "Once a day",
    #             "duration": "As needed",
    #             "route": "Oral",
    #             "purpose": "Unknown",
    #             "special_instructions": "No additional instructions provided."
    #         }
    #     ],
    #     "general_instructions": "No overall instructions provided."
    # }

    # Convert JSON to a formatted string
    json_prompt = json.dumps(medicines_data, indent=2)

    # Prompt for AI processing
    prompt = f"extrect the time imformation from the following json data when we have to use this meditnine time when wehen we have to use this medicine ex: 8:00 am 12:00 pm 9:00 pm if any person day start ai 8:00 so say wich time we have to take meditine and you ect best of the give data json outout no additional value:\n{json_prompt}"

    # Get AI response
    optimized_result = AI_FILTER(prompt)

    print(optimized_result)
