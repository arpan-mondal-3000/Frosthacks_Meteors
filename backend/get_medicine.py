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
def get_medical_data(extracted_text):
    prompt = f"""
    #     Extract structured medical data from the following prescription text:
        
    #     "{extracted_text}"

    #     Return the output in strict JSON format with **detailed information** as shown:

    #     {{
    #       "medicines": [
    #         {{
    #           "name": "medicine_name",
    #           "dosage": "dosage_details (including mg, IU, ml, etc.)",
    #           "frequency": "detailed schedule (e.g., Take three times daily, every 8 hours, at 8 AM, 4 PM, 12 AM)",
    #           "duration": "treatment duration in days or as needed",
    #           "route": "method of administration (e.g., Oral, Injection, Topical)",
    #           "purpose": "specific condition it treats (e.g., Fever, Bacterial Infection, Pain Relief)",
    #           "special_instructions": "warnings or additional instructions (e.g., Take with food, Avoid alcohol, Complete the full course)"
    #         }}
    #       ],
    #       "general_instructions": "any overall instructions or warnings (e.g., Drink plenty of water, Avoid operating heavy machinery)"
    #     }}

    #     Ensure the JSON output is:
    #     - **Complete** with full details.
    #     - **Accurate** with proper structure.
    #     - **Well-formatted** with correct syntax.
    #     *BID** → **Twice a day** (Every 12 hours)  
    #   - **TID** → **Three times a day** (Every 8 hours)  
    #   - **QD** → **Once a day**  
    #   - **Tab** → **Tablet**
    #     - give me the all name may be medicine so give me problaty of how mauct it may meditine name give in bracket()
    #     """

    response = model.generate_content(prompt)

    data=response.text.strip()
    
    data=data.split("```json")[1].split("```")[0]
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)  # Ensure directory exists
    file_path = os.path.join(output_dir, "medicine_name.json")
    data_output=json.loads(data)
    with open(file_path, "w") as json_file:
        json.dump(data_output, json_file, indent=2)

    return data_output
