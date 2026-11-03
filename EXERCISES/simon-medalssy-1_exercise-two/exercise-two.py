from flask import Flask,render_template,request,redirect,url_for
import requests
app = Flask(__name__)


# the default route
@app.route("/")
def index():
      return render_template("index.html")

#*************************************************
#Task-1: GET REQUEST
@app.route("/t1")
def t1():
    return render_template("t1.html",have_results=False)
#*************************************************
@app.route("/getSearchCriteria")
def getSearchCriteria():
    keyword = request.args.get("keyword")
    url = f"https://images-api.nasa.gov/search?q={keyword}&media_type=image"
    response = requests.get(url)
    data = response.json()
    items = data["collection"]["items"]
    first_item = items[0]

    imgFromNasa = first_item["links"][0]["href"]
    description = first_item["data"][0]["description"]
    #fill me in :
    #replace the empty space to be url encoded
    imgFromNasa = imgFromNasa.replace(' ', '%20')
    return render_template("t1.html",
                               have_results = True,
                               description=description,
                               imgPath = imgFromNasa
                                           
                            )

#*************************************************
# #Task-2: GET REQUEST
@app.route("/t2")
def t2():
    return render_template("t2.html")
#*************************************************
@app.route("/getSearchCriteria_adv")
def getSearchCriteria_adv():
    #fill me in:
    keyword = request.args.get("keyword")
    url = f"https://images-api.nasa.gov/search?q={keyword}&media_type=image"
    response = requests.get(url)
    data = response.json()

    items = data["collection"]["items"]

    encodedImageLinks = []

    for item in items:
        singleImage = item["links"][0]["href"]
        singleImage = singleImage.replace(' ', '%20')
        encodedImageLinks.append(singleImage)

    return render_template("t2.html", images=encodedImageLinks)
#*************************************************

#run
app.run(debug=True)