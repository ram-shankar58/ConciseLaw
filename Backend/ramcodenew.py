
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import pandas as pd
from transformers import BertTokenizer, BertModel
import torch
from sklearn.preprocessing import normalize
import numpy as np
from scipy.spatial.distance import cdist
import joblib
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/ram"  # Replace with your MongoDB URI
mongo = PyMongo(app)

# Device configuration (GPU if available)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load necessary files and models
# Load the trained KMeans model
kmeans = joblib.load('kmeans_model.pkl')

# Load the court cases dataset with clusters
df = pd.read_csv('finalfile4.csv')

# Load the normalized features from the .npz file
normalized_data = np.load('normalized_features.npz')
X_normalized = normalized_data['arr_0']

# Set the local path of the Legal BERT model
local_model_path = './legal-bert-model'  # Replace with your actual folder path containing the BERT model files
tokenizer = BertTokenizer.from_pretrained(local_model_path)
model = BertModel.from_pretrained(local_model_path).to(device)

# User Registration Endpoint
@app.route("/register", methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    existing_user = mongo.db.users.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    mongo.db.users.insert_one({"username": username, "password": hashed_password})
    
    return jsonify({"message": "User registered successfully"}), 201

# User Login Endpoint
@app.route("/login", methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    user = mongo.db.users.find_one({"username": username})

    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Helper functions for ML model
def extract_features(text):
    """ Extract features from the input text using the Legal BERT model. """
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    inputs = {k: v.to(device) for k, v in inputs.items()}  # Move inputs to the device (CPU/GPU)
    with torch.no_grad():
        outputs = model(**inputs)
        cls_embedding = outputs.last_hidden_state[:, 0, :].cpu().squeeze().numpy()  # Extract [CLS] token embedding
    return cls_embedding

def tag_user_input(text):
    """ Tag the user-inputted text to find the predicted cluster. """
    input_features = extract_features(text)
    input_features_normalized = normalize([input_features])
    predicted_cluster = kmeans.predict(input_features_normalized)[0]
    return predicted_cluster, input_features_normalized

def find_top_5_similar_cases(input_features, predicted_cluster):
    """ Find the top 5 similar cases based on the predicted cluster. """
    cluster_cases = df[df['cluster'] == predicted_cluster].index
    cluster_features = X_normalized[cluster_cases]
    distances = cdist(input_features, cluster_features, metric='euclidean')[0]
    top_5_indices = distances.argsort()[:5]
    
    # Get the case names and summaries for the top 5 closest cases
    top_5_cases = df.iloc[top_5_indices][['casename', 'summary']].to_dict('records')
    
    return top_5_cases

# ML Prediction Endpoint (no username/password required for ML predictions)
@app.route("/predict", methods=['POST'])
def predict():
    """ API endpoint to predict the cluster and find similar cases. """
    try:
        input_data = request.json
        input_text = input_data['text']  # Extract the case text from the request

        # Get the predicted cluster and normalized features for the input text
        predicted_cluster, input_features = tag_user_input(input_text)
        
        # Find the top 5 similar cases based on the predicted cluster
        similar_cases = find_top_5_similar_cases(input_features, predicted_cluster)
        
        return jsonify({
            "predicted_cluster": int(predicted_cluster),
            "similar_cases": similar_cases
        })
    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)

