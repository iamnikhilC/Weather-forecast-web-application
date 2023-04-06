const apikey="a563c59a34b81388c702ccc75e2e1597";
// fetching user location
window.addEventListener("load",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            

            fetch(url).then((res)=>{
                return res.json();
            }).then((data)=>{
                console.log(data);
                console.log(new Date().getTime())
                var dat= new Date(data.dt)
                console.log(dat.toLocaleString(undefined,'Asia/Kolkata'))
                console.log(new Date().getMinutes())
                weatherReport(data);
            })
        })
    }
})

const WeatherIcon = document.getElementById("img");
const dateOutput = document.getElementById('date');
const timeOutput = document.getElementById('time');

//date and time
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hourIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'
  
    timeOutput.innerHTML = hourIn12HrFormat + ' : ' + minutes + '  ' + ampm
    dateOutput.innerHTML = days[day] + ', ' + date + ' - ' + months[month]
  
  }, 1000);


  function searchByCity(){
    var place= document.getElementById('input').value;
    var urlsearch= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

    fetch(urlsearch).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        weatherReport(data);
    })
    document.getElementById('input').value='';
}

function weatherReport(data){

    var urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast)

        console.log(data);
        document.getElementById('city').innerText= data.name + ', '+data.sys.country;
        console.log(data.name,data.sys.country);
    
        console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';
    
        document.getElementById('clouds').innerText= data.weather[0].description;
        console.log(data.weather[0].description)

        document.getElementById("Humidity").innerHTML = data.main.humidity + "%";
        document.getElementById("Wind").innerHTML = data.wind.speed + " km/h";
        document.getElementById("Feels").innerHTML = data.main.feels_like;
        document.getElementById("air").innerHTML = data.main.pressure;
        
        if(data.weather[0].main == 'Clouds'){
            WeatherIcon.src = "icons/clouds.png";
        }
        else if(data.weather[0].main == 'Clear'){
            WeatherIcon.src = "icons/clear.png";
        }
        else if(data.weather[0].main == 'Rain'){
            WeatherIcon.src = "icons/rain.png";
        }
        else if(data.weather[0].main == 'Drizzle'){
            WeatherIcon.src = "icons/drizzle.png";
        }
        else if(data.weather[0].main == 'Mist'){
            WeatherIcon.src = "icons/mist.png";
        }
        else if(data.weather[0].main == 'Haze'){
            WeatherIcon.src = "icons/haze.png";
        }
    })

}

function hourForecast(forecast){
    document.querySelector('.templist').innerHTML=''
    for (let i = 0; i < 5; i++) {

        var date= new Date(forecast.list[i].dt*1000)
        console.log((date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00',''))

        let hourR=document.createElement('div');
        hourR.setAttribute('class','next');

        let div= document.createElement('div');
        let time= document.createElement('p');
        time.setAttribute('class','time')
        time.innerText= (date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00','');

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';

        div.appendChild(time)
        div.appendChild(temp)

        let desc= document.createElement('p');
        desc.setAttribute('class','desc')
        desc.innerText= forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc)
        document.querySelector('.templist').appendChild(hourR);
}
}

function dayForecast(forecast){
    document.querySelector('.weekF').innerHTML=''
    for (let i = 8; i < forecast.list.length; i+=8) {
        console.log(forecast.list[i]);
        let div= document.createElement('div');
        div.setAttribute('class','dayF');
        
        let day= document.createElement('p');
        day.setAttribute('class','date')
        day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'Asia/Kolkata');
        div.appendChild(day);

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        div.appendChild(temp)

        let description= document.createElement('p');
        description.setAttribute('class','desc')
        description.innerText= forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div)
    }
} 