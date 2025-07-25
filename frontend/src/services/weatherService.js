const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export const getCurrentWeather = async () => {
    try {
        const lat = 21.0285;
        const lon = 105.8542;

        const response = await fetch(
            `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Asia/Bangkok`
        );
        const data = await response.json();

        const getWeatherDescription = (code) => {
            if (code <= 3) return "Quang mây";
            if (code <= 48) return "Có sương mù";
            if (code <= 67) return "Có mưa";
            if (code <= 77) return "Có tuyết";
            if (code <= 82) return "Mưa rào";
            if (code <= 99) return "Có bão";
            return "Thời tiết tốt";
        };

        return {
            temperature: Math.round(data.current_weather.temperature),
            description: getWeatherDescription(data.current_weather.weathercode),
            weatherCode: data.current_weather.weathercode
        };
    } catch (error) {
        return {
            temperature: 28,
            description: "Quang mây",
            weatherCode: 2
        };
    }
};

