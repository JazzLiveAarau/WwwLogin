// File: Main.js
// Date: 2023-05-16
// Author: Gunnar Lidén

// Inhalt
// =============
//
// Main function for the test of member login and logout controls

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Global Parameters /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Instance of the class WebLoginLogout
var g_web_login_logout = null;

// Flag telling debug data shall be written to console
var g_write_debug_to_log = true;

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
    debugToConsole("initTestLogin Enter");

    var hide_display_elements = [];
    hide_display_elements[0] = getDivElementTestControlOne();
    hide_display_elements[1] = getDivElementTestControlTwo();

    // Only read data for all applications except Admin Tasks
    var b_only_read_data = true;

    // Number od directory levels to server directory /www/XML/
    var n_level_xml = 1;

    g_web_login_logout = new WebLoginLogout(getIdDivLoginLogout(), 
                          hide_display_elements, b_only_read_data, n_level_xml);

    debugToConsole("initTestLogin Object WebLoginLogout is created");

    g_web_login_logout.loadXml();

    debugToConsole("initTestLogin Exit");

} // initTestLoginLogout

// Callback function after the creation of the application XML object
function createLoginControlsAfterXml()
{
    debugToConsole("createLoginControlsAfterXml Enter");

    g_web_login_logout.createLoginControlsAfterXml();
   
} // initTestAfterObjectCreation

// Event function user clicked the login-logout button
function onClickWebLoginButton()
{
    debugToConsole("onClickWebLoginButton Enter");

    g_web_login_logout.onClickWebLoginButton();

} // onClickWebLoginButton

function callbackonClickWebLoginButton(i_logged_in_name, i_b_user_has_logged_in, i_warning_msg)
{
    debugToConsole("callbackonClickWebLoginButton Enter");

    g_web_login_logout.callbackonClickWebLoginButton(i_logged_in_name, i_b_user_has_logged_in, i_warning_msg);
    
} // callbackonClickWebLoginButton

// Callback function for LoginLogout.loginIfPossible
function callbackWebLoginIfPossible(i_logged_in_name, i_b_user_has_logged_in)
{
    debugToConsole("callbackWebLoginIfPossible Enter");

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

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Merge Functions ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// User clicked merge files. 
// The JavaScript files will be merged to one file and written to the server directory
// /www/JazzScripts/. The directory name is defined in file MergeLoginLogout.php.
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Please note that the file LoginLogout.php necessary for the login on the server
// has to be copied to the subdirectory /Php/ of the web application (web page) that
// is using the library of login functions (the files that are merged here).
// Using a relative or absolute path to /www/JazzScripts/Php/ seems to be impossible
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function eventMergeFiles()
{
    var file_name = 'LoginLogout_20230518.js';

    $.post
      ('PhpMerge/MergeLoginLogout.php',
        {
          file_name: file_name
        },
        function(data_save,status_save)
		{
            if (status_save == "success")
            {
                alert("JavaScript files merged to " + file_name + 
                " and copied to server directory /www/JavaScripts/.");
            }
            else
            {
				alert("Execution of MergeLoginLogout.php failed");
            }          
        } // function

      ); // post
	  

} // eventMergeFiles

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Merge Functions /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Debug Functions ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Write debug data to console
function debugToConsole(i_msg_str)
{
    if (!g_write_debug_to_log)
    {
         return;
    }

    console.log('Main:' + i_msg_str);

} // debugToConsole    

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Debug Functions /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

