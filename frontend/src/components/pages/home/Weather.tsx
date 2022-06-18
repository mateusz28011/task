import React from 'react';
import { weatherApi } from '../../../app/split/weather';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import {
  selectChoosedDay,
  selectLastGetWeatherQueryPayload,
  setChoosedDay,
  setChoosedHour,
} from '../../../app/slices/WeatherSlice';
import { Box } from '@chakra-ui/react';
import WeatherDays from './WeatherDays';
import WeatherHours from './WeatherHours';
import WeatherHourInfo from './WeatherHourInfo';
import WeatherSaveCity from './WeatherSaveCity';

const Weather = () => {
  const choosedDay = useAppSelector(selectChoosedDay);
  const dispatch = useAppDispatch();
  const lastGetWeatherQueryPayload = useAppSelector(
    selectLastGetWeatherQueryPayload
  );
  const result = weatherApi.endpoints.getWeather.useQueryState(
    lastGetWeatherQueryPayload ? lastGetWeatherQueryPayload : { q: '' }
  );

  useEffect(() => {
    if (!choosedDay && result.data?.weatherDays) {
      const currentDate = new Date();
      const currentDay = result.data?.weatherDays.find(
        (day) =>
          new Date(day.date).toDateString() === currentDate.toDateString()
      );
      currentDay && dispatch(setChoosedDay(currentDay));
      if (currentDay) {
        const currentHour = currentDay.weatherHours.find(
          (hour) => hour.hourNumber === currentDate.getHours()
        );
        currentHour && dispatch(setChoosedHour(currentHour));
      }
    }
  }, [result, choosedDay, dispatch]);

  return result.data ? (
    <Box maxW='fit-content' mx='auto'>
      <WeatherHourInfo location={result.data.name} />
      <WeatherSaveCity cityId={result.data.id} />
      <WeatherHours />
      <WeatherDays data={result.data} />
    </Box>
  ) : null;
};

export default Weather;
