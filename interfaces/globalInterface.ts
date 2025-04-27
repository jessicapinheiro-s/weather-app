export interface propsCity {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}
export interface Sys {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
}
export interface Clouds {
    all: number;
}
export interface Wind {
    speed: number;
    deg: number;
}
export interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
}
export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}
export interface Coord {
    lon: number;
    lat: number;
}

export interface GeolocationPosition {
    latitude: number;
    longitude: number;
}


export interface WeatherHoursProps 
{
    cod: string,
    message: number,
    cnt: number,
    list: ListWeatherhours[],
    city: {
        id: number,
        name: string,
        coord: {
            lat: number,
            lon: number
        },
        country: string,
        population: number,
        timezone: number,
        sunrise: number,
        sunset: number
    }
}
interface ListWeatherhours {
    dt: number,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        sea_level: number,
        grnd_level: number,
        humidity: number,
        temp_kf: number
    },
    weather: [
        {
            id: number,
            main: string,
            description: string,
            icon: string
        }
    ],
    clouds: {
        all: number
    },
    wind: {
        speed: number,
        deg: number,
        gust: number
    },
    visibility: number,
    pop: number,
    rain: {
        "3h": number
    },
    sys: {
        pod: string
    },
    dt_txt: string
}