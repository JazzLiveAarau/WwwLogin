<?php

// File: LoginLogout.php
// Date: 2021-06-03
// Author: Gunnar Liden

// This file defines all PHP functions for JavaScript class LoginLogout

// References
// PHP Functions:  https://www.w3schools.com/php/php_functions.asp

$exec_case = $_POST['exec_case'];

$user_name = $_POST['user_name'];

$logged_in_name = $_POST['logged_in_name'];

$user_logged_in = $_POST['user_logged_in'];

$name_nobody = $_POST['name_nobody'];

$file_login_logout = $_POST['file_login_logout'];

$error_message_one = $_POST['error_message_one'];

$error_message_two = $_POST['error_message_two'];

$file_tasks_xml = "../Xml/JazzTasks.xml";

$logout_limit_time_diff_minutes  = 15;

switch ($exec_case) 
{
    case "ExecGetLoggedIn":
        getLoggedInNameEcho($user_name, $file_login_logout);
        break;
    case "ExecSetLoggedIn":
      setLoggedInNameEcho($logged_in_name, $user_name, $file_login_logout, $error_message_one);
      break;
    case "ExecLoginIfPossible":
      loginIfPossible($user_name, $file_login_logout, $file_tasks_xml, $logout_limit_time_diff_minutes, $name_nobody, $error_message_one);
      break;
      case "ExecClickLoginLogout":
        clickLoginLogout($user_name, $file_login_logout, $user_logged_in,  $file_tasks_xml, $logout_limit_time_diff_minutes, $name_nobody, $error_message_one, $error_message_two); 
        break;
        case "ExecXmlTimeExceeded":
          isTimeLimitXmlExceededEcho($file_tasks_xml, $logout_limit_time_diff_minutes); 
          break;
    default:
      echo "Error LoginLogout.php Not an implemented case " . $exec_case;
}

// Login if possible
// https://www.php.net/manual/de/function.touch.php
function loginIfPossible($i_user_name, $i_file_login_logout, $i_file_tasks_xml, $i_logout_limit_time_diff_minutes, $i_name_nobody, $i_error_message_one)
{
  debugAppend(PHP_EOL . "/////////////////////////// Enter loginIfPossible /////////////////////////////////////////" . PHP_EOL);

  $logged_in_name = getLoggedInName($i_file_login_logout);

  debugAppend("loginIfPossible logged_in_name= " . $logged_in_name . " i_user_name= " . $i_user_name);

  $b_time_limit_exceeded = isTimeLimitXmlExceeded($i_file_tasks_xml, $i_logout_limit_time_diff_minutes);

  if ($logged_in_name == $i_name_nobody)
  {
    debugAppend("loginIfPossible logged_in_name == i_name_nobody Case _user");

    setLoggedInName($i_user_name, $i_file_login_logout, $i_file_tasks_xml, $i_error_message_one);

    echo $i_user_name . "_user";
  }
  elseif($logged_in_name == $i_user_name)
  {
    debugAppend("loginIfPossible Case: logged_in_name == i_user_name Case _myself");

    setLoggedInName($i_user_name, $i_file_login_logout, $i_file_tasks_xml, $i_error_message_one);

    echo $i_user_name . "_myself";
  }
  elseif($logged_in_name != $i_user_name && $b_time_limit_exceeded)
  {
    debugAppend("loginIfPossible Case: logged_in_name != i_user_name && b_time_limit_exceeded Case _user");

    setLoggedInName($i_user_name, $i_file_login_logout, $i_file_tasks_xml, $i_error_message_one);

    echo $i_user_name . "_user";
  }
  else
  {
    debugAppend("loginIfPossible else (not possible to login) Case _other");

    echo $logged_in_name . "_other";
  }

  debugAppend(PHP_EOL . "/////////////////////////// Exit  loginIfPossible /////////////////////////////////////////" . PHP_EOL);

} // loginIfPossible

