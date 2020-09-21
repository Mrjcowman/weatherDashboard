const apiKey = "77e74a091d5990f837c233f900382ee3";

$(document).foundation();


// Adjust the height of the main element to fill a screen when wider than small
const smallScreenMedia = window.matchMedia("(min-width: 39.9375em)");
let headerHeight = $("header").outerHeight();
let bodyHeight = $("body").height();

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

    let input = $(event.target).parent().parent().find("input");

    let searchQuery = input.val();
    searchQuery = searchQuery.trim();

    if(searchQuery){
        getWeatherFor(searchQuery);
    } else {
        console.log("No input in search query");
    }
    input.val("");
}

$("form button").on("click", onSearch);

// TODO: Get information from API
const getWeatherFor = (city)=>{
    let queryURL = `api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

}

// TODO: Populate fields on current weather conditions

// TODO: Populate cards for week's forecast

// TODO: Poll API periodically for updates

// TODO: Handle previous search array