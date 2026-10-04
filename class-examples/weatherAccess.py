import requests
city = "Toronto"

api_key = "2ba267fc5ab5b4c99201b8efab509d99" 

url_with_city ="http://api.openweathermap.org/data/2.5/weather?q=" +city 

url_to_send = url_with_city + "&APPID=" + api_key 

respose = requests.get(url_to_send)

data = respose.json()

print(data)