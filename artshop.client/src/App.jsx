import { useEffect, useState } from 'react';
import './App.css';

function App() {
    // Define a state (https://react.dev/learn/state-a-components-memory), which is a value that persists between component re-renders. For this case, 
    // `forecasts` is the persistent value, and `setForecasts` is the setter function for that value. Whenever `forecasts` is rendered, it pulls the value from
    // the state (effectively a global variable). Whenever `setForecasts` is called, all instances of `forecasts` are automatically updated to the new value.
    const [forecasts, setForecasts] = useState();

    // Define an effect (https://react.dev/reference/react/useEffect), which is a connection between an external system (the backend in this case) and the component.
    // An effect has three parts: A setup function, a cleanup function, and dependencies.
    // The purpose of an effect is to keep a connection to another resource alive depending on changing values from this component.
    // The setup function open a connection to the external resource, and the cleanup function closes that connection after it's used.
    // If any of the dependency values change, the connection is closed and reopened with the new, updated values.
    // Here, the setup and cleanup functions are defined in populateWeatherData().
    // The list of dependencies is at the end. In this case it's empty.
    useEffect(() => {
        populateWeatherData();
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <p><a href='weatherforecast'>Demo Link</a></p>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
    
    // The function for the effect earlier in this file.
    // This defines the setup function, which fetches data from `weatherforecast`, converts it to JSON, then runs the setForecasts state setter on it.
    // The cleanup function is normally defined as a callback function. Since this function doesn't return any callback, there is no cleanup function.
    async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        setForecasts(data);
    }
}

export default App;