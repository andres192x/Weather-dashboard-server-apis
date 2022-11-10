


const API_KEY = '9de243494c0b295cca9337e1e96b00e2';

// set and save local storage string format
function saveData(key, data) {
    const _newData = JSON.stringify(data);
    localStorage.setItem(key, _newData);
}

// get data from local storage in json format
function getData(key) { 
    const storage = localStorage.getItem(key);
    if(storage == null) return null;
    return JSON.parse(storage);
}

// load data from local storage depending on name of city
function loadDataByCity(cityname) {
    const data = getData(`city:${cityname}`);
    renderPrimaryCard(data)

    const listData = getData(`fore:${cityname}`);
    rendarForecast(listData)
}

 // render primary card
 function renderPrimaryCard(data) {
    const container = document.getElementById('card-primary');
    const image = `<img src="http://openweathermap.org/img/wn/${data.icon}@2x.png"/>`;
    container.querySelector('.icon').innerHTML = image;
    container.querySelector('.name').textContent = data.name;
    container.querySelector('.dt').textContent = data.dt;
    container.querySelector('.temp').textContent = data.temp;
    container.querySelector('.wind').textContent = data.wind;
    container.querySelector('.humi').textContent = data.humi;
}

// render forecast
function rendarForecast(listData) {
    const container = document.getElementById('container-forecast');
    container.innerHTML = '';

    for (const item of listData) {
        const templateHtml = `
            <div class="col">
                <div class="card text-bg-secondary">
                    <div class="card-body">
                        <h5>${item.dt}</h5>
                        <img src="http://openweathermap.org/img/wn/${item.icon}@2x.png">
                        <p><strong>Temp:</strong> ${item.temp}°F</p>
                        <p><strong>Wind:</strong> ${item.wind} MPH</p>
                        <p><strong>Humidity:</strong> ${item.humi}%</p>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', templateHtml);

    }

    
}

// consult weather data depending which city is input
function getDataWeatherByCityname(cityname) {
    return new Promise((resolve) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&units=Imperial`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const timestamp = parseInt(`${data.dt}000`)
                const _date = new Date(timestamp);

                const response = {
                    icon: data.weather[0].icon,
                    name: data.name,
                    temp: data.main.temp,
                    wind: data.wind.speed,
                    humi: data.main.humidity,
                    dt: _date.toLocaleDateString(),
                    lat: data.coord.lat,
                    lon: data.coord.lon
                }
                resolve(response);
            })
    })
}

// consult weather forecast given a lat and lon input
function getDailyForecastWeatherByLanLog(lat, lon) {
    return new Promise((resolve) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=6&appid=${API_KEY}&units=Imperial`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                let list = data.list;
                list.splice(0,1); // delete first element of list

                const responses = [];
                for (const item of list) {
                    const timestamp = parseInt(`${item.dt}000`)
                    const _date = new Date(timestamp);
                    responses.push({
                        icon: item.weather[0].icon,
                        dt: _date.toLocaleDateString(),
                        temp: item.temp.day,
                        wind: item.speed,
                        humi: item.humidity
                    })
                }
                resolve(responses);
            })
    })
}

// load list of buttons for cities in local storage
function LoadCityNames() {
    const cities = getData('list_city') || [];
    const container = document.getElementById('list-cities');
    container.innerHTML = '';
    for (const cityname of cities) {
        const templateHtml = `
            <button class="btn btn-secondary" type="button" onClick="loadDataByCity('${cityname}')">
                ${cityname}
            </button>
        `;
        container.insertAdjacentHTML('beforeend', templateHtml);
    }

}

// event action when search button is clicked
function handlerSearch() {

    const input = document.getElementById('input-search');
    const cityName = input.value;

    if(cityName == '') {
        alert('Please type a city name');
        return;
    }

    getDataWeatherByCityname(cityName).then(data => {

        let oldCity = getData('list_city') || [];
        if(!oldCity.includes(cityName)) {
            oldCity.push(cityName);
            saveData('list_city', oldCity);
        }

        getDailyForecastWeatherByLanLog(data.lat, data.lon).then(listData => {
            rendarForecast(listData);
            saveData(`fore:${cityName}`, listData);
        })

        renderPrimaryCard(data);
        saveData(`city:${cityName}`, data);

        LoadCityNames();
    })
}

const buton = document.getElementById('search'); // select button
buton.addEventListener('click', handlerSearch); // add click event

LoadCityNames();








// var APIKey = "5035e1ecc2553112f7de98101176392f"
// var cityName = document.getElementById('cityName');

// function displayHistory() {
//     var history = JSON.parse(localStorage.getItem("cities")) || []
//     // document.getElementById("history").innerHTML = ""
//     for (var i = 0; i < history.length; i++) {
//         var item = document.createElement("button")
//         item.addEventListener("click",searchWeather)
//         item.innerText = history[i]
//         document.getElementById("history").appendChild(item)
//     }
// }

// displayHistory();



// function searchWeather(event) {

//     var cityName =event.target.innerText|| document.getElementById('cityName').value;

//     var history = JSON.parse(localStorage.getItem("cities")) || []  //attempt to retrieve or empty array 
//     history.push(cityName)
//     localStorage.setItem("cities", JSON.stringify(history))

//     // displayHistory();
    

//     fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=5035e1ecc2553112f7de98101176392f&units=imperial')
//         .then(response => response.json())
//         .then(json => {
//             console.log(json)
//             var container = document.getElementById("weather")
//             // container.innerHTML=""
//             var city = document.createElement("h2")
//             city.innerText = cityName
//             container.appendChild(city)

//             var date = document.createElement("p")
//             date.innerText = moment(json.dt).format("MMM Do YY")
//             container.appendChild(date)

//             var icon = document.createElement("img")
//             icon.src = "http://openweathermap.org/img/wn/" + json.weather[0].icon + "@2x.png"
//             container.appendChild(icon)

//             var temp = document.createElement("p")
//             temp.innerText = "temperature: " + json.main.temp + "°C"
//             container.appendChild(temp)

//             var wind = document.createElement("p")
//             wind.innerText = "wind: " + json.wind.speed
//             container.appendChild(wind)

//             var humidity = document.createElement("p")
//             humidity.innerText = "humidity: " + json.main.humidity
//             container.appendChild(humidity)

//         })
// }

// document.getElementById("btn").addEventListener("click", searchWeather);


