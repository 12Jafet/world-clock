import { Fragment, useContext, useEffect, useState } from 'react'
import format from 'date-fns/format';
import { parseISO, addDays, parse } from 'date-fns';
import { differenceInHours } from 'date-fns/esm';
import { Col, Row } from 'react-bootstrap';
import { IconButton } from '@mui/material';
import { Delete, Home } from '@mui/icons-material';

import MainTimeZoneContext from '../../context/MainTimeZoneContext';
import useApi from '../../hooks/useApi';

const TimeZoneItem = props => {
    const { url, main, deleteTimeZone, idItem } = props;
    const [timeData, setTimeData] = useState();
    const [clock, setClock] = useState();
    const [mainDifference, setMainDifference] = useState(0);
    const { dateTime, setDateTime } = useContext(MainTimeZoneContext)
    const [barArray, setBarArray] = useState(Array.from(Array(24).keys()));
    const [intervalId, setIntervalId] = useState();
    const { handleRequest } = useApi({
        url,
    });

    useEffect(() => {
        getTime();
    }, [url]);
    
    useEffect(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        const interval = setInterval(() => {
            if (timeData) {
                setClock(parse(new Date().toLocaleString("en-US", {timeZone: timeData.timezone}), 'M/d/yyyy, h:mm:ss a', new Date()));
            }
        }, 1000)
        setIntervalId(interval)
    }, [timeData]);

    const getTime = async () => {
        const response = await (handleRequest());
        const formatedResponse = {
            ...response,
            datetime: parseISO(response.datetime.substring(0, response.datetime.length - 6))
        }

        setTimeData(formatedResponse);
        if (main === true) {
            setDateTime(formatedResponse.datetime)
        } else {
            const difference = differenceInHours(formatedResponse.datetime, dateTime, { roundingMethod: 'floor' })
            setMainDifference(difference)

            const tempArray = Array.from(Array(24).keys()).map(index => {
                switch (true) {
                    case ((difference + index) < 0):
                        return difference + index + 24;

                    case ((difference + index) >= 24):
                        return difference + index - 24;

                    default:
                        return Math.abs(difference + index);
                }
            });
            setBarArray(tempArray);
        }
    }

    return (
        <div>
            {
                timeData && clock &&
                <div className='mt-4'>
                    <Row>
                        <Col xs={4} className='d-flex justify-content-between align-content-center'>
                            <div className='d-flex'>
                                <div className='m-auto'>
                                    <IconButton onClick={() => deleteTimeZone(idItem)}>
                                        <Delete sx={{ color: '#000' }} />
                                    </IconButton>
                                </div>
                                <div className='m-auto'>
                                    <IconButton className='icon-button' onClick={() => {}}>
                                        {
                                            main === true
                                                ? <Home sx={{ color: '#000' }} />
                                                : <p className='icon-button-text'>{mainDifference}</p>
                                        }
                                    </IconButton>
                                </div>
                                <div className='m-auto'>
                                    <p className='bold-text mb-0'>{timeData.timezone.split("/")[0]}</p>
                                    <p className='mb-0'>{timeData.timezone.split("/")[1]}</p>
                                </div>
                            </div>
                            <div>
                                <p className='bold-text mb-0'>{`${format(clock, 'KK:mm aaa')} ${timeData.abbreviation}`}</p>
                                <p className='mb-0'>{format(clock, 'iii, MMM d')}</p>
                            </div>
                        </Col>
                        <Col xs={8}>
                            <div className='d-flex'>
                                {
                                    barArray.map((hour, index) => {

                                        let dayClass;
                                        switch (true) {
                                            case (hour === 0):
                                                dayClass = 'day-bar-item-start';
                                                break;
                                            case (hour === 23):
                                                dayClass = 'day-bar-item-end';
                                                break;
                                            case (hour < 5 || hour > 19):
                                                dayClass = 'day-bar-item-dark';
                                                break;
                                            case (hour === 5):
                                            case (hour === 6):
                                            case (hour === 17):
                                            case (hour === 18):
                                            case (hour === 19):
                                                dayClass = 'day-bar-item-blue';
                                                break;

                                            default:
                                                dayClass = 'day-bar-item-gray'
                                                break;
                                        }

                                        return (
                                            <div className={dayClass} key={index}>
                                                {
                                                    hour !== 0
                                                        ? <Fragment>
                                                            <p className='m-0'>{hour < 13 ? hour : hour - 12}</p>
                                                            <p className='m-0'>{hour < 12 ? 'am' : 'pm'}</p>
                                                        </Fragment>
                                                        : <Fragment>
                                                            <p className='m-0'>{mainDifference <= 0 ? format(timeData.datetime, 'MMM') : format(addDays(timeData.datetime, 1), 'MMM')}</p>
                                                            <p className='m-0'>{mainDifference <= 0 ? format(timeData.datetime, 'd') : format(addDays(timeData.datetime, 1), 'd')}</p>
                                                        </Fragment>
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    );
}

export default TimeZoneItem