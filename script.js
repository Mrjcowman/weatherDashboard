const apiKey = "77e74a091d5990f837c233f900382ee3";

$(document).foundation();

const smallScreenMedia = window.matchMedia("(min-width: 39.9375em)");
let headerHeight = $("header").outerHeight();
let bodyHeight = $("body").height();

const updateSidebarHeight = ()=>{
    if(smallScreenMedia.matches){
        $("main").height(bodyHeight-headerHeight);
    } else {
        $("main").height("auto");
    }
}

updateSidebarHeight();
smallScreenMedia.addEventListener("change", updateSidebarHeight);