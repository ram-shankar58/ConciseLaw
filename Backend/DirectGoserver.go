//NOt to be used, just for testing as of now
//For directly running model on server instead of asking for API like the previous code did

package main

import (
    "context"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os/exec"
    "bytes"
    "io/ioutil"
    "github.com/gorilla/mux"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

// User struct to register and login
type User struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

// PredictionInput is the struct for input sent to the ML model
type PredictionInput struct {
    Text string `json:"text"`
}

var client *mongo.Client
var usersCollection *mongo.Collection

func init() {
    // MongoDB setup
    mongoURI := "your_mongo_db_connection_string"  // Replace with your MongoDB URI
    clientOptions := options.Client().ApplyURI(mongoURI)
    var err error
    client, err = mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }
    usersCollection = client.Database("myapp").Collection("users")
}

// HashPassword creates a SHA256 hash of the password
func HashPassword(password string) string {
    h := sha256.New()
    h.Write([]byte(password))
    return hex.EncodeToString(h.Sum(nil))
}

// Compare passwords by hash
func ComparePassword(hashedPwd, plainPwd string) bool {
    return hashedPwd == HashPassword(plainPwd)
}

// RegisterHandler handles user registration
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    json.NewDecoder(r.Body).Decode(&user)

    // Check if user exists
    var existingUser bson.M
    err := usersCollection.FindOne(context.TODO(), bson.M{"username": user.Username}).Decode(&existingUser)
    if err == nil {
        http.Error(w, "User already exists", http.StatusBadRequest)
        return
    }

    // Save user
    user.Password = HashPassword(user.Password)
    _, err = usersCollection.InsertOne(context.TODO(), user)
    if err != nil {
        http.Error(w, "Error registering user", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

// LoginHandler handles user login
func LoginHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    json.NewDecoder(r.Body).Decode(&user)

    var foundUser User
    err := usersCollection.FindOne(context.TODO(), bson.M{"username": user.Username}).Decode(&foundUser)
    if err != nil || !ComparePassword(foundUser.Password, user.Password) {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
}

// CallPythonMLScript calls a Python script for machine learning predictions
func CallPythonMLScript(input PredictionInput) (string, error) {
    // Prepare input for the Python script
    inputData, err := json.Marshal(input)
    if err != nil {
        return "", err
    }

    // Call the Python script (Replace with the path to your Python script)
    cmd := exec.Command("python3", "ml_model.py")
    cmd.Stdin = bytes.NewReader(inputData)

    // Get the output from the Python script
    output, err := cmd.CombinedOutput()
    if err != nil {
        return "", fmt.Errorf("Error running Python script: %v", err)
    }

    return string(output), nil
}

// PredictHandler handles the prediction requests
func PredictHandler(w http.ResponseWriter, r *http.Request) {
    var input PredictionInput
    json.NewDecoder(r.Body).Decode(&input)

    // Call the Python script for predictions
    result, err := CallPythonMLScript(input)
    if err != nil {
        http.Error(w, fmt.Sprintf("Prediction failed: %v", err), http.StatusInternalServerError)
        return
    }

    // Return the result to the client
    json.NewEncoder(w).Encode(map[string]string{"result": result})
}

func main() {
    r := mux.NewRouter()

    // User routes
    r.HandleFunc("/register", RegisterHandler).Methods("POST")
    r.HandleFunc("/login", LoginHandler).Methods("POST")

    // Prediction route
    r.HandleFunc("/predict", PredictHandler).Methods("POST")

    // Start the server
    log.Println("Server running on port 8000")
    log.Fatal(http.ListenAndServe(":8000", r))
}
