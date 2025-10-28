# **SadhguruQuoteGen - A custom wallpaper generator of sadhguru's daily quotes** #

### **_Project Overview_** ###
SadhguruQuoteGen is a Node.js-based automation tool that generates a daily wallpaper featuring Sadhguru’s quote and its corresponding background image directly from the official Isha Foundation website.

The script scrapes the daily quote and image, updates a local HTML template with this content, and uses Puppeteer to render and save a high-resolution wallpaper automatically.

## **_Features_** ##

* Automatically fetches the daily quote and wallpaper image from Sadhguru’s official site  
* Injects the fetched content into a custom HTML template  
* Renders a high-resolution wallpaper using Puppeteer  
* Supports specific date input (in DDMMYYYY format)  
* Saves the final wallpaper image locally  

## **_Tech Stack_** ##

* **Node.js** – runtime environment
* **Axios** – for making HTTP requests
* **Cheerio** – for parsing and traversing HTML
* **Puppeteer** – for headless Chromium rendering and screenshot generation
* **fs/promises** – for file operations

## **_How It Works_** ##

* Fetches the quote and background image from https://isha.sadhguru.org/en/wisdom/quotes/date/{date}
* Parses the HTML to extract the quote text and image URL.
* Encodes the image to Base64 and inserts both the quote and image into a predefined HTML template.
* Opens the updated template using Puppeteer in headless mode.
* Captures and saves a high-resolution screenshot as the daily wallpaper.

## **_Installation_** ##

* Clone the repository
* cd SadhguruQuoteGen/api
* npm install

## **_Usage_** ##

* ### **Generate Today's Wallpaper** ###
    node src/index.js

* ### **Generate Wallpaper for a specific date** ###
    node src/index.js DDMMYY

Note: If no date argument is provided, the script automatically uses the current
date.

## **_Using Scripts to Automatically Generate and Change the Wallpaper_** ##

* You can optionally integrate this project with your desktop environment or window manager to automatically generate and reload your wallpaper.

#### Step 1 — Edit `scripts/set_wallpaper.sh` according to your OS or window manager ####

This file controls how your system sets or reloads the generated wallpaper.  
The commands differ depending on your operating system or window manager.

For example, if you use **Hyprland**, your script might look like this:

```bash
#!/bin/bash

# Function to run the Node.js wallpaper generation script
run_wallpaper_gen() {
  (cd /path/to/SadhguruQuoteGen/api && node src/index.js "$@")
}

# Function to reload the wallpaper using Hyprland's hyprctl and hyprpaper
reload_wallpaper() {
  hyprctl hyprpaper reload ,/path/to/SadhguruQuoteGen/api/frontend/screenshot.png
}

# Execute both functions
run_wallpaper_gen "$@"
```
#### Step 2 - Make the script executable ####

```
chmod +x set_wallpaper.sh
```

#### Step 3 - Run the script ####

```
./scripts/set_wallpaper.sh
```

This script first generates a new Sadhguru quote wallpaper and then reloads it automatically using your system’s wallpaper manager.

