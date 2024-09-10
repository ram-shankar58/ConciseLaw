import pandas as pd
from transformers import BertTokenizer, BertModel
import torch
from sklearn.preprocessing import normalize
import numpy as np
from scipy.spatial.distance import cdist
import joblib

# Use GPU if available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load the pre-trained KMeans model
kmeans = joblib.load('./kmeans_model.pkl')

# Read the dataset with clusters
df = pd.read_csv('court_cases_with_clusters.csv')

# Load the normalized features from the .npz file
normalized_data = np.load('./normalized_features.npz')
X_normalized = normalized_data['arr_0']

# Specify the local path where the Legal BERT model is saved
local_model_path = 'legal-bert-model'  # Replace with your actual path

# Load the tokenizer and model from the local path
tokenizer = BertTokenizer.from_pretrained(local_model_path)
model = BertModel.from_pretrained(local_model_path).to(device)

def extract_features(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    inputs = {k: v.to(device) for k, v in inputs.items()}  # Move to GPU
    with torch.no_grad():
        outputs = model(**inputs)
        cls_embedding = outputs.last_hidden_state[:, 0, :].cpu().squeeze().numpy()  # [CLS] token
    return cls_embedding

# Function to tag user-inputted text and find the cluster
def tag_user_input(text):
    input_features = extract_features(text)
    input_features_normalized = normalize([input_features])
    predicted_cluster = kmeans.predict(input_features_normalized)[0]
    return predicted_cluster, input_features_normalized

def find_top_5_similar_cases(input_features, predicted_cluster):
    cluster_cases = df[df['cluster'] == predicted_cluster].index
    cluster_features = X_normalized[cluster_cases]  # Get the normalized features of the cluster
    distances = cdist(input_features, cluster_features, metric='euclidean')[0]
    top_5_indices = distances.argsort()[:5]
    return df.iloc[top_5_indices]['Caseid'].values

# Sample prompt
prompt = '''Property cases'''

predicted_cluster, input_features = tag_user_input(prompt)
print(f"Predicted cluster: {predicted_cluster}")

top_5_similar_cases = find_top_5_similar_cases(input_features, predicted_cluster)
print(f"Top 5 most similar cases: {top_5_similar_cases}")
