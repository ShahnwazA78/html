const strings = {
  submitBtnId: "submit-btn",
  formId: "form",
  nameInputId: "inputName",
  nameErrorClass: ".nameError",
  nameErrorId: "nameError",
  emailInputId: "inputEmail",
  emailErrorClass: ".emailError",
  emailErrorId: "emailError",
  websiteInputId: "inputWebsite",
  websiteErrorClass: ".websiteError",
  websiteErrorId: "websiteError",
  imageLinkInputId: "inputImageLink",
  imageErrorClass: ".imageError",
  imageErrorId: "imageError",
  maleInputId: "inputMale",
  femaleInputId: "inputFemale",
  skillJavaInputId: "inputSkillJava",
  skillHtmlInputId: "inputSkillHtml",
  skillCssInputId: "inputSkillCss",
  alertElementId: "alert",
  tableBodyId: "tableBody",
  deleteMessage: "Student is Successfully Removed",
  successMessage: "Successfully Student is enrolled",
  invalidInputMessage: "Invalid Input",
  studentAlreadyExistMessage: "Student is Already Exist",
  successAlertClass: "alert-success",
  dangerAlertClass: "alert-danger",
  displayNoneClass: "d-none",
};

// Get the DOM elements
const submitBtn = document.getElementById(strings.submitBtnId);
const form = document.querySelector(strings.formId);
const nameInput = document.getElementById(strings.nameInputId);
const nameError = document.querySelector(strings.nameErrorClass);
const emailInput = document.getElementById(strings.emailInputId);
const emailError = document.querySelector(strings.emailErrorClass);
const websiteInput = document.getElementById(strings.websiteInputId);
const websiteError = document.querySelector(strings.websiteErrorClass);
const imageLinkInput = document.getElementById(strings.imageLinkInputId);
const imageError = document.querySelector(strings.imageErrorClass);
const male = document.getElementById(strings.maleInputId);
const female = document.getElementById(strings.femaleInputId);
const inputSkillJava = document.getElementById(strings.skillJavaInputId);
const inputSkillHtml = document.getElementById(strings.skillHtmlInputId);
const inputSkillCss = document.getElementById(strings.skillCssInputId);
const alertElement = document.getElementById(strings.alertElementId);
const tableBody = document.getElementById(strings.tableBodyId);

// Initialize arrays for students and skills
let students = [];
let newStudent = [];
let studentSkills = "";

// Alert types
const ALERT_TYPES = {
  SUCCESS: strings.successMessage,
  DLETE: strings.deleteMessage,
  INVALID_INPUT: strings.invalidInputMessage,
  ALREADY_EXIST: strings.studentAlreadyExistMessage,
};

/**
 * Checks if a name is valid.
 *
 * @param {string} name - The name to check.
 * @returns {boolean} - True if the name is valid, false otherwise.
 */
function isNameValid(name) {
  const trimmedName = name.trim();
  const lettersRegex = /^[A-Za-z]+$/;
  return lettersRegex.test(trimmedName);
}

/**
 * Checks if an email is valid.
 *
 * @param {string} email - The email to check.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if a URL is valid.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
function isLinkValid(url) {
  const urlPattern = /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/[\w.-]*)*\/?$/;
  return urlPattern.test(url);
}

/**
 * Saves the students array to local storage.
 */
const saveDataToLocalStorage = () => {
  localStorage.setItem("students", JSON.stringify(students));
};

/**
 * Retrieves the students array from local storage.
 */
const getDataFromLocalStorage = () => {
  const data = localStorage.getItem("students");
  if (data) {
    students = JSON.parse(data);
  }
};

// -----------------------------------------------------------------------------------

/**
 * Retrieves the students data from the database.
 */
