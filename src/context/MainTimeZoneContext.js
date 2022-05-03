import React from 'react'

const MainTimeZoneContext = React.createContext({
    dateTime: null,
    setDateTime: () => { }
});

export default MainTimeZoneContext