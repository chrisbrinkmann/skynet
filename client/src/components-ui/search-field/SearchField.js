import React, { } from 'react';

import FormInput from '../form-input/FormInput';

import style from './search-field.module.scss';

// *************************** SEARCH FIELD COMPONENT *************************** //
const SearchField = ({ setSearchField }) => {
  return (
    <div className={style.searchField}>
      <FormInput
        search 
        type='search'
        placeholder='Search for users...'
        onChange={setSearchField}
      />
    </div>
  )
};

export default SearchField;