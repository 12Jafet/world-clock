import { Stack, Autocomplete } from '@mui/material'

const SearchInput = props => {
    const { options = [], addTimeZone } = props;

    return (
        <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
                popupIcon={false}
                options={options}
                getOptionLabel={(option) => option.city}
                clearOnEscape
                autoHighlight
                noOptionsText='No matches found'
                onChange={(event, value) => addTimeZone(value)}
                renderInput={(params) =>
                    <div ref={params.InputProps.ref}>
                        <input
                            type="text"
                            placeholder="Find place or timezone"
                            {...params.inputProps}
                            className='search-input'
                        />
                    </div>
                }
            />
        </Stack>
    );
}

export default SearchInput;