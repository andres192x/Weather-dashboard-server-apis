
var APIKey = "5035e1ecc2553112f7de98101176392f"
var cityName = document.getElementById('cityName');

function displayHistory() {
    var history = JSON.parse(localStorage.getItem("cities")) || []
    // document.getElementById("history").innerHTML = ""
    for (var i = 0; i < history.length; i++) {
        var item = document.createElement("button")
        item.addEventListener("click",searchWeather)
        item.innerText = history[i]
        document.getElementById("history").appendChild(item)
    }
}

displayHistory();
function searchWeather(event) {

    var cityName =event.target.innerText|| document.getElementById('cityName').value;

    var history = JSON.parse(localStorage.getItem("cities")) || []
    history.push(cityName)
    localStorage.setItem("cities", JSON.stringify(history))

    displayHistory();
    

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=5035e1ecc2553112f7de98101176392f&units=imperial')
        .then(response => response.json())
        .then(json => {
            console.log(json)
            var container = document.getElementById("weather")
            // container.innerHTML=""
            var city = document.createElement("h2")
            city.innerText = cityName
            container.appendChild(city)

            var date = document.createElement("p")
            date.innerText = moment(json.dt).format("MMM Do YY")
            container.appendChild(date)

            var icon = document.createElement("img")
            icon.src = "http://openweathermap.org/img/wn/" + json.weather[0].icon + "@2x.png"
            container.appendChild(icon)

            var temp = document.createElement("p")
            temp.innerText = "temperature: " + json.main.temp + "°C"
            container.appendChild(temp)

            var wind = document.createElement("p")
            wind.innerText = "wind: " + json.wind.speed
            container.appendChild(wind)

            var humidity = document.createElement("p")
            humidity.innerText = "humidity: " + json.main.humidity
            container.appendChild(humidity)

        })
}

document.getElementById("btn").addEventListener("click", searchWeather)