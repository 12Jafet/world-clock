import { useEffect, useState } from 'react';
import './App.css';

import SearchInput from './components/search/SearchInput';
import TimeZoneList from './components/timeBar/TimeZoneList';
import MainTimeZoneContext from './context/MainTimeZoneContext';
import useApi from './hooks/useApi';


function App() {
    const [options, setOptions] = useState();
    const [timeZoneList, setTimeZoneList] = useState([]);
    const [dateTime, setDateTime] = useState();

    const { handleRequest } = useApi({
        url: 'timezone'
    });

    useEffect(() => {
        getTimeZoneOptions();
    }, []);

    const getTimeZoneOptions = async () => {
        const response = await (handleRequest());
        const timeZoneOptions = response.map(timeZone => {
            return {
                city: timeZone.replaceAll('/', ', ').replaceAll('_', ' '),
                url: timeZone
            };
        })
        setOptions(timeZoneOptions);
    }

    const addTimeZone = value => {
        if (!value) {
            return;
        }
        let isMain = !timeZoneList.length ? true : false;
        setTimeZoneList([...timeZoneList, { url: value.url, isMain }])
    }

    const deleteTimeZone = id => {
        const updatedTimeZoneList = timeZoneList.filter((timeZone, index) => index != id);
        setTimeZoneList(updatedTimeZoneList);
    }

    return (
        <MainTimeZoneContext.Provider value={{ dateTime, setDateTime }}>
            <div>
                <div className='title-app'>
                    <h1 >WolrdtimeLite</h1>
                </div>
                <div className='time-zone-card'>
                    <SearchInput options={options} addTimeZone={addTimeZone} />
                    <TimeZoneList timeZoneList={timeZoneList} deleteTimeZone={deleteTimeZone} />
                </div>
            </div>
        </MainTimeZoneContext.Provider>
    );
}

export default App;
