// Setup empty JS object (array) to act as endpoint for all routes
projectData = [];

//store required packages to run server and routes inside object requierdPack
const requiredPack ={
    express    :require('express'),
    bodyParser :require('body-parser'),
    cors       :require('cors')
}

// Start up an instance of app
const app = requiredPack.express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(requiredPack.bodyParser.urlencoded({ extended: false }));
app.use(requiredPack.bodyParser.json());

// Cors for cross origin allowance

app.use(requiredPack.cors());
// Initialize the main project folder
app.use(requiredPack.express.static('website'));


// Setup Server
const port = 4007;
const localhost = 'http://127.0.0.1';
const server = app.listen(port, serverRun);
function serverRun() {
    
    console.log(`Server is running at ${localhost}:${port}`);
}
// add the get route request to response to send the (updated ) projectData object to the client side
app.get('/allUpdateData', getAll)
function getAll(req, res) {
    res.send(projectData);
    
   
}

//ad the post route request to recieve incoming data from req.body (client side  )and store it in projectData object
app.post('/allWeatherData', postAll)
function postAll(req, res) {
    console.log(req.body)
    let newData = {
        city: req.body.city,
        date: req.body.date,
        temp: req.body.temp,
        icon: req.body.icon,
        userfeelings: req.body.userfeelings,
        weather: req.body.weather
    }
    projectData.splice(0,0,newData);
}