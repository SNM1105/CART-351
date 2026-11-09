
from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime, timezone
from threading import Lock

app = Flask(__name__)

DATA_FILE = os.path.join(app.root_path, "data.json")
data_lock = Lock()

@app.route("/")
def index():
    return render_template("index.html")


# Receive answers from JavaScript
@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON data"}), 400

    answers = data.get("answers")

    if (
        not isinstance(answers, list)
        or len(answers) != 5
        or not all(
            isinstance(item, dict)
            and isinstance(item.get("question"), str)
            and isinstance(item.get("answer"), str)
            for item in answers
        )
    ):
        return jsonify({"error": "Invalid answers"}), 400

    submission = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "answers": answers
    }

    with data_lock:
        # Load existing submissions
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r", encoding="utf-8") as file:
                submissions = json.load(file)
        else:
            submissions = []

        # Add the new submission
        submissions.append(submission)

        # Save all submissions to the JSON file
        with open(DATA_FILE, "w", encoding="utf-8") as file:
            json.dump(submissions, file, indent=4)

    return jsonify({
        "message": "Answers saved successfully!",
        "total_submissions": len(submissions)
    }), 201



@app.route("/data", methods=["GET"])
def get_data():
    with data_lock:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r", encoding="utf-8") as file:
                submissions = json.load(file)
        else:
            submissions = []

    return jsonify(submissions)


if __name__ == "__main__":
    app.run(debug=True)