// Handling function when user clicked the login/logout button
function clickLoginLogout($i_user_name, $i_file_login_logout, $i_user_logged_in, $i_file_tasks_xml, $i_logout_limit_time_diff_minutes, $i_name_nobody, $i_error_message_one, $i_error_message_two)
{
  debugAppend(PHP_EOL . "/////////////////////////// Enter clickLoginLogout ////////////////////////////////////////" . PHP_EOL);
  
  $logged_in_name = getLoggedInName($i_file_login_logout);

  debugAppend("clickLoginLogout logged_in_name= " . $logged_in_name . " i_user_name= " . $i_user_name);

  $b_time_limit_exceeded = isTimeLimitXmlExceeded($i_file_tasks_xml, $i_logout_limit_time_diff_minutes);

  if ($logged_in_name == $i_name_nobody && $i_user_logged_in == "FALSE")
  {
    // Nobody is logged in and the user is not logged in, i.e. the user logged himself out
    // Displayed: Ausgeloggt --- Login

    debugAppend("clickLoginLogout logged_in_name == i_name_nobody && i_user_logged_in == FALSE Case _login");
    
    setLoggedInName($i_user_name, $i_file_login_logout, $i_file_tasks_xml, $i_error_message_one);

    echo $i_user_name . "_login";
  }
  elseif ($logged_in_name == $i_name_nobody && $i_user_logged_in == "TRUE")
  {
    // The user is logged out, but nobody is logged in, i.e. somebody else
    // took over the login and then logged out. 
    // This means that the user can login again. The user is however not aware
    // of this unless there is a warning message

    debugAppend("clickLoginLogout logged_in_name == i_name_nobody && i_user_logged_in == TRUE Case _outlogged-free");

    setLoggedInName($i_user_name, $i_file_login_logout, $i_file_tasks_xml, $i_error_message_one);

    echo $i_user_name . "_outlogged-free";
  }
  elseif ($logged_in_name != $i_user_name && $i_user_logged_in == "FALSE" && $b_time_limit_exceeded)
  {
    // Another person is logged in and the user is not logged in. The user
    // now is using the possibility to force a login. This is only possible 
    // if the XML time limit has been exceeded

    debugAppend("clickLoginLogout logged_in_name != i_user_name && i_user_logged_in == FALSE && b_time_limit_exceeded Case _forced");

    setLoggedInName($i_user_name, $i_file_login_logout, $i_file_tasks_xml, $i_error_message_one);

    echo $i_user_name . "_forced";
  }
  elseif ($logged_in_name != $i_user_name && $i_user_logged_in == "FALSE" && !$b_time_limit_exceeded)
  {
    // Another person is logged in and the user is not logged in. The user
    // now tries to use the possibility to force a login. but it is not
    // posssible because the XML time limit is not exceeded, i.e. the
    // other person remains logged in

    debugAppend("clickLoginLogout logged_in_name != i_user_name && i_user_logged_in == FALSE && !b_time_limit_exceeded Force not possible Case _other");

    echo $logged_in_name . "_other";
  }
  elseif ($logged_in_name != $i_user_name && $i_user_logged_in == "TRUE")
  {
    // Another user has taken over the login. The user is no longer allowed
    // to save any changes. The user will get a warning and the other persons
    // name will be displayed.

    debugAppend("clickLoginLogout logged_in_name != i_user_name && i_user_logged_in == TRUE Case _outlogged");

    echo $logged_in_name . "_outlogged";
  }
  elseif ($logged_in_name == $i_user_name && $i_user_logged_in == "TRUE")
  {
    // The user is logged out and is the same person as registered in the text file,
    // i.e. the user wants to be logged out

    debugAppend("clickLoginLogout logged_in_name == i_user_name && i_user_logged_in == TRUE Case _logout");

    setLoggedInName($i_name_nobody, $i_file_login_logout, $i_file_tasks_xml, $i_error_message_one);  

    echo $i_name_nobody . "_logout";
  }
  elseif ($logged_in_name == $i_user_name && $i_user_logged_in == "FALSE")
  {
    debugAppend("clickLoginLogout logged_in_name == i_user_name && i_user_logged_in == FALSE Case Error 1");

    echo $i_error_message_two;
  }
  else
  {
    debugAppend("clickLoginLogout else Case Error 2");

    echo $i_error_message_two . $i_error_message_two;
  }

  debugAppend(PHP_EOL . "/////////////////////////// Exit  clickLoginLogout ////////////////////////////////////////" . PHP_EOL);

} // clickLoginLogout

// Echoes the name of the logged in person
function getLoggedInNameEcho($i_user_name, $i_file_login_logout)
{
  $file_content = file_get_contents($i_file_login_logout);

  if ($file_content == $i_user_name)
  {
    echo  $file_content . "_user";
  }
  else
  {
    echo  $file_content . "_other";
  }

} // getLoggedInNameEcho

// Echos the set logged in name (not yet tested)
function setLoggedInNameEcho($i_logged_in_name, $i_user_name, $i_file_login_logout, $i_error_message_one)
{
  if (strlen($i_logged_in_name) < 2)
  {
      echo $i_error_message_one;
  }

  $file_content_new = $i_logged_in_name;

  $new_file = fopen($i_file_login_logout, "w") or die("Unable to open file!");

  fwrite($new_file, $file_content_new);

  fclose($new_file);

  if ($i_logged_in_name == $i_user_name)
  {
    echo  $i_logged_in_name . "_user";
  }
  else
  {
    echo  $i_logged_in_name . "_other";
  }

} // setLoggedInNameEcho


