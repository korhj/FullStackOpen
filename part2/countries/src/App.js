import { useState, useEffect } from 'react'
import axios from 'axios'

const BasicData = ({country}) => {
  console.log("BasicData");
  console.log(country);

  const [weatherData, setWeatherData] = useState(null);


  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
        );
        console.log("GetWeather", response.data);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherData(null);
      }
    }
    fetchData()
  }, [country]);
  

  return(
    <div>
      <h1>{country.name.common}</h1>

      <p>
        capital {country.capital} <br/>
        area {country.area}
      </p>

      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />

      <h2>Weather in {country.capital}</h2>
      {weatherData ? (
        <p>
          temperature {weatherData.main.temp} Celcius <br />
          <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].description} /><br />
          wind {weatherData.wind.speed} m/s      
        </p>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  )
}

const Country = ({country, toggleShowBasicData}) =>{
  if(country.showData){
    return (
      <li>
          <BasicData country={country} /> 
          <button onClick={toggleShowBasicData} >hide</button>
      </li>
    )
  }
  return(
    <li>
      {country.name.common} <button onClick={toggleShowBasicData} >show</button>
    </li>
  ) 
}

const Countries = ({countries, searchParams, toggleShowBasicData}) => {

  const nameFilter = (country) => {
    return country.name.common.toLowerCase().includes(searchParams.toLowerCase()) || country.name.official.toLowerCase().includes(searchParams.toLowerCase())
  } 

  const filteredCountries = countries.filter(nameFilter)


  if(filteredCountries.length === 1) {
    return <BasicData country={filteredCountries[0]} />
  }

  if(filteredCountries.length >= 10) {
    return ( <div>Too many matches, specify another filter</div>)
  }
  return(
  <ul>
    {filteredCountries.map(country => <Country key={country.name.common} country={country} toggleShowBasicData={() => toggleShowBasicData(country)} />)}
  </ul>
  )
}

const Filter = ({searchParams, handleChange}) => (
    <div>find countries <input value={searchParams} onChange={handleChange} /></div>
)

const App = () => {
  const [countries, setCountries] = useState(null)
  const [searchParams, setSearchParams] = useState('')


  useEffect(() => {
    const fetchData = async() => {
      const response = await axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      console.log("fetchData");
      setCountries(response.data.map(country => ({...country, showData: false })))
    }
    fetchData()
  }, [])

  if(!countries) {
    return null
  }

  const handleChange = (event) => {
    setSearchParams(event.target.value)
  }

  const toggleShowBasicDataOf = (countryName) => {
    setCountries(countries.map(country => country === countryName ? {...country, showData: !country.showData} : country))
  }


  return(
    <div>
      <Filter searchParams={searchParams} handleChange={handleChange}/> 
      <Countries countries={countries} searchParams={searchParams}  toggleShowBasicData={toggleShowBasicDataOf} />
    </div>
  )
}

export default App;
