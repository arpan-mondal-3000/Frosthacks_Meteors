import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve API credentials
API_KEY = os.getenv("HUG_API_KEY")
MODEL_NAME = os.getenv("HUG_MODEL_NAME")
API_URL = os.getenv("HUG_API_URL")

# Debugging logs (remove in production)
print("API Key:", "*****" if API_KEY else "Missing API Key")
print("Model Name:", MODEL_NAME)
print("API URL:", API_URL)

# Set request headers with API key
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def get_medical_data(extracted_text):
    """
    Calls an AI model to extract structured medical data from a given text (e.g., prescription).

    Parameters:
        extracted_text (str): The text extracted from a prescription.

    Returns:
        dict: A structured dictionary containing extracted medical information.
    """
    print("✅ get_medical_data called successfully")

    # Construct an improved request payload with detailed instructions
    prompt = f"""
    Extract structured medical data from the following prescription text:
    
    "{extracted_text}"

    Return the output in strict JSON format with **detailed information** as shown:

    {{
      "medicines": [
        {{
          "name": "medicine_name",
          "dosage": "dosage_details (including mg, IU, ml, etc.)",
          "frequency": "detailed schedule (e.g., Take three times daily, every 8 hours, at 8 AM, 4 PM, 12 AM)",
          "duration": "treatment duration in days or as needed",
          "route": "method of administration (e.g., Oral, Injection, Topical)",
          "purpose": "specific condition it treats (e.g., Fever, Bacterial Infection, Pain Relief)",
          "special_instructions": "warnings or additional instructions (e.g., Take with food, Avoid alcohol, Complete the full course)"
        }}
      ],
      "general_instructions": "any overall instructions or warnings (e.g., Drink plenty of water, Avoid operating heavy machinery)"
    }}

    Ensure the JSON output is:
    - **Complete** with full details.
    - **Accurate** with proper structure.
    - **Well-formatted** with correct syntax.
    *BID** → **Twice a day** (Every 12 hours)  
  - **TID** → **Three times a day** (Every 8 hours)  
  - **QD** → **Once a day**  
  - **Tab** → **Tablet**
    - give me the all name may be medicine so give me problaty of how mauct it may meditine name give in bracket()
    """

    data = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 500  # Adjust to allow longer responses
        }
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data)

        if response.status_code == 200:
            result = response.json()


            structured_output = result[0]["generated_text"]
            try:
                # print(structured_output)
                raw_output = structured_output.split("json")[1].split("```")[0]
            except Exception:
                raw_output = structured_output.split(">")[1]

            # Parse JSON output
            output = json.loads(raw_output)

            # Define the path to save the output JSON file
            output_dir = "output"
            os.makedirs(output_dir, exist_ok=True)  # Ensure directory exists
            file_path = os.path.join(output_dir, "medicine_name.json")

            # Save the structured data into a JSON file
            with open(file_path, "w") as json_file:
                json.dump(output, json_file, indent=2)

            print(f"✅ Data successfully saved to {file_path}")
            return output

        else:
            print(f"❌ API Request Failed: {response.status_code} - {response.text}")
            return {"error": f"API request failed with status code {response.status_code}"}

    except requests.exceptions.RequestException as e:
        print(f"❌ Request Error: {e}")
        return {"error": "Network error occurred"}

    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return {"error": "An unexpected error occurred"}
