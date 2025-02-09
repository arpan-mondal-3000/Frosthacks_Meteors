import os
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

# Function to get the generic name of a medicine
def get_generic_name(name):
    try:
        response = model.generate_content(f"Provide only the generic name of {name}.")
        return response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"

# Function to get 10 medicine names as a list
def get_results(generic_name):
    try:
        response = model.generate_content(
            f"List 10 medicine names for {generic_name}. Provide only names separated by commas."
        )
        # Convert response string to a list
        medicines = [med.strip() for med in response.text.split(",") if med.strip()]
        return medicines
    except Exception as e:
        return [f"Error: {str(e)}"]

# Function to get structured medicine data
def get_medicine_data(medicine_name):
    generic_name = get_generic_name(medicine_name)
    
    if "Error" in generic_name:
        return {"name": medicine_name, "generic name": "Error", "results": []}

    medicines = get_results(generic_name)
    
    return {
        "name": medicine_name,
        "generic name": generic_name,
        "results": medicines
    }

# # Example Usage
# if __name__ == "__main__":
#     medicine_name = "Paracetamol"
#     result = get_medicine_data(medicine_name)
#     print(result)  # Returns dictionary output
