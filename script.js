const apiKey = "77e74a091d5990f837c233f900382ee3";

$(document).foundation();


// Adjust the height of the main element to fill a screen when wider than small
const smallScreenMedia = window.matchMedia("(min-width: 39.9375em)");
let headerHeight = $("header").outerHeight();
let bodyHeight = $("body").height();

let currentCity = "";

const updateMainHeight = ()=>{
    if(smallScreenMedia.matches){
        $("main").height(bodyHeight-headerHeight);
    } else {
        $("main").height("auto");
    }
}

updateMainHeight();
smallScreenMedia.addEventListener("change", updateMainHeight);

// Process Search Query
const onSearch = (event)=>{
    event.preventDefault();

    let cityInput = $("#citySearch");
    let stateInput = $("#stateSearch");

    let searchQuery = cityInput.val().trim();
    
    if(searchQuery){
        if(stateInput.val().trim()) searchQuery += "," + stateInput.val().trim().toUpperCase();
        getWeatherFor(searchQuery);
    } else {
        console.log("No input in city search query");
    }
    cityInput.val("");
    stateInput.val("");
}

$("form button").on("click", onSearch);

// Get information from API
const getWeatherFor = (city)=>{
    city = city.replace(", ", ",");

    if(/.*,[A-Z][A-Z]/.test(city)&&!/usa/.test(city))
        city+=",usa";

    let queryURLToday = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    let queryURLWeek = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(queryURLToday).then(response => {
        return response.json();
    }).then(data => {
        processWeather(data);

        currentCity=city;

        addPreviousSearch(city, data.name);
        getPreviousSearches();


        fetch(queryURLWeek).then(response=>{
            return response.json();
        }).then(data => {
            processForecast(data);
        })
    })

    $.ajax({
        method: "GET",
        url: queryURLToday
    }, response=>{
        console.log(response);
    })
}

const kelToFar = (tempK) => {
    return ((tempK - 273.15) * 9/5 + 32).toFixed(1);
}

const getIcon = (iconCode) =>{
    return `http://openweathermap.org/img/wn/${iconCode}.png`
}

// Populate fields on current weather conditions
const processWeather = (data) =>{
    const townName = data.name;
    const weatherIcon = getIcon(data.weather[0].icon);
    const tempInF = kelToFar(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    let mainInfo = $(".currentWeather");

    mainInfo.empty().append(
        $("<h2>").text(townName).append(
            $("<img>").attr("src",weatherIcon)));
    mainInfo.append($("<p>").text(`Temperature: ${tempInF}\u00B0F`))
    mainInfo.append($("<p>").text(`Humidity: ${humidity}%`))
    mainInfo.append($("<p>").text(`Wind Speed: ${windSpeed} MPH`))
    mainInfo.append($("<p>").html(`UV Index: <span class="label success">9.49</span>`))
    
}


// TODO: Populate cards for week's forecast
const processForecast = (data) =>{
    let day = [];
    day.push(pullInfoFromForecast( 5, data));
    day.push(pullInfoFromForecast(13, data));
    day.push(pullInfoFromForecast(21, data));
    day.push(pullInfoFromForecast(29, data));
    day.push(pullInfoFromForecast(37, data));

    let forecastDiv = $(".forecast-deck");
    forecastDiv.empty();

    day.forEach(forecastData=>{
        forecastDiv.append(
            $("<div>").addClass("cell card small-12 medium-auto").append(
                $("<h4>").addClass("card-divider").text(forecastData.date)
            ).append(
                $("<div>").addClass("card-section").append(
                    $("<img>").attr("src", forecastData.icon)
                ).append(
                    $("<p>").text(`Temp: ${forecastData.temp}\u00B0F`)
                ).append(
                    $("<p>").text(`Humidity: ${forecastData.humidity}%`)
                )
            )
        )
    })

}

const pullInfoFromForecast = (index, data) =>{
    return {
        date: data.list[index].dt_txt,
        temp: kelToFar(data.list[index].main.temp),
        humidity: data.list[index].main.humidity,
        icon: getIcon(data.list[index].weather[0].icon)
    }
}


// TODO: Poll API periodically for updates


// Handle previous search array
const getPreviousSearches = () => {
    let previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];

    let historyList = $(".history-list")
    historyList.empty();

    previousSearches.forEach(searchData=>{
        historyList.append(
            $("<li>").addClass("list-group-item"+(searchData.dataCity==currentCity?" active":""))
                     .attr("data-city", searchData.dataCity)
                     .text(searchData.cityText)
                     .on("click", event=>handleHistoryClick(event))
        )
    })
}

const addPreviousSearch = (dataCity, cityText) => {
    let previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];

    previousSearches = previousSearches.filter(searchObject=>{
        return searchObject.dataCity != dataCity;
    })

    console.log()

    previousSearches.unshift(
        {dataCity, cityText}
    );

    previousSearches = previousSearches.slice(0,10);

    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
}

const handleHistoryClick=(event)=>{
    getWeatherFor($(event.target).attr("data-city"))
}

getPreviousSearches();