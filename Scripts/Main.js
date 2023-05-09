// File: Main.js
// Date: 2023-05-08
// Author: Gunnar Lidén

// Inhalt
// =============
//
// Main function for the test of member login and logout controls
// This function 

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Global Parameters /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Instance of the class WebLoginLogout
var g_web_login_logout = null;


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Global Parameters ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Main Functions ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Main (onload) function for the login-logout test application 
// 1. Set the array of elements that shall be displayed only after login
// 2. Instantiate the class WebLoginLogout. Set g_web_login_logout.
// 3. 
function initTestLogin()
{
    var hide_display_elements = [];
    hide_display_elements[0] = getDivElementTestControlOne();
    hide_display_elements[1] = getDivElementTestControlTwo();

    g_web_login_logout = new WebLoginLogout(getIdDivLoginLogout(), 
                          hide_display_elements);

    g_web_login_logout.loadXml();

} // initTestLoginLogout

// Callback function after the creation of the application XML object
function createLoginLogoutControlsAfterLoadOfXml()
{
    g_web_login_logout.createLoginLogoutControlsAfterLoadOfXml();
   

} // initTestAfterObjectCreation

// Event function user clicked the login-logout button
function onClickWebLoginLogoutButton()
{
    g_web_login_logout.onClickWebLoginLogoutButton();

} // onClickWebLoginLogoutButton

function callbackOnClickWebLoginLogoutButton(i_logged_in_name, i_b_user_has_logged_in, i_warning_msg)
{
    g_web_login_logout.callbackOnClickWebLoginLogoutButton(i_logged_in_name, i_b_user_has_logged_in, i_warning_msg);
    
} // callbackOnClickWebLoginLogoutButton

// Callback function for LoginLogout.loginIfPossible
function callbackWebLoginIfPossible(i_logged_in_name, i_b_user_has_logged_in)
{
    g_web_login_logout.callbackWebLoginIfPossible(i_logged_in_name, i_b_user_has_logged_in);

} // callbackWebLoginIfPossible

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Main Functions //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Get Id And Element Functions //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Returns the identity of the <div> element for the login and logout controls
function getIdDivLoginLogout()
{
    return 'id_div_login_logout';

} // getIdDivLoginLogout

// Returns the element test control one <div> element
function getDivElementTestControlOne()
{
    return document.getElementById(getIdDivElementTestControlOne());

} // getDivElementTestControlOne

//Returns the identity of the test control one <div> element
function getIdDivElementTestControlOne()
{
    return 'id_test_control_one';

} // getIdDivElementTestControlOne


// Returns the element test control two <div> element
function getDivElementTestControlTwo()
{
    return document.getElementById(getIdDivElementTestControlTwo());

} // getDivElementTestControlTwo

//Returns the identity of the test control two <div> element
function getIdDivElementTestControlTwo()
{
    return 'id_test_control_two';

} // getIdDivElementTestControlTwo

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Get Id And Element Functions ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// User clicked merge files
function eventMergeFiles()
{
    var file_name = '../../JazzScripts/LoginLogout_20230509.js';

    $.post
      ('PhpMerge/MergeLoginLogout.php',
        {
          file_name: file_name
        },
        function(data_save,status_save)
		{
            if (status_save == "success")
            {
                // alert(data_save);
            }
            else
            {
				alert("Execution of MergeLoginLogout.php failed");
            }          
        } // function

      ); // post
	  

} // eventMergeFiles

