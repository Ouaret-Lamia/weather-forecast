const apiKey = "f39a8549e82ca5f22d9925c08eafeae0";

const cityValue = document.querySelector(".searchDiv input");
const searchBtn = document.querySelector(".searchDiv button");

async function getAPI(city) {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await result.json();
    console.log(data);
}

searchBtn.addEventListener("click", () =>{
    getAPI(cityValue.value);
})