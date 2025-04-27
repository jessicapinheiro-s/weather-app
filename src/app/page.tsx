"use client"

import { useState, useEffect } from "react";
import React from "react";

import { apiKeyWeather, baseUrlWeather, apiKeyGeoCoding, baseUrlGeocoding } from "../../lib/config"
import { GeolocationPosition, propsCity, WeatherHoursProps } from "../../interfaces/globalInterface";


export default function Home() {
    const [inforWeather, setInfoWeather] = useState<propsCity | null>(null);
    const [inforWeatherHours, setInforWeatherHours] = useState<WeatherHoursProps>();
    const linkRequestuInfo = `${baseUrlWeather}/weather?lat={lat}&lon={lon}&appid={SuaChaveAPI}&units=metric`;
    const linkRequestInfoDays = `${baseUrlGeocoding}forecast?lat={lat}&lon={lon}&appid={SuaChaveAPI}&units=metric&cnt={cnt}`;
    const numeroHours: number = 10;
    const [geoLocationInfo, setGeolocationInfo] = useState<GeolocationPosition>();

    const getWeatherInfo = async () => {
        if (!geoLocationInfo) return;

        try {
            const resulstWeather = await fetch(
                linkRequestuInfo.replace(
                    '{SuaChaveAPI}', (apiKeyWeather ?? '')
                ).replace(
                    '{lat}', geoLocationInfo?.latitude.toString()
                )
                    .replace(
                        '{lon}', geoLocationInfo?.longitude.toString()
                    )
            );
            if (resulstWeather.ok) {
                const infoInFormatedWeather = await resulstWeather.json();
                setInfoWeather(infoInFormatedWeather);
            }

        } catch (error) {
            throw new Error('Erro ao buscar informações do clima: ' + error);
        }
    }

    const getGeoCodingInfo = async () => {
        if (!geoLocationInfo) return;

        try {
            const resultsGeocoding = await fetch(
                linkRequestInfoDays.replace(
                    '{SuaChaveAPI}', (apiKeyGeoCoding ?? '')
                ).replace(
                    '{lat}', geoLocationInfo.latitude.toString()
                ).replace(
                    '{lon}', geoLocationInfo.longitude.toString()
                ).replace(
                    '{cnt}', numeroHours.toString()
                )
            );

            if (resultsGeocoding.ok) {
                const infoInFormatedGeocoding = await resultsGeocoding.json();
                setInforWeatherHours(infoInFormatedGeocoding);
            }

        } catch (error) {
            throw new Error('Erro ao buscar informações do clima: ' + error);
        }
    }

    const getInfoLocationUser = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                localStorage.setItem('geoLocationInfo', JSON.stringify({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setGeolocationInfo({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            });
        }
    }

    const formatDate = (date:number) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    useEffect(() => {
        getWeatherInfo();
        getGeoCodingInfo();
    }, [geoLocationInfo]);

    useEffect(() => {
        const getGeoInfoInStorage = localStorage.getItem('geoLocationInfo');
        if (getGeoInfoInStorage) {
            const geoInfo = JSON.parse(getGeoInfoInStorage);
            setGeolocationInfo(geoInfo);
        } else {
            getInfoLocationUser();
        }
    }, []);
    
    return (
        <React.Fragment>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-200 py-10 px-4   ">
                {inforWeather && (
                    <div className="w-full max-w-3xl bg-white/30 backdrop-blur-md shadow-xl p-6 sm:p-8 rounded-2xl border border-blue-100">

                        {/* Title */}
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Current Weather</h1>
                        </div>

                        {/* Location + Date */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-blue-200 pb-4 mb-6 text-[#005fb5] text-base sm:text-lg gap-2 flex-wrap">
                            <p>{inforWeatherHours?.city.name} - {inforWeatherHours?.city.country}</p>
                            <p>
                                {
                                    formatDate(new Date().getTime())
                                }
                            </p>
                        </div>

                        {/* Main temperature */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-100 rounded-xl p-6 bg-white/60 mb-6">
                            <div className="flex items-center gap-4 flex-wrap-reverse">
                                <img
                                    src={`https://openweathermap.org/img/wn/${inforWeather?.weather?.[0]?.icon}@2x.png`}
                                    alt="weather-icon"
                                    className="w-18 h-18 sm:w-16 sm:h-16"
                                />
                                <div className="">
                                    <p className="text-3xl sm:text-4xl font-bold text-blue-900">{Math.round(inforWeather?.main?.temp)}°C</p>
                                    <p className="capitalize text-blue-700">{inforWeather?.weather?.[0].description}</p>
                                </div>
                            </div>
                            <div className="w-full flex justify-between gap-8 text-[#005fb5] mt-4 sm:mt-0">
                                <div>
                                    <p className="text-sm">Min</p>
                                    <p className="font-semibold">{Math.round(inforWeather?.main?.temp_min)}°C</p>
                                </div>
                                <div>
                                    <p className="text-sm">Max</p>
                                    <p className="font-semibold">{Math.round(inforWeather?.main?.temp_max)}°C</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional info */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                            <div className="flex justify-between p-4 bg-white/60 rounded-xl text-[#005fb5] flex-wrap ">
                                <p>Feels like</p>
                                <p className="font-bold">{Math.round(inforWeather?.main?.feels_like)}°C</p>
                            </div>
                            <div className="flex justify-between p-4 bg-white/60 rounded-xl text-[#005fb5] flex-wrap ">
                                <p>Humidity</p>
                                <p className="font-bold">{inforWeather?.main?.humidity}%</p>
                            </div>
                            <div className="flex justify-between p-4 bg-white/60 rounded-xl text-[#005fb5] flex-wrap ">
                                <p>Pressure</p>
                                <p className="font-bold">{inforWeather?.main?.pressure} hPa</p>
                            </div>
                            <div className="flex justify-between p-4 bg-white/60 rounded-xl text-[#005fb5] flex-wrap ">
                                <p>Ground level</p>
                                <p className="font-bold">{inforWeather?.main?.grnd_level} hPa</p>
                            </div>
                            <div className="flex justify-between p-4 bg-white/60 rounded-xl text-[#005fb5] flex-wrap ">
                                <p>Sea level</p>
                                <p className="font-bold">{inforWeather?.main?.sea_level} hPa</p>
                            </div>
                        </div>

                        {/* Forecast */}
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4">Next hours</h2>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                {inforWeatherHours &&
                                    inforWeatherHours.list.slice(0, 8).map((item, index: number) => (
                                        <div key={index} className="w-[45%] sm:w-[110px] p-3 rounded-xl bg-white/70 text-center text-[#005fb5] shadow-sm">
                                            <p className="text-sm font-semibold">
                                                {new Date(item.dt_txt).toLocaleTimeString('en-GB', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <img
                                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                                alt="weather-icon"
                                                className="mx-auto w-14 h-14"
                                            />
                                            <p className="text-lg font-bold">{Math.round(item.main.temp)}°C</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    )
}
