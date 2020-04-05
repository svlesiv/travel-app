//
// This method validates user input and returns an error message.
//
export const validateForm = (cityInputValue, dateInputValue) => {
  let errorMsg = '';

  // check if inputs are empty
  if (cityInputValue === '' || dateInputValue === '') {
    errorMsg = "Please fill out the form"
  }

  // https://stackoverflow.com/questions/5778020/check-whether-an-input-string-contains-a-number-in-javascript
  // check if city input includes numbers 
  if (/\d/.test(cityInputValue)) {
    errorMsg = "Please input a valid city"
  }

  return errorMsg;
};
