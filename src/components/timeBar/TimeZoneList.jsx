import React, { useContext, useEffect, useState } from 'react'

import TimeZoneItem from './TimeZoneItem';
import MainTimeZoneContext from '../../context/MainTimeZoneContext';

const TimeZoneList = props => {
    const { timeZoneList = [], deleteTimeZone } = props;

    const { dateTime } = useContext(MainTimeZoneContext)
    const [hourSelectorPosition, setHourSelectorPosition] = useState();
    const CARD_WIDTH = 1100;
    const WINDOW_WIDTH = (window.innerWidth - CARD_WIDTH) / 2;
    const LEFT_LIMIT = 397;
    const RIGHT_LIMIT = 1057;
    const HOUR_TIME_BAR_WIDTH = 28.5;
    const FIRST_HOUR_POSITION = 384;

    const handleOnMouseMove = (e) => {
        if (e.pageX >= (LEFT_LIMIT + WINDOW_WIDTH) && e.pageX <= (RIGHT_LIMIT + WINDOW_WIDTH)){
            setHourSelectorPosition(e.pageX - HOUR_TIME_BAR_WIDTH / 2);
        }
    }

    useEffect(() => {
        if (dateTime)
            setHourSelectorPosition(FIRST_HOUR_POSITION + WINDOW_WIDTH + (dateTime.getHours() * HOUR_TIME_BAR_WIDTH));
    }, [dateTime])


    return (
        <div onMouseMove={handleOnMouseMove} onMouseLeave={() => setHourSelectorPosition(FIRST_HOUR_POSITION + WINDOW_WIDTH + (dateTime.getHours() * HOUR_TIME_BAR_WIDTH))}>
            <div 
                style={{
                    position: 'absolute',
                    width: HOUR_TIME_BAR_WIDTH,
                    height: 69 * timeZoneList.length - 24,
                    backgroundColor: '#f49c76ca',
                    borderRadius: 5,
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: '#f49c76',
                    left: hourSelectorPosition,
                    display: timeZoneList.length ? '' : 'none'
                }}
            ></div>
            {
                timeZoneList.map((timeZone, index) => (
                    <TimeZoneItem 
                        key={index}
                        idItem={index}
                        deleteTimeZone={deleteTimeZone}
                        main={timeZone.isMain}
                        url={timeZone.url} 
                    />
                ))
            }
        </div>
    );
}

export default TimeZoneList