// Returns the name of the logged in person
function getLoggedInName($i_file_login_logout)
{
  $file_content = file_get_contents($i_file_login_logout);

  debugAppend("getLoggedInName Logged in name= " . $file_content);

  return  $file_content;

} // getLoggedInName

// Sets the logged in name
// Please not that the time stamp is changed for the XML file that registers the tasks
function setLoggedInName($i_logged_in_name, $i_file_login_logout, $i_file_tasks_xml, $i_error_message_one)
{
  if (strlen($i_logged_in_name) < 2)
  {
      return $i_error_message_one;
  }

  touch($i_file_tasks_xml);

  $time_stamp_now = time();

  $time_stamp_str =  date ("F d Y H:i:s.", $time_stamp_now);

  debugAppend("setLoggedInName i_logged_in_name= " . $i_logged_in_name . " Time stamp XML " . $time_stamp_str);

  $file_content_new = $i_logged_in_name;

  $new_file = fopen($i_file_login_logout, "w") or die("Unable to open file!");

  fwrite($new_file, $file_content_new);

  fclose($new_file);

  return $i_logged_in_name;

} // setLoggedInName

// Determines if the time limit for the last change of the XML file ist exceeded
// https://www.php.net/manual/de/function.filemtime.php Also to solve the browser caching problem
// https://www.php.net/manual/de/function.date.php
// https://www.php.net/manual/de/function.time.php
// https://stackoverflow.com/questions/365191/how-to-get-time-difference-in-minutes-in-php
// https://www.php.net/manual/de/function.touch.php
function isTimeLimitXmlExceededEcho($i_file_tasks_xml, $i_logout_limit_time_diff_minutes)
{
  $time_stamp_now = time();

  if (file_exists($i_file_tasks_xml)) 
  {
    $time_stamp_xml = filemtime($i_file_tasks_xml);

    $diff_seconds = $time_stamp_now - $time_stamp_xml;

    $diff_minutes = floor($diff_seconds/60.0);

    $diff_hours = $diff_seconds/60.0/60.0;

    $b_time_limit_exceeded = false;

    if ($diff_minutes > $i_logout_limit_time_diff_minutes)
    {
      $b_time_limit_exceeded = true;
    }

    if ($b_time_limit_exceeded)
    {
      echo "XML time limit is exceeded.";
    }
    else
    {
      echo "XML time limit is NOT exceeded.";
    }

    // echo "Difference in minutes is " . strval($diff_minutes);

    // echo "Difference in hours is " . strval($diff_hours);

    // echo "$i_file_tasks_xml wurde zuletzt modifiziert: " . date ("F d Y H:i:s.", filemtime($i_file_tasks_xml));
  }
  else
  {
    echo "Error isTimeLimitXmlExceededEcho This file do not exist " . $i_file_tasks_xml;
  }

} // isTimeLimitXmlExceededEcho

// Returns true if the XML time limit is exceeded
// The function is based on the time stamp of the XML file that registers the tasks
// Please note that function loginIfPossible sets the time stamp to the current
// time when somebody logs in (with the function touch)
function isTimeLimitXmlExceeded($i_file_tasks_xml, $i_logout_limit_time_diff_minutes)
{
  $time_stamp_now = time();

  if (file_exists($i_file_tasks_xml)) 
  {
    $time_stamp_xml = filemtime($i_file_tasks_xml);

    $diff_seconds = $time_stamp_now - $time_stamp_xml;

    $diff_minutes = floor($diff_seconds/60.0);

    $b_time_limit_exceeded = false;

    if ($diff_minutes > $i_logout_limit_time_diff_minutes)
    {
      debugAppend("isTimeLimitXmlExceeded diff_minutes= " . $diff_minutes . " Limit " . $i_logout_limit_time_diff_minutes . " Return true");

      $b_time_limit_exceeded = true;
    }
    else
    {
      debugAppend("isTimeLimitXmlExceeded diff_minutes= " . $diff_minutes . " Limit " . $i_logout_limit_time_diff_minutes . " Return false");
    }

	  return $b_time_limit_exceeded;
  }
  else
  {
    return null;
  }

} // isTimeLimitXmlExceeded

// Appends debug to file 
function debugAppend($i_debug_str)
{
  $file_debug = "Data/DebugLoginLogout.txt";

  if (!file_exists($file_debug)) 
  {
    return;
  }

  $debug_str = $i_debug_str . PHP_EOL;

  file_put_contents($file_debug, $debug_str, FILE_APPEND);

} // debugAppend

?>
