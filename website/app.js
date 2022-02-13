
// listen to DOMContntLoaded to sure the DOM is full loaded
document.addEventListener('DOMContentLoaded', weatherApp);
function weatherApp() {

    // store important variable inside function varibles
    const varObj = {
        // define project URL(to the front-end developer to test)
        projectURL: 'http://127.0.0.1:4007',
        //define my personal APIkey for OpenWeatherMap.com
        apiKey    : '&appid=20f86fe6296fa84fb3c6e00349c54653&units=metric',
        //define the zipcode url and the city name url to fetch 
        zipURL: 'http://api.openweathermap.org/data/2.5/weather?zip=',
        cityURL: 'http://api.openweathermap.org/data/2.5/weather?q='
    }

    // define useful global varibles 
    // Create a new date instance dynamically with JS
    let d = new Date();
    let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();
    let zip = document.getElementById('zip');
    let cityIN = document.getElementById('cityname');
    let feeling = document.getElementById('feelings');
    let generate = document.getElementById('generate');
    let empty = document.getElementById('empty');
    let alert = document.getElementById('alert');
    let exit = document.getElementById('exit');

    // define global varible for updateUI function
    const cityUpdate = document.querySelector('#city');
    const dateUpdate = document.querySelector('#date');
    const tempUpdate = document.querySelector('#temp');
    const iconUpdate = document.querySelector('#icon');
    const weatherUpdate = document.querySelector('#weather');
    const feelingsUpdate = document.querySelector('#content');

    // In my project there are two way to reach the weather data to users ( there can search for weather Data By zip code or city name )
    // listen to click event when click in generate button to make action (appear the information of weather which user needed)
    generate.addEventListener('click', generateWeather)
    function generateWeather(e) {
        // to prevent the default action from ocurring
        e.preventDefault();
        //Define the values for inputs 
        const newzip = zip.value;
        const feelings = feeling.value;
        const newcity = cityIN.value;
        // start condition for inputs to generate weather data for user 
        // first condition when the user input only the zipcode or input the zipcode with city name together
        if (((newzip && !newcity) || (newzip && newcity))) {
            //this is the get request which fetch the weather data from zipURL to search by zipcode chaining with promesies (weather data function and updateUIWeather async function
            getWeather(varObj.zipURL, newzip, varObj.apiKey).then(function (weatherdata) {
                // if zipcode error or the zipcode and city name don't match the app return error(alert)
                if (weatherdata.message === 'city not found') {
                    alert.style.display = 'block';
                    //if all thing correct the app return weather Data
                } else {
                    postData('/allWeatherData', {
                        city: weatherdata.name,
                        date: newDate,
                        temp: weatherdata.main.temp,
                        icon: weatherdata.weather[0].icon,
                        userfeelings: feelings,
                        weather: weatherdata.weather[0].description
                    }).then(updateUIWeather());

                }
            });
            // second condition when the user input only the city name 
        } if (!newzip && newcity) {
            //this is the get request which fetch the weather data from cityURL to search by city name chaining with weather data function
            getWeather(varObj.cityURL, newcity, varObj.apiKey).then(function (weatherdata) {
                // if city name error the app return error (alert)
                if (weatherdata.message === 'city not found') {
                    alert.style.display = 'block';
                } else {
                    //if all thing correct the app return weather Data
                    postData('/allWeatherData', {
                        city: weatherdata.name,
                        date: newDate,
                        temp: weatherdata.main.temp,
                        icon: weatherdata.weather[0].icon,
                        userfeelings: feelings,
                        weather: weatherdata.weather[0].description
                    }).then(updateUIWeather());

                }
            })
            //third condition if the user not input any of the two (zipcode and city name) app return error (alert)
        } if (!newzip && !newcity) {
            alert.style.display = 'block';
        }


    }
    //  asynchronous getWether function to fetch the weather Data from OpenWeatherMap.com with three argument url, the way which user use to reach the data and the APIkey
    const getWeather = async (mainurl, way, key) => {
        const res = await fetch(mainurl + way + key);
        try {
            //define the weather data which come frome fetch from OpenWeatherMap.com and transform it into json
            const weatherdata = await res.json();
            console.log(weatherdata)//for test 
            return weatherdata;
        } catch (error) {
            console.log('Error appear:', error);//to handle the error 
        }
    }

    // this is the postData async function to  request to '/allWeatherData' route in server
    const postData = async (url = '', weatherdata = {}) => {
        console.log(weatherdata); //to test
        // fetch the url and the post request
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            // Body data type  match to "Content-Type" header        
            body: JSON.stringify(weatherdata),
        });
        //try to define newweatherData and wait to transform it in to json
        try {
            const newweatherData = await response.json();
            console.log(newweatherData);//to test
            return newweatherData;
        } catch (error) {
            console.log("Error:", error);//to handle the error 
        }
    }
    // this async function to retrieve data from app
    const updateUIWeather = async () => {
        // wait to fetch the data from the get route in server side 
        const request = await fetch('/allUpdateData');
        // define the data which come from server side and transform it into json
        const allWeatherData = await request.json();
        //  updated values to reflect dynamically to the app
        cityUpdate.innerHTML = ` ${allWeatherData.city}`
        dateUpdate.innerHTML = ` ${allWeatherData.date}`
        tempUpdate.innerHTML = ` ${Math.round(allWeatherData.temp)}&#8451`
        iconUpdate.innerHTML = `<img src = http://openweathermap.org/img/wn/${allWeatherData.icon}@2x.png>`
        feelingsUpdate.innerHTML = `I feel: ${allWeatherData.userfeelings}`
        weatherUpdate.innerHTML = `It's ${allWeatherData.weather}`
    }
    //button for reload the page to empty the app and reuse 
    empty.addEventListener('click', emptyApp);
    function emptyApp() {
        window.location.reload();
    }

    // button for exit the alert box
    exit.addEventListener('click', closeAlert);
    function closeAlert() {
        alert.style.display = 'none';
    }
}
weatherApp();
