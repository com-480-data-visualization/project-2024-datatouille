import os
import datetime
import json
import requests
import dotenv

dotenv.load_dotenv()

API_KEY = os.getenv("API_KEY")
X_RAPIDAPI_KEY = os.getenv("X_RAPIDAPI_KEY")

def log_response_data(data, prefix=""):
    """
    Logs the response data to a JSON file.

    Args:
        data (dict): The response data to be logged.
        prefix (str, optional): The prefix to be added to the filename. Defaults to "".
    """
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"responses/{prefix}_{timestamp}.json"
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w') as f:
        json.dump(data, f)

def search_places(text_query):
    """
    Search for places using the Google Places API.

    Args:
        text_query (str): The text query to search for places.

    Returns:
        str: The ID of the first place found in the search results.
    """
    url = 'https://places.googleapis.com/v1/places:searchText'
    
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id'
    }

    data = {
        "textQuery": text_query
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))

    log_response_data(response.json(), prefix=f"places_search_{text_query}")
    
    if "places" not in response.json():
        return None
    if len(response.json()["places"]) == 0:
        return None
    
    return response.json()["places"][0]["id"]
    

def get_google_location_details(location_id):
    """
    Retrieves the details of a Google location based on its ID.

    Args:
        location_id (str): The Google location ID.

    Returns:
        dict: The details of the Google location.
    """
    url = f"https://places.googleapis.com/v1/places/{location_id}?fields=*&key={API_KEY}"
    response = requests.get(url)
    data = response.json()

    log_response_data(data, prefix=f"places_{location_id}")

    return data


def get_the_fork_autocomplete(text_to_search,latitute,longitude):
    """
    Retrieves auto-complete suggestions for a search query from The Fork API.

    Args:
        text_to_search (str): The text to search for.

    Returns:
        dict: The auto-complete suggestions.
    """
    url = "https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/auto-complete"

    querystring = {"text": text_to_search,"latitude":latitute,"longitude":longitude}

    headers = {
        "X-RapidAPI-Key": X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "the-fork-the-spoon.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    log_response_data(response.json(), prefix=f"the_fork_auto_complete_{text_to_search}")

    return response.json()


def get_the_fork_data(location_id):
    """
    Retrieves data about a restaurant from The Fork API.

    Args:
        location_id (str): The location ID of the restaurant.

    Returns:
        dict: The data about the restaurant.
    """
    url = "https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/get-info"

    querystring = {"restaurantId": location_id}

    headers = {
        "X-RapidAPI-Key": X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "the-fork-the-spoon.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    log_response_data(response.json(), prefix=f"the_fork_{querystring['restaurantId']}")
    return response.json()


