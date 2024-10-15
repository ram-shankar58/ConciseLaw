package main

import (
    "context"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "log"
    "net/http"
    "os"
    "bytes"
    "io/ioutil"

    "github.com/gorilla/mux"
    "github.com/gorilla/handlers"
    "github.com/joho/godotenv"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "go.mongodb.org/mongo-driver/bson"
)

// User struct for registration/login
type User struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

// PredictionInput for ML requests
type PredictionInput struct {
    Text string `json:"text"`
}

var client *mongo.Client
var usersCollection *mongo.Collection

func init() {
    // Load .env for environment variables
    err := godotenv.Load(".env")
    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    // Connect to MongoDB
    mongoURI := os.Getenv("mongodb://localhost:27017/ram")
    clientOptions := options.Client().ApplyURI(mongoURI)
    client, err = mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    usersCollection = client.Database("ram").Collection("users")
}

// Hash password with SHA-256
func hashPassword(password string) string {
    h := sha256.New()
    h.Write([]byte(password))
    return hex.EncodeToString(h.Sum(nil))
}

// Compare hash and password
func compareHashAndPassword(hash, password string) bool {
    return hash == hashPassword(password)
}

// Register new users
func registerHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Check if the user already exists
    var existingUser bson.M
    err := usersCollection.FindOne(context.TODO(), bson.M{"username": user.Username}).Decode(&existingUser)
    if err == nil {
        http.Error(w, "User already exists", http.StatusBadRequest)
        return
    }

    // Hash password and store the user
    hashedPassword := hashPassword(user.Password)
    user.Password = hashedPassword

    _, err = usersCollection.InsertOne(context.TODO(), user)
    if err != nil {
        http.Error(w, "Failed to register user", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

// Login existing users
func loginHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Check if the user exists
    var foundUser User
    err := usersCollection.FindOne(context.TODO(), bson.M{"username": user.Username}).Decode(&foundUser)
    if err != nil || !compareHashAndPassword(foundUser.Password, user.Password) {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
}

// Call the Python ML API for predictions
func callMLModel(input PredictionInput) (map[string]interface{}, error) {
    // Prepare the data to be sent to the Python model server
    payload, err := json.Marshal(input)
    if err != nil {
        return nil, err
    }

    // Replace with your Flask API endpoint for prediction
    pythonModelURL := "http://localhost:5000/predict"  // Assuming your Flask app runs on port 5000

    // Send the request to Flask server
    resp, err := http.Post(pythonModelURL, "application/json", bytes.NewBuffer(payload))
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    // Read and parse the response from Flask
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    var result map[string]interface{}
    if err := json.Unmarshal(body, &result); err != nil {
        return nil, err
    }

    return result, nil
}

// Predict handler: send request to the Python ML model and return the result
func predictHandler(w http.ResponseWriter, r *http.Request) {
    var input PredictionInput
    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Call the Python ML model and get the result
    result, err := callMLModel(input)
    if err != nil {
        http.Error(w, "Failed to get prediction", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(result)
}

func main() {
    r := mux.NewRouter()

    // CORS settings
    r.Use(handlers.CORS(handlers.AllowedOrigins([]string{"*"})))

    // Register routes
    r.HandleFunc("/register", registerHandler).Methods("POST")
    r.HandleFunc("/login", loginHandler).Methods("POST")
    r.HandleFunc("/predict", predictHandler).Methods("POST")

    // Start the server
    log.Println("Server running on port 8000")
    log.Fatal(http.ListenAndServe(":8000", r))
}
