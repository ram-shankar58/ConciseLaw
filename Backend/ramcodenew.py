from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from transformers import BertTokenizer, BertModel
import torch
from sklearn.preprocessing import normalize
import numpy as np
from scipy.spatial.distance import cdist
import joblib

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS if needed

# Device configuration (GPU if available)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load necessary files and models
# Load the trained KMeans model
kmeans = joblib.load('kmeans_model.pkl')

# Load the court cases dataset with clusters
df = pd.read_csv('court_cases_with_clusters.csv')

# Load the normalized features from the .npz file
normalized_data = np.load('normalized_features.npz')
X_normalized = normalized_data['arr_0']

# Set the local path of the Legal BERT model
local_model_path = './legal-bert-model'  # Replace with your actual folder path containing the BERT model files
tokenizer = BertTokenizer.from_pretrained(local_model_path)
model = BertModel.from_pretrained(local_model_path).to(device)

def extract_features(text):
    """
    Extract features from the input text using the Legal BERT model.
    """
    # Tokenize and prepare input
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    inputs = {k: v.to(device) for k, v in inputs.items()}  # Move inputs to the device (CPU/GPU)

    # Perform inference to get the [CLS] token embedding
    with torch.no_grad():
        outputs = model(**inputs)
        cls_embedding = outputs.last_hidden_state[:, 0, :].cpu().squeeze().numpy()  # Extract [CLS] token embedding
    return cls_embedding

def tag_user_input(text):
    """
    Tag the user-inputted text to find the predicted cluster.
    """
    # Extract features using the BERT model
    input_features = extract_features(text)
    
    # Normalize the input features
    input_features_normalized = normalize([input_features])
    
    # Predict the cluster using the KMeans model
    predicted_cluster = kmeans.predict(input_features_normalized)[0]
    return predicted_cluster, input_features_normalized

def find_top_5_similar_cases(input_features, predicted_cluster):
    """
    Find the top 5 similar cases based on the predicted cluster.
    """
    # Filter cases belonging to the predicted cluster
    cluster_cases = df[df['cluster'] == predicted_cluster].index
    
    # Get normalized features of the filtered cases
    cluster_features = X_normalized[cluster_cases]
    
    # Calculate distances between input features and cluster features
    distances = cdist(input_features, cluster_features, metric='euclidean')[0]
    
    # Get indices of the top 5 closest cases
    top_5_indices = distances.argsort()[:5]
    
    # Get the case IDs for the top 5 closest cases
    top_5_case_ids = df.iloc[top_5_indices]['Caseid'].tolist()  # Ensure the case IDs are in the correct format
    
    return top_5_case_ids

@app.route("/predict", methods=['POST'])
def predict():
    """
    API endpoint to predict the cluster and find similar cases.
    """
    try:
        # Parse input JSON data
        input_data = request.json
        input_text = input_data['text']

        # Get the predicted cluster and normalized features for the input text
        predicted_cluster, input_features = tag_user_input(input_text)
        
        # Find the top 5 similar cases based on the predicted cluster
        similar_cases = find_top_5_similar_cases(input_features, predicted_cluster)
        
        # Return the predicted cluster and similar cases as JSON
        return jsonify({
            "predicted_cluster": int(predicted_cluster),  # Ensure it's a standard int
            "similar_cases": similar_cases
        })
    except Exception as e:
        # Log the full exception message
        print(f"Exception occurred: {e}")
        # Handle exceptions and send an error response
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
