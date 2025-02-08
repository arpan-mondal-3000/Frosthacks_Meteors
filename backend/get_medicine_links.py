# from bs4 import BeautifulSoup
# from selenium import webdriver
# from selenium.webdriver.firefox.options import Options
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# import json
# import os
# import re


# def get_medicine_name_links(med):
#     """
#     Fetches medicine names, prices, and links from Google Shopping results.

#     Parameters:
#         med (str): The medicine name to search for.

#     Returns:
#         list: A sorted list of dictionaries containing medicine details (title, link, price, image).
#     """
#     print("✅ get_medicine_name_links called successfully")

#     if not med:
#         return {"error": "No text found in the request"}

#     # Configure headless Firefox
#     options = Options()
#     options.add_argument("--headless")

#     URL = f"https://www.google.com/search?q={med}+medicine&tbm=shop"

#     driver = webdriver.Firefox(options=options)
#     medicines = []

#     try:
#         driver.get(URL)

#         # Wait until product elements are present
#         WebDriverWait(driver, 5).until(
#             EC.presence_of_element_located((By.CSS_SELECTOR, "div.sh-dgr__grid-result"))
#         )

#         soup = BeautifulSoup(driver.page_source, "html.parser")

#         # Extract product containers
#         content_classes = soup.select("div.sh-dgr__grid-result")
#         print(f"Found {len(content_classes)} products")

#         for i, content in enumerate(content_classes[:6]):  # Limit to 6 items
#             title_tag = content.find("h3")
#             title = title_tag.text.strip() if title_tag else "No title found"

#             link_tag = content.find("a", href=True)
#             product_url = f"https://www.google.com{link_tag['href']}" if link_tag else "No link found"

#             price_tag = content.select_one("span[aria-hidden='true']")
#             raw_price = price_tag.text.strip() if price_tag else "No price found"

#             price_match = re.search(r"[\d,]+(?:\.\d+)?", raw_price)
#             price = float(price_match.group().replace(",", "")) if price_match else float("inf")

#             img_tag = content.find("img")
#             img_url = img_tag["src"] if img_tag else "No image found"

#             if title not in [m["title"] for m in medicines]:  # Avoid duplicates
#                 medicines.append({
#                     "title": title,
#                     "link": product_url,
#                     "price": price,
#                     "image": img_url
#                 })

#         # Sort by price
#         medicines.sort(key=lambda x: x["price"])

#         # Save output
#         output_dir = "output"
#         os.makedirs(output_dir, exist_ok=True)

#         file_path = os.path.join(output_dir, "medicine_links.json")
#         with open(file_path, "w", encoding="utf-8") as w:
#             json.dump(medicines, w, indent=2, ensure_ascii=False)

#         print(f"✅ Data extracted, sorted by price, and saved to {file_path}")

#     except Exception as e:
#         print(f"❌ Error: {e}")
#         return {"error": "An error occurred while fetching medicine data"}

#     finally:
#         driver.quit()

#     return medicines





import os
from serpapi import GoogleSearch
import re

def get_medicine_name_links(med):
    # Get API key from environment variables (Better security)
    api_key = os.getenv("SERP_API")
    if not api_key:
        return {"error": "API key is missing. Set SERPAPI_KEY in environment variables."}

    # SerpAPI Parameters
    params = {
        "engine": "google_shopping",
        "q": f"{med} medicine",
        "api_key": api_key,
        "location": "India",
        "hl": "en",
        "gl": "IN"
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()

        medicines = []
        if "shopping_results" in results:
            for item in results["shopping_results"][:10]:  # Get first 10 results
                price_str = item.get("price", "₹0")  # Default to ₹0 if price is missing
                
                # Extract numerical value from price string
                price_match = re.search(r"\d+[\.,]?\d*", price_str)
                price = float(price_match.group().replace(",", "")) if price_match else 0.0

                medicines.append({
                    "title": item.get("title"),
                    "link": item.get("link"),
                    "price": price,
                    "image": item.get("thumbnail")
                })

            # Sort medicines by price
            medicines.sort(key=lambda x: x["price"]) 
            print(medicines) 

            return medicines
        else:
            return {"error": "No shopping results found."}

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

        