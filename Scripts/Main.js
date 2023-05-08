// File: Main.js
// Date: 2023-05-06
// Author: Gunnar Lidén

// Inhalt
// =============
//
// Main function for the test of member login and logout controls
// This function 

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Global Parameters /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Instance of application XML
var g_application_xml = null;

// Instance of the class WebLoginLogout
var g_web_login_logout = null;


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Global Parameters ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Main Functions ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Main (onload) function for the test application 
function initTestLogin()
{
    //QQQ g_application_xml = new JazzApplicationXml(initTestAfterXml);

    var hide_display_elements = [];
    hide_display_elements[0] = getDivElementTestControlOne();
    hide_display_elements[1] = getDivElementTestControlOne();

    g_web_login_logout = new WebLoginLogout(getIdDivLoginLogout(), 
                          hide_display_elements, createWebLoginLogoutControlsAfterLoadOfXml);

    g_web_login_logout.createControls();

} // initTestLoginLogout

/*QQQQQQ
// Callback function after load of application XML
function initTestAfterXml()
{
    var hide_display_elements = [];
    hide_display_elements[0] = getDivElementTestControlOne();
    hide_display_elements[1] = getDivElementTestControlOne();

    g_web_login_logout = new WebLoginLogout(g_application_xml, getIdDivLoginLogout(), 
                          hide_display_elements, createWebLoginLogoutControlsAfterLoadOfXml);

    g_web_login_logout.createControls();

} // initTestAfterXml
QQQQ*/

// Callback function after the creation of the application XML object
function createWebLoginLogoutControlsAfterLoadOfXml()
{
    g_web_login_logout.createWebLoginLogoutControlsAfterLoadOfXml();
   

} // initTestAfterObjectCreation

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

