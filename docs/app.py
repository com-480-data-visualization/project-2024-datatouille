from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
import json

app = Flask(__name__)

@app.route('/project-2024-datatouille/data/michelin_restaurants.geojson')
def places():
    with open('data/michelin_restaurants.geojson') as f:
        data = json.load(f)
    return data

@app.route('/')
def index():
   return render_template('index.html')

@app.route('/project-2024-datatouille/templates/about_project.html')
def about_project():
   return render_template('about_project.html')

@app.route('/project-2024-datatouille/templates/main_page.html')
def main_page():
   return render_template('main_page.html')

@app.route('/project-2024-datatouille/templates/about_us.html')
def about_us():
   return render_template('about_us.html')

@app.route('/project-2024-datatouille/templates/statistics.html')
def statistics():
   return render_template('statistics.html')

@app.route('/project-2024-datatouille/templates/michelin_guide.html')
def michelin_guide():
   return render_template('michelin_guide.html')

if __name__ == '__main__':
   app.run(debug=True)