const fetchDataFromDatabase = async () => {
  try {
    const response = await fetch("https://localhost:5001/api/v1/students");
    if (response.ok) {
      students = await response.json();
      students.reverse();
      console.log("Student is : ", students);
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error(error);
    showAllertMessage(error);
  }
};
/**
 * Saves the students data to the database.
 */
const saveDataToDatabase = async () => {
  try {
    const response = await fetch("https://localhost:5001/api/v1/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    });
    if (response.ok) {
      showAllertMessage(ALERT_TYPES.SUCCESS);
      renderPage();
    } else {
      throw new Error("Failed to save data");
    }
  } catch (error) {
    setElementBorderColor(emailInput, "red");
    showAllertMessage(ALERT_TYPES.ALREADY_EXIST);
  }
};

/**
 * Deletes a student from the database.
 *
 * @param {string} emailId - The email ID of the student to remove.
 */
const deleteStudentFromDatabase = async (emailId) => {
  try {
    const response = await fetch(
      `https://localhost:5001/api/v1/students/${emailId}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      showAllertMessage(ALERT_TYPES.deleteMessage);
      renderPage(); // Refresh the data after successful deletion
    } else {
      throw new Error("Failed to delete student");
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Removes a student from the students array and the database.
 *
 * @param {string} emailId - The email ID of the student to remove.
 */
async function removeStudent(emailId) {
  const confirmed = confirm("Are you sure you want to delete this student?");
  if (confirmed) {
    deleteStudentFromDatabase(emailId);
  }
}

// -----------------------------------------------------------------------------------

/**
 * Removes a row from the table.
 *
 * @param {Object} button - The button element that was clicked.
 */
function removeRow(button) {
  const row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

/**
 * Displays an alert message.
 *
 * @param {string} type - The type of alert to display.
 */
function showAllertMessage(type) {
  alertElement.textContent = `${type}`;
  if (type == ALERT_TYPES.SUCCESS) {
    alertElement.classList.add(strings.successAlertClass);
  } else {
    alertElement.classList.add(strings.dangerAlertClass);
  }
  alertElement.classList.remove(strings.displayNoneClass);
  setTimeout(function () {
    alertElement.classList.add(strings.displayNoneClass);
    if (type == ALERT_TYPES.SUCCESS) {
      alertElement.classList.remove(strings.successAlertClass);
    } else {
      alertElement.classList.remove(strings.dangerAlertClass);
    }
    alertElement.textContent = "";
  }, 3000);
}

/**
 * Renders a table displaying the list of students.
 */

const renderTable = () => {
  let html = "";
  let count = 1;
  for (const student of students) {
    const url = new URL(student.website);
    html += `<tr>
                    <td scope="row">${count++}</td>
                    <td>
                        <div class="row_data">
                            <span>${student.name}</span>
                            <span>${student.gender}</span>
                            <span>${student.email}</span>
                            <span>
                                <a href="${student.website}" target="_blank">${
      url.hostname
    }</a>
                            </span>
                            <span>${student.studentSkills}</span>
                            <div class="d-flex justify-content-end">
                                <button class="btn btn-outline-danger btn-sm" id = "deleteStudent" onclick = "removeStudent('${
                                  student.email
                                }')">Remove</button>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="image">
                            <a href="${
                              student.imageLink == null ||
                              student.imageLink == ""
                                ? student.imageLink
                                : "https://curatedceramics.com/wp-content/uploads/2017/10/blank-profile-picture-610x819.jpg"
                            }" target="_blank">
                                <img src="${
                                  student.imageLink
                                    ? student.imageLink
                                    : "https://curatedceramics.com/wp-content/uploads/2017/10/blank-profile-picture-610x819.jpg"
                                }"
                                    alt="user Image"/>
                            </a>
                            
                        </div>
                    </td>
                </tr>`;
  }
  tableBody.innerHTML = html;
};

/**
 * Render the student data table.
 */
const resetForm = () => {
  setElementBorderColor(nameInput, "");
  setElementBorderColor(emailInput, "");
  setElementBorderColor(websiteInput, "");
  setElementBorderColor(imageLinkInput, "");
  nameError.classList.add(strings.displayNoneClass);
  emailError.classList.add(strings.displayNoneClass);
  websiteError.classList.add(strings.displayNoneClass);
  imageError.classList.add(strings.displayNoneClass);
  nameInput.value = null;
  websiteInput.value = null;
  emailInput.value = null;
  imageLinkInput.value = null;
  male.checked = false;
  female.checked = false;
  inputSkillJava.checked = false;
  inputSkillHtml.checked = false;
  inputSkillCss.checked = false;
};

/**
 * Renders the page by getting data from local storage and rendering the table.
 * Also, disables the submit button by default and resets the form.
 */
const renderPage = async () => {
  // Get data from local storage and render the table
  await fetchDataFromDatabase();
  renderTable();
  // First, disable the submit button by default
  submitBtn.disabled = true;

  // Reset the form
  resetForm();
};

renderPage();

/**
 * Sets the border color of an element.
 * @param {HTMLElement} element - The element to set the border color for.
 * @param {string} color - The color to set the border to (in CSS color format).
 */
function setElementBorderColor(element, color) {
  element.style.borderColor = color;
}

/**

Validates an input field value and sets its border color and error message display accordingly.

@param {string} inputId - The id of the input field to validate.

@param {string} errorId - The id of the error message element to display if validation fails.

@returns {boolean} - True if validation passes, false otherwise.
*/
function validateInputByIDAndSetBorder(inputId, errorId) {
  const inputElement = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);
  let isValid = true;

  if (inputElement.type === "text") {
    isValid = isNameValid(inputElement.value);
  } else if (inputElement.type === "email") {
    isValid = isEmailValid(inputElement.value);
  } else if (inputElement.type === "url") {
    if (inputId == strings.imageLinkInputId && inputElement.value == "") {
      isValid = true;
    } else isValid = isLinkValid(inputElement.value);
  }

  if (isValid) {
    setElementBorderColor(inputElement, "green");
    errorElement.classList.add(strings.displayNoneClass);
  } else {
    setElementBorderColor(inputElement, "red");
    errorElement.classList.remove(strings.displayNoneClass);
  }
  return isValid;
}

/**

Validates the form inputs before saving the data to the database.
@returns {void}
*/
function validateBeforeSaveToDataBase() {
  let name = nameInput.value;
  let email = emailInput.value;
  let website = websiteInput.value;
  let imageLink = imageLinkInput.value;
  let gender = getGender();
  getAllSkills();
  if (
    isEmailValid(email) &&
    isLinkValid(website) &&
    studentSkills.length != 0 &&
    gender != ""
  ) {
    // check if email already exists
    newStudent = {
      name,
      email,
      website,
      imageLink,
      gender,
      studentSkills,
    };
    saveDataToDatabase();
  } else {
    validateInputByIDAndSetBorder(strings.nameInputId, strings.nameErrorId);
    validateInputByIDAndSetBorder(strings.emailInputId, strings.emailErrorId);
    validateInputByIDAndSetBorder(
      strings.websiteInputId,
      strings.websiteErrorId
    );
    validateInputByIDAndSetBorder(
      strings.imageLinkInputId,
      strings.imageErrorId
    );
    // rest of gender and skills we do not need to check because is submit is clicked it ensures that all skill and gender are clicked
    showAllertMessage(ALERT_TYPES.INVALID_INPUT);
  }
}

/**
 * Returns the selected gender option.
 */
function getGender() {
  var gender = male.checked ? male.value : female.checked ? female.value : "";
  return gender;
}

/**
 * store selected skills in skills array.
 */

function getAllSkills() {
  studentSkills = ""; // get clear all the previous values that are there
  if (inputSkillJava.checked) {
    studentSkills += inputSkillJava.value + ", ";
  }
  if (inputSkillHtml.checked) {
    studentSkills += inputSkillHtml.value + ", ";
  }
  if (inputSkillCss.checked) {
    studentSkills += inputSkillCss.value;
  }
}

/**
 * Returns the selected gender value from the radio buttons.
 * @return {string} The value of the selected gender radio button (either "male" or "female"), or an empty string if none are selected.
 */
function validateForm() {
  // Get all form inputs
  const genderInputs = document.getElementsByName("gender");
  const skillInputs = document.getElementsByName("skills");

  let isValidGender = false;
  for (let i = 0; i < genderInputs.length; i++) {
    if (genderInputs[i].checked) {
      isValidGender = true;
      break;
    }
  }

  let isValidSkills = false;
  for (let i = 0; i < skillInputs.length; i++) {
    if (skillInputs[i].checked) {
      isValidSkills = true;
      break;
    }
  }

  // empty imagelink is Okay but if there is some input in image input then we have to verify
  let isValidImage =
    imageLinkInput.value == "" ? true : isLinkValid(imageLinkInput.value);

  // Enable submit button if all inputs are valid
  if (
    isNameValid(nameInput.value) &&
    isEmailValid(emailInput.value) &&
    isLinkValid(websiteInput.value) &&
    isValidImage &&
    isValidGender &&
    isValidSkills
  ) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

/**

Add an event listener to the form that triggers on input in any of the form fields and calls the validateForm function.
@param {HTMLFormElement} form - The form element to attach the event listener to.
*/
form.addEventListener("input", validateForm);

/**

Add an event listener to the form on submit.
@param {Event} event - The event object passed by the event listener.
*/
form.addEventListener("submit", (event) => {
  // If submit button is clicked it means is enabled that ensures all the inputs are valid

  event.preventDefault(); // prevent the form from submitting normally

  const url = new URL(websiteInput.value); // get domain name from input link to show only domain name
  validateBeforeSaveToDataBase();
});
