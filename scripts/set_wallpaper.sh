#!/bin/bash

# set_wallpaper.sh — reloads wallpaper after generating new one
# Customize this script according to your OS or window manager.

# Function to run the Node.js wallpaper generation script
run_wallpaper_gen() {
  (cd /home/aditya/Documents/program/SadhguruQuoteGen/api && node src/index.js "$@" && reload_wallpaper)
}

# Function to reload the wallpaper using "hyprctl" and "hyprpaper"
reload_wallpaper() {
  hyprctl hyprpaper reload ,/home/aditya/Documents/program/SadhguruQuoteGen/api/frontend/screenshot.png
}

run_wallpaper_gen "$@"

