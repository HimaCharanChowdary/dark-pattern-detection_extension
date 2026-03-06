from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

# Load model and vectorizer
model = joblib.load("classical_model/best_model.pkl")
vectorizer = joblib.load("classical_model/vectorizer.pkl")

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    
    if text == "":
        return jsonify({"error": "No text provided"}), 400

    # Transform text
    X_vec = vectorizer.transform([text])
    prediction = model.predict(X_vec)[0]

    # For simplicity, category explanation placeholder
    category = "Dark Pattern" if prediction == 1 else "Not Dark Pattern"

    return jsonify({"prediction": int(prediction), "category": category})

if __name__ == "__main__":
    app.run(debug=True)
