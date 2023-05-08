// File: WebLoginLogout.js
// Date: 2023-05-08
// Author: Gunnar Lidén

// File content
// =============
//
// Class for the memmber login-logout controls

class WebLoginLogout
{
    // Creates the instance of the class
    // i_application_xml:        XML application object with member data
    // id_div_login_logout:      Identity of the div placeholder for the menu
    // i_hide_display_elements   Elements that shall be hidden if user not is logged in
    // i_callback_function_name: Function that shall be called after loading
    constructor(i_id_div_login_logout, i_hide_display_elements, i_callback_function_name) 
    {
        // Member variables
        // ================

        // Application XML object
        this.m_application_xml = null;

        // Identity of the <div> for the member login-logout controls
        this.m_id_div_login_logout = i_id_div_login_logout;

        // Array of elements that shall be hidden or displayed depending on if user not is logged in
        this.m_hide_display_elements = i_hide_display_elements;

        // Call back function name used after creation of application XML object
        this.m_callback_function_name = i_callback_function_name;

        // Instance of class LoginLogout
        this.m_login_logout = null;

        // Object that handles the user name
        this.m_user_name_object = null;

        // Flag telling if the user has logged in
        this.m_user_has_logged_in = null;

        // The member login-logout menu object
        this.m_object_xml = null;

        // Creates the member login-logout controls
        // Not called here. The object shall first be created, because .... this.createControls();

    } // constructor

    // Sets the XML object
    setXmlObject(i_object_xml)
    {
        this.m_object_xml = i_object_xml;

    } // setXmlObject

    // Returns the XML object
    getXmlObject()
    {
        return this.m_object_xml;

    } // getXmlObject    

    // Returns the object LoginLogout
    getLoginLogoutObject()
    {
        return this.m_login_logout;

    } // getLoginLogoutObject

    // Sets the flag telling if the user has logged in
    setUserHasLoggedIn(i_b_has_logged_in)
    {
        this.m_user_has_logged_in = i_b_has_logged_in;

        this.m_login_logout.setUserIsLoggedIn(i_b_has_logged_in);

    } // setUserHasLoggedIn

   // Returns the object JazzUserName
   getUserNameObject()
   {
    return this.m_user_name_object

   } // getUserNameObject

    // Returns the identity of the login and logout button
    getIdLoginLogoutButton()
    {
        return 'id_login_logout_button';
    
    } // getIdLoginLogoutButton

    // Returns the identity of the login and logout text box
    getIdLoginLogoutTextBox()
    {
        return 'id_login_logout_text_box';

    } // getIdLoginLogoutTextBox

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Create Controls ///////////////////////////
    ///////////////////////////////////////////////////////////////////////////  

    // Creates the application XML object and calls afterward the function that
    // creates the controls. First is the normal (global) function called and 
    // thereafter the member function
    createControls()
    {
        this.m_application_xml = new JazzApplicationXml(this.m_callback_function_name);
    }

    // Creates the member login-logout controls when the application XML object has been created
    createWebLoginLogoutControlsAfterLoadOfXml()
    {
        this.m_user_name_object = new JazzUserName(this.m_application_xml);

        var user_name = this.m_user_name_object.getUserName();
    
        if (user_name == JazzUserName.getUserNameNotYetSet())
        {
            user_name = LoginLogout.UserNameIsUndefined();
        }
    
        this.m_login_logout = new LoginLogout(this.getIdLoginLogoutTextBox(), this.getIdLoginLogoutButton(), 
                                    this.m_id_div_login_logout, "onClickLoginLogoutButton",
                                          user_name);
    
        /* QQQ Only necessary for Admin Tasks
        if (user_name != LoginLogout.UserNameIsUndefined())
        {
            this.m_login_logout.loginIfPossible(callbackLoginIfPossible);
        }
        QQQQQQQQQQQ*/

    } // createControls

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Create Controls /////////////////////////////
    ///////////////////////////////////////////////////////////////////////////    

} // WebLoginLogout

// Class with variables an functions that handle login and logout
// Here is a sample how an object of the class can be created:
// var my_login = new LoginLogout("id_text_box", "id_button", "i_id_container", i_event_fctn, "user_name")
class LoginLogout
{

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Constructor ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    // Function that is executed when an object of this class is created
    // Variables are defined and two inititialization functions are executed
    // Input parameters
    // i_id_text_box_login_name Identity of the text box with the login name
    // i_id_button_login_logout Identitity of the login and logut button
    // i_id_div_container The identity of the <div> container for the textbox and button
    // i_button_event_function_name The name of the button event function. 
    // This event function must call the member event function onClickButton
    constructor(i_id_text_box_login_name, i_id_button_login_logout, i_id_div_container, 
                i_button_event_function_name, i_user_name)
    {

     ///////////////////////// Start Input parameters //////////////////////////////////////

        // Identity of the text box with the login name
        this.m_id_text_box_login_name = i_id_text_box_login_name;

        // Identitity of the login and logut button
        this.m_id_button_login_logout = i_id_button_login_logout;

        // The identity of the container for the text box with label and the button
        this.m_id_div_container = i_id_div_container;

        // The name of the button event function
        this.m_button_event_function_name = i_button_event_function_name;

        // User name
        this.m_user_name = i_user_name;

     ///////////////////////// End Input parameters ////////////////////////////////////////      
     
     ///////////////////////// Start User Is Logged In /////////////////////////////////////
     
        // Flag telling if the user is logged in
        this.m_user_is_logged_in = false;

        // Name of the logged in person. Nur für simulation
        this.m_logged_in_simulation = "";

     ///////////////////////// End User Is Logged In ///////////////////////////////////////  

     ///////////////////////// Start Elements //////////////////////////////////////////////

        // The container element for the text box with label and the button
        this.m_el_div_container = null;

        // The text box for the login name
        this.m_text_box = null;

        // The login logout button
        this.m_login_logout_button = null;

     ///////////////////////// End Elements ////////////////////////////////////////////////

     ///////////////////////// Start Strings ///////////////////////////////////////////////

        this.m_caption_logout = "Logout";

        this.m_caption_login = "Login";

        this.m_caption_user_name = "Benutzername";

        this.m_caption_force_login = "Login erneut versuchen";

        this.m_label_login_your_name = "Dein Login-Name ";

        this.m_label_login_nobody_logged_in = "Ausgeloggt ";

        this.m_label_login_other_name = "Name der eingeloggten Person ";

        this.m_tooltip_login_your_name = "Dein Login-Name wird gezeigt";

        this.m_tooltip_login_other_name = "Zeigt den Namen der Person, die bereits eingeloggt ist";

        this.m_tooltip_login_nobody_logged_in = "Beim Klick des Login-Buttons wird dein Login-Name gezeigt.";

        this.m_tooltip_button_logout = "Logout wenn alle Änderungen gemacht sind!" + 
                                     "\nDie Webseite zu schliessen reicht nicht!" +
                                     "\nEin automatisches Ausloggen gibt es aber auch:" +
                                     "\nNach 15 Minuten Inaktivität kann das Login von" + 
                                     "\neiner anderen Person übernommen werden";

        this.m_tooltip_button_login = "Klick für Login. \n";

        this.m_tooltip_button_user_name = "Klick für Benutzername zu speichern und Login. \n";        

        this.m_tooltip_button_force_login = "Login ist möglich nach 15 Minuten Inaktivität, d.h." + 
                                          "\ndie eingeloggte Person hat während dieser Zeit nichts" +
                                          "\ngespeichert.";


        this.m_value_login_nobody_logged_in = "----";

        this.m_warning_file_empty =  "Bitte den Webmaster informieren, dass die Datei mit dem " + 
                                    "\nLogin-Name leer war." + 
                                    "\nLogin Admin macht jetzt ein neuer Versuch einzuloggen.";                                     

     ///////////////////////// End Strings /////////////////////////////////////////////////

     ///////////////////////// Start Styles ////////////////////////////////////////////////

        this.m_button_color_logout = "rgb(236, 242, 44)";

        this.m_container_color = "rgb(186, 214, 219)";

        this.m_button_color = "rgb(186, 214, 219)";

        this.m_label_color = "rgb(186, 214, 219)";

        this.m_input_color = "rgb(186, 214, 219)";

     ///////////////////////// End Styles //////////////////////////////////////////////////

     ///////////////////////// Start Init //////////////////////////////////////////////////  

        // Sets the container element parameter m_el_div_container
        this.setDivContainerElement();

        // Initializes the flag telling if the user is logged in
        this.setUserIsLoggedIn(false);

        // Creates and sets the controls, i.e. the content of the div element container
        this.createSetControls(this.m_user_name);

     ///////////////////////// End Init ////////////////////////////////////////////////////  

    } // constructor

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Constructor /////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Login If Possible /////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////    

    // Login if possible. The callback functions returns the name of the logged in person
	loginIfPossible(i_callback_login_if_possible)
    {
        var user_name = this.getUserName();

        if (user_name == LoginLogout.UserNameIsUndefined())
        {
            alert("loginIfPossible Programming error: User name is undefined (= " + LoginLogout.UserNameIsUndefined());

            i_callback_click_login_logout(LoginLogout.getErrorMsgUserNameIsUndefined());

            return;       
        }

        if (user_name.length < 2)
        {
            alert("User name is too short");

            i_callback_login_if_possible(LoginLogout.getErrorMsgLoggedInNameTooShort());

            return;
        }        

        if (!LoginLogout.execApplicationOnServer())
        {
            this.simulateLoginIfPossible(i_callback_login_if_possible);

            return;
        }

        $.post
        ('Php/LoginLogout.php',
        {
			exec_case: LoginLogout.execPhpCaseLoginIfPossible(),
			
            user_name: user_name,

            logged_in_name: "LoggedInNameNotUsed",

            user_logged_in: this.userIsLoggedInStr(),
            
            name_nobody: LoginLogout.loginNameNobody(),
			
			file_login_logout: LoginLogout.getLoginLogoutFileName(),

            error_message_one: LoginLogout.getErrorMsgLoggedInNameTooShort(),

            error_message_two: "ErrorMessageNotUsed"
        },
        function(reply_str, status_str)
        {
            if (status_str == "success")
            {
                var logged_in_name = LoginLogout.extractLoggedInName(reply_str);

                var flag_logged_in = LoginLogout.extractUserLoggedInFlag(reply_str);

                i_callback_login_if_possible(logged_in_name, flag_logged_in);
            }
            else
            {
                var reply_trim_str = LoginLogout.removePhpEchoNewRowAndSpaces(reply_str);

 				alert("Error JazzLogin.loginIfPossible: " + reply_trim_str);
					
                i_callback_login_if_possible(LoginLogout.getErrorMsgloginIfPossible(), false);
            }   

        } // function
        ); // post


    } // loginIfPossible

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Login If Possible ///////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////  
    
    
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Click Login Logout ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////    

    // Click Login Logout. The callback functions returns the name of the logged in person
	clickLoginLogoutButton(i_callback_click_login_logout)
    {

        var user_name = this.getUserName();


        if (user_name == LoginLogout.UserNameIsUndefined())
        {
            alert("clickLoginLogoutButton Programming error: User name is undefined (= " + LoginLogout.UserNameIsUndefined());

            i_callback_click_login_logout(LoginLogout.getErrorMsgUserNameIsUndefined(), false, "");

            return;       
        }

        if (user_name.length < 2)
        {
            alert("User name is too short");

            i_callback_click_login_logout(LoginLogout.getErrorMsgLoggedInNameTooShort(), false, "");

            return;
        }        

        if (!LoginLogout.execApplicationOnServer())
        {
            this.simulateClickLoginLogoutButton(i_callback_click_login_logout);

            return;
        }

        $.post
        ('Php/LoginLogout.php',
        {
			exec_case: LoginLogout.execPhpCaseClickLoginLogoutButton(),
			
            user_name: user_name,

            logged_in_name: "LoggedInNameNotUsed",

            user_logged_in: this.userIsLoggedInStr(),
            
            name_nobody: LoginLogout.loginNameNobody(),
			
			file_login_logout: LoginLogout.getLoginLogoutFileName(),

            error_message_one: LoginLogout.getErrorMsgLoggedInNameTooShort(),

            error_message_two: "ErrorMessageNotUsed"
        },
        function(reply_str, status_str)
        {
            if (status_str == "success")
            {
                var logged_in_name = LoginLogout.extractLoggedInName(reply_str);

                var flag_logged_in = LoginLogout.extractUserLoggedInFlag(reply_str);

                var warning_msg = LoginLogout.getWarningMessage(reply_str);

                i_callback_click_login_logout(logged_in_name, flag_logged_in, warning_msg);
            }
            else
            {
                var reply_trim_str = LoginLogout.removePhpEchoNewRowAndSpaces(reply_str);

                alert("Error JazzLogin.clickLoginLogoutButton: " + reply_trim_str);
                
                i_callback_click_login_logout(LoginLogout.getErrorMsgclickLoginLogoutButton(), false, "");
            }   

        } // function
        ); // post


    } // clickLoginLogoutButton

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Click Login Logout //////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////     

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Get Logged In Name ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////    

    // Get the logged in name
	getLoggedInName(i_callback_get_logged_in_name)
    {
        var user_name = this.getUserName();

        if (user_name == LoginLogout.UserNameIsUndefined())
        {
            var b_not_logged_in = false;

            i_callback_get_logged_in_name(user_name, b_not_logged_in);

            return;
        }

        if (!LoginLogout.execApplicationOnServer())
        {
            var b_user_is_logged_in = false;

            if (this.m_logged_in_simulation == user_name)
            {
                b_user_is_logged_in = true;
            }

            i_callback_get_logged_in_name(this.m_logged_in_simulation, b_user_is_logged_in);

            return;
        }

        $.post
        ('Php/LoginLogout.php',
        {
			exec_case: LoginLogout.execPhpCaseGetLoggedInName(),
			
            user_name: user_name,

            logged_in_name: "LoggedInNameNotUsed",

            user_logged_in: this.userIsLoggedInStr(),

            name_nobody: LoginLogout.loginNameNobody(),
			
			file_login_logout: LoginLogout.getLoginLogoutFileName(),

            error_message_one: "ErrorMessageNotUsed",

            error_message_two: "ErrorMessageNotUsed"
        },
        function(reply_str, status_str)
        {
            if (status_str == "success")
            {
                var logged_in_name = LoginLogout.extractLoggedInName(reply_str);

                var flag_logged_in = LoginLogout.extractUserLoggedInFlag(reply_str);

                i_callback_get_logged_in_name(logged_in_name, flag_logged_in);

            }
            else
            {
                var reply_trim_str = LoginLogout.removePhpEchoNewRowAndSpaces(reply_str);

 				alert("Error JazzLogin.getLoggedInName: " + reply_trim_str);
					
                i_callback_get_logged_in_name(LoginLogout.getErrorMsgGetLoggedInName(), false);
            }   

        } // function
        ); // post


    } // getLoggedInName

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Get Logged In Name //////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////// 

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Set Logged In Name ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////    

    // Set the logged in name
	setLoggedInName(i_logged_in_name, i_callback_set_logged_in_name)
    {
        if (i_logged_in_name.length < 2)
        {
            alert("Input logged in name is too short");
            i_callback_set_logged_in_name(LoginLogout.getErrorMsgLoggedInNameTooShort());
        }
        var user_name = this.getUserName();

        if (!LoginLogout.execApplicationOnServer())
        {
            i_callback_set_logged_in_name(i_logged_in_name);

            return;
        }

        $.post
        ('Php/LoginLogout.php',
        {
			exec_case: LoginLogout.execPhpCaseSetLoggedInName(),
			
            user_name: user_name,

            logged_in_name: i_logged_in_name,

            user_logged_in: this.userIsLoggedInStr(),
            
            name_nobody: LoginLogout.loginNameNobody(),
			
			file_login_logout: LoginLogout.getLoginLogoutFileName(),

            error_message_one: LoginLogout.getErrorMsgLoggedInNameTooShort(),

            error_message_two: "ErrorMessageNotUsed"
        },
        function(reply_str, status_str)
        {
            if (status_str == "success")
            {
                var reply_trim_str = LoginLogout.removePhpEchoNewRowAndSpaces(reply_str);

                i_callback_set_logged_in_name(reply_trim_str);
            }
            else
            {
                var reply_trim_str_error = LoginLogout.removePhpEchoNewRowAndSpaces(reply_str);

 				alert("Error JazzLogin.setLoggedInName: " + reply_trim_str_error);
					
                i_callback_set_logged_in_name(LoginLogout.getErrorMsgSetLoggedInName());
            }   

        } // function
        ); // post

    } // setLoggedInName

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Set Logged In Name //////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////// 

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Set Get ///////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    // Sets the div element container 
    setDivContainerElement()
    {
        this.m_el_div_container = document.getElementById(this.m_id_div_container);

    } // setDivContainerElement

    // Gets the div element container 
    getDivContainerElement()
    {
        return this.m_el_div_container;

    } // setDivContainerElement        

    // Returns the user name
    getUserName()
    {
        return this.m_user_name;

    } // getUserName

    // Sets the user name
    setUserName(i_user_name)
    {
        this.m_user_name = i_user_name;

    } // setUserName    

    // Returns true if user is logged in
    userIsLoggedIn()
    {
        return this.m_user_is_logged_in;

    } // userIsLoggedIn

   // Returns TRUE if user is logged in and FALSE if not
   userIsLoggedInStr()
   {
       if (this.m_user_is_logged_in)
       {
           return "TRUE";
       }
       else
       {
        return "FALSE";
       }

   } // userIsLoggedInStr    

    // Set the flag telling if the user is logged in
    setUserIsLoggedIn(i_b_logged_in)
    {
        this.m_user_is_logged_in = i_b_logged_in;

    } // setUserIsLoggedIn

    // Get elements inside the container <div>
    // =======================================

    // Get element <button>
    getButtonElement()
    {
        var div_container_el = this.getDivContainerElement();

        var button_elements = div_container_el.getElementsByTagName("button");

        var button_element = button_elements[0];    
        
        return button_element;

    } // getButtonElement

    // Get element <label>
    getLabelElement()
    {
        var div_container_el = this.getDivContainerElement();

        var label_elements = div_container_el.getElementsByTagName("label");

        var label_element = label_elements[0];    
        
        return label_element;

    } // getLabelElement

    // Get element <input>
    getInputElement()
    {
        var div_container_el = this.getDivContainerElement();

        var input_elements = div_container_el.getElementsByTagName("input");

        var input_element = input_elements[0];    
        
        return input_element;        

    } // getInputElement


    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Set Get /////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////    

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Controls //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    
    ///////////////////////// Start Main Function /////////////////////////////////////////  

    // Creates and sets the controls, i.e. the content of the div element container 
    // Please note that button will be appended, while the div element container already has an element
    // The way that append is implemented makes it necessary to empty the container before recreation
    createSetControls(i_login_name)
    {

        if (!this.createSetControlsInputCheck(i_login_name))
        {
            alert("JazzLogin.createSetControls Input data is not OK");

            return;
        }

        var div_container_el = this.getDivContainerElement();

        div_container_el.innerHTML = "";

        this.m_text_box = new JazzTextBox(this.m_id_text_box_login_name, this.m_id_div_container);

        this.m_text_box.setLabelTextPositionLeft();

        this.m_text_box.setSize("10");

        this.m_text_box.setReadOnlyFlag(true);
        if (i_login_name == LoginLogout.UserNameIsUndefined())
        {
            this.m_text_box.setValue(this.m_value_login_nobody_logged_in);

            this.m_text_box.setLabelText(this.m_label_login_nobody_logged_in);
    
            this.m_text_box.setTitle(this.m_tooltip_button_user_name); 

            LoginLogout.debugToConsole('createSetControls i_login_name= ' + LoginLogout.UserNameIsUndefined() + ' (1)');
        }              
        else if (i_login_name == this.getUserName())
        {
            this.m_text_box.setValue(i_login_name);

            this.m_text_box.setLabelText(this.m_label_login_your_name);
    
            this.m_text_box.setTitle(this.m_tooltip_login_your_name);
        }
        else if (i_login_name == LoginLogout.loginNameNobody())
        {
            this.m_text_box.setValue(this.m_value_login_nobody_logged_in);

            this.m_text_box.setLabelText(this.m_label_login_nobody_logged_in);

            this.m_text_box.setTitle(this.m_tooltip_login_nobody_logged_in);
        }
        else
        {
            this.m_text_box.setValue(i_login_name);

            this.m_text_box.setLabelText(this.m_label_login_other_name);
    
            this.m_text_box.setTitle(this.m_tooltip_login_other_name);
        }

        this.m_login_logout_button = new JazzButton(this.m_id_button_login_logout, this.m_id_div_container);

        this.m_login_logout_button.setOnclickFunctionName(this.m_button_event_function_name);

        if (i_login_name == LoginLogout.UserNameIsUndefined())
        {
            this.m_login_logout_button.setCaption(this.m_caption_user_name);
    
            this.m_login_logout_button.setTitle(this.m_tooltip_button_user_name); 

            LoginLogout.debugToConsole('createSetControls i_login_name= ' + LoginLogout.UserNameIsUndefined() + ' (2)');
        }      
        else if (i_login_name == this.getUserName())
        {
            this.m_login_logout_button.setCaption(this.m_caption_logout);
    
            this.m_login_logout_button.setTitle(this.m_tooltip_button_logout); 
        }
        else if (i_login_name == LoginLogout.loginNameNobody())
        {
            this.m_login_logout_button.setCaption(this.m_caption_login);
    
            this.m_login_logout_button.setTitle(this.m_tooltip_button_login); 
        }        
        else
        {
            this.m_login_logout_button.setCaption(this.m_caption_force_login);
    
            this.m_login_logout_button.setTitle(this.m_tooltip_button_force_login );
        }

        this.setElementStyles(i_login_name);

    } // createSetControls

    // Checks the input data for createSetControls
    createSetControlsInputCheck(i_login_name)
    {
        return true; // TODO

    } // createSetControlsInputCheck

     ///////////////////////// End Main Function ///////////////////////////////////////////  

     ///////////////////////// Start Styles ////////////////////////////////////////////////  

    // Set element styles
    setElementStyles(i_login_name)
    {
        this.setElementColors(i_login_name);

        var div_container_el = this.getDivContainerElement();

        var button_el = this.getButtonElement();

        var label_el = this.getLabelElement();

        var input_el = this.getInputElement();   
        
        div_container_el.style.fontSize = "12px";

        div_container_el.style.clear = "both";

        button_el.style.marginLeft = "12px";

        button_el.style.minWidth = "114px";

        button_el.style.textAlign = "center";

        label_el.style.marginRight = "10px";

        input_el.style.textAlign = "center";

    } // setElementStyles

    // Set element colors
    setElementColors(i_login_name)
    {
        this.setColorButton(i_login_name);

        var div_container_el = this.getDivContainerElement();

        var label_el = this.getLabelElement();

        var input_el = this.getInputElement();

        var button_el = this.getButtonElement();

        div_container_el.style.backgroundColor = this.m_container_color;

        label_el.style.backgroundColor = this.m_label_color;

        input_el.style.backgroundColor = this.m_input_color;

        button_el.style.cursor = "pointer";

    } // setElementColors


    // Sets the color of the login logout button
    setColorButton(i_login_name)
    {
        var button_el = this.getButtonElement();

        if (i_login_name == this.getUserName())
        {
            button_el.style.backgroundColor = this.m_button_color_logout;
        }
        else
        {
            button_el.style.backgroundColor = this.m_button_color;
        }

    } // setColorButton

     ///////////////////////// End Styles //////////////////////////////////////////////////  

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Controls ////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Strings ///////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    // Returns the message flag that nobody is logged in
    static loginNameNobody()
    {
        return "NobodyIsLoggedIn";

    } // loginNameNobody

    // Returns the message flag that the user name is undefined
    static UserNameIsUndefined()
    {
        return "UserNameIsUndefined";

    } // UserNameIsUndefined

    // PHP execution case get the name of the person that is logged in
    static execPhpCaseGetLoggedInName()
    {
        return "ExecGetLoggedIn";

    } // execPhpCaseGetLoggedInName

    // PHP execution case click login logout button
    static execPhpCaseClickLoginLogoutButton()
    {
        return "ExecClickLoginLogout";

    } // execPhpCaseClickLoginLogoutButton

    // PHP execution case set the name of the person that is logged in
    static execPhpCaseSetLoggedInName()
    {
        return "ExecSetLoggedIn";

    } // execPhpCaseSetLoggedInName    

    // PHP execution case login if possible
    static execPhpCaseLoginIfPossible()
    {
        return "ExecLoginIfPossible";

    } // execPhpCaseLoginIfPossible    

    // Returns the name of the file that holds the name of the logged in person
    static getLoginLogoutFileName()
    {
        return "Data/LoginLogout.txt";

    } // getLoginLogoutFileName

    // Returns the error message PHP failure for GetLoggedInName
    static getErrorMsgGetLoggedInName()
    {
        return "PhpErrorGetLoggedInName";

    } // getErrorMsgGetLoggedInName

    // Returns the error message PHP failure for SetLoggedInName
    static getErrorMsgSetLoggedInName()
    {
        return "PhpErrorSetLoggedInName";

    } // getErrorMsgSetLoggedInName    

    // Returns the error message logged in name ist too short (not set)
    static getErrorMsgLoggedInNameTooShort()
    {
        return "PhpErrorGetLoggedInName";

    } // getErrorMsgLoggedInNameTooShort

     // Returns the error message logged in name is undefined (not set)
     static getErrorMsgUserNameIsUndefined()
     {
         return "PhpErrorGetLoggedInName";
 
     } // getErrorMsgUserNameIsUndefined
    
    // Warning message when somebody else forced a login
    static otherForcedLoginMessage()
    {
        return  "Jemand anders hat das Login übernommen." + 
        "\nDu bist nicht länger eingeloggt.";      
    } // otherForcedLoginMessage    

    // Warning message when somebody else forced a login and then logged out
    static otherForcedLoginLoggedOutMessage()
    {
        return  "Nur als Information. Diese Mitteilung ist eigentlich unnötig." + 
        "\nJemand anders hat das Login übernommen und danach ausgeloggt," + 
        "\nund du bist wieder eingeloggt.";      
    } // otherForcedLoginLoggedOutMessage 

    // Warning message when the user forced a login and then logged out
    static userForcedLoginLoggedOutMessage()
    {
        return  "Du hast das Login übernommen." + 
        "\nDie vorher eingeloggte Person kann jetzt keine Änderungen speichern";      
    } // userForcedLoginLoggedOutMessage 

    static saveNotPossibleOtherIsloggedIn()
    {
        return "Speichern ist nicht möglich, weil du nicht länger eingeloggt bist." +
             "\nNach 15 Minuten inaktivität können andere dein Login übernehmen.";  

    } // saveNotPossibleOtherIsloggedIn

    // Returns the message that changes only are allowed after login
    static changeNotPossibleOtherIsloggedIn()
    {
        return "Diese Änderung ist nicht möglich, weil du nicht eingeloggt bist.";  

    } // changeNotPossibleOtherIsloggedIn    

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Strings /////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Utility Functions /////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////    

    // Remove new lines before and after the content
    static removePhpEchoNewRowAndSpaces(i_reply_str)
    {
        var ret_str = '';

        ret_str = i_reply_str.trim();

        return ret_str;

    } // removePhpEchoNewRowAndSpaces    

    // Returns true if the application runs on the server
    static execApplicationOnServer()
    {
        var current_base = window.location.href;

        var server_url = 'jazzliveaarau.ch';

        var index_url = current_base.indexOf(server_url);

        if (index_url >= 0) 
        {
            return true;
        }
        else
        {
            return false;
        }

    } // execApplicationOnServer

    // Extracts the login name from the input echo string
    static extractLoggedInName(i_reply_str)
    {
        var reply_trim_str = LoginLogout.removePhpEchoNewRowAndSpaces(i_reply_str);

        var ret_login_name = reply_trim_str;

        var index_underscore = reply_trim_str.indexOf("_");

        if (index_underscore < 0)
        {
            return ret_login_name;
        }

        ret_login_name = ret_login_name.substring(0, index_underscore);

        return ret_login_name;

    } // extractLoggedInName

    // Extracts the execution case from the input echo string and 
    // returns the flag telling if the user has logged in
    static extractUserLoggedInFlag(i_reply_str)
    {
        var ret_user_logged_in = false;

        var reply_trim_str = LoginLogout.removePhpEchoNewRowAndSpaces(i_reply_str);

        var index_underscore = reply_trim_str.indexOf("_");

        if (index_underscore < 0)
        {
            return ret_user_logged_in;
        }

        var exec_case_str = reply_trim_str.substring(index_underscore + 1);

        if (exec_case_str == "user")
        {
            ret_user_logged_in = true;
        }
        else if (exec_case_str == "login")
        {
            ret_user_logged_in = true;
        }
        else if (exec_case_str == "myself")
        {
            ret_user_logged_in = true;
        }
        else if (exec_case_str == "other")
        {
            ret_user_logged_in = false;
        }
        else if (exec_case_str == "outlogged-free")
        {
            ret_user_logged_in = true;
        }
        else if (exec_case_str == "forced")
        {
            ret_user_logged_in = true;
        }
        else if (exec_case_str == "outlogged")
        {
            ret_user_logged_in = false;
        }
        else if (exec_case_str == "logout")
        {
            ret_user_logged_in = false;
        }
        else
        {
            alert("Error LoginLogout.extractUserLoggedInFlag Not an implemented case " + exec_case_str);

            ret_user_logged_in = false;
        }

        return ret_user_logged_in;

    } // extractLoggedInName    

    // Returns a warning message 
    static getWarningMessage(i_reply_str)
    {
        var ret_warning_msg = "";

        var reply_trim_str = LoginLogout.removePhpEchoNewRowAndSpaces(i_reply_str);

        var index_underscore = reply_trim_str.indexOf("_");

        if (index_underscore < 0)
        {
            return ret_warning_msg;
        }

        var exec_case_str = reply_trim_str.substring(index_underscore + 1);

        var b_debug = false; // QQQQQQQQQQQQQQQQQQQQQQQQQQQ

        if (exec_case_str == "outlogged-free")
        {
            ret_warning_msg = LoginLogout.otherForcedLoginLoggedOutMessage();
        }
        else if (exec_case_str == "outlogged")
        {
            ret_warning_msg = LoginLogout.otherForcedLoginMessage();
        }
        else if (exec_case_str == "forced")
        {
            ret_warning_msg = LoginLogout.userForcedLoginLoggedOutMessage();
        }

        else if (exec_case_str == "user")
        {
            ret_warning_msg = LoginLogout.getDebugExecMsg(exec_case_str, b_debug);
        }
        if (exec_case_str == "login")
        {
            ret_warning_msg = LoginLogout.getDebugExecMsg(exec_case_str, b_debug);
        }
        else if (exec_case_str == "myself")
        {
            ret_warning_msg = LoginLogout.getDebugExecMsg(exec_case_str, b_debug);
        }
        else if (exec_case_str == "other")
        {
            ret_warning_msg = LoginLogout.getDebugExecMsg(exec_case_str, b_debug);
        }
        else if (exec_case_str == "logout")
        {
            ret_warning_msg = LoginLogout.getDebugExecMsg(exec_case_str, b_debug);
        }

        return ret_warning_msg;

    } // getWarningMessage

    static getDebugExecMsg(i_exec_case_str, i_b_debug)
    {
        if (i_b_debug)
        {
            return "Exec case is " + i_exec_case_str;
        }
        else
        {
            return "";
        }

    } // getDebugExecMsg

    // Writes debug to the console
    static debugToConsole(i_msg_str)
    {
        console.log('LoginLogout:' + i_msg_str);

    } // debugToConsole    
    
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Utility Functions ///////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////  

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Simulation Functions //////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////// 
    
    // Simulate a logged in name
    static simulateGetLoggedInName()
    {
        var ret_logged_in_name = "";

        var user_login_name = g_web_login_logout.getUserNameObject().getUserName();

        var vorstands_array = [];
        vorstands_array[0] = "Laura";
        vorstands_array[1] = "Maria";
        vorstands_array[2] = "Alex";
        vorstands_array[3] = "Gunnar";
        vorstands_array[4] = "Markus";
        vorstands_array[5] = "Hubert";
        vorstands_array[6] = "Hanni";

        var random_value_1 = Math.random();

        if (random_value_1 < 0.5) 
        {
            ret_logged_in_name = user_login_name;
        }
        else
        {
            var random_value_2 = Math.random();

            var index_float = 0.7*random_value_2*10.0;
        
            var index_vorstand = Math.floor(index_float);
        
            if (index_vorstand > 6)
            {
                index_vorstand = 6;
            }
        
            ret_logged_in_name = vorstands_array[index_vorstand];
        }

        return ret_logged_in_name;

    } // simulateGetLoggedInName

    // Simulates loginIfPossible(. This is the the function that is called when the 
    // user starts the application. For the tests this corresponds to reload application
    simulateLoginIfPossible(i_callback_login_if_possible)
    {
        var user_name = this.getUserName();

        var in_file_logged_in_name = this.m_logged_in_simulation;

        if (in_file_logged_in_name.length == 0)
        {
            in_file_logged_in_name = LoginLogout.loginNameNobody();
        }

        var logged_in_name = "";

        var random_if_possible = Math.random();

        if (random_if_possible < 0.25)
        {
            logged_in_name = LoginLogout.simulateGetLoggedInName();
        }
        else
        {
            logged_in_name = user_name;
        }

        this.m_logged_in_simulation = logged_in_name;

        if (logged_in_name == user_name)
        {
            i_callback_login_if_possible(user_name, true);
        }
        else
        {
            i_callback_login_if_possible(logged_in_name, false);
        }

    } // simulateLoginIfPossible

    // Simulates a click on the login/logout button
    simulateClickLoginLogoutButton(i_callback_click_login_logout)
    {
        var user_name = this.getUserName();

        var logged_in_name = this.simulateChangeOfLogggedInName();

        var user_is_logged_in = this.userIsLoggedIn();

        if (user_is_logged_in && logged_in_name == user_name)
        {
            // User i logged in and nobody else hs logged in, i.e. the user can logout
            // and nobody is has logged out

            this.m_logged_in_simulation = LoginLogout.loginNameNobody();

            i_callback_click_login_logout(LoginLogout.loginNameNobody(), false, "");
        }
        else if (user_is_logged_in && logged_in_name != user_name)
        {
            // The user is logged in but somebody else has logged out the user. The user gets
            // a warning and the name of the logged in person will be displayed

            this.m_logged_in_simulation = logged_in_name;

            i_callback_click_login_logout(logged_in_name, false, LoginLogout.otherForcedLoginMessage());
        }
        else if (!user_is_logged_in && logged_in_name == LoginLogout.loginNameNobody())
        {
            // The user is not logged in ant in the file nobody is registered, i.e. the user can login.
            // This is the normal case. It is not likely that two persons work at the same time, nor
            // that somebody forgets to logout

            this.m_logged_in_simulation = user_name;

            i_callback_click_login_logout(user_name, true, "");
        }
        else if (!user_is_logged_in && logged_in_name != user_name)
        {
            // The user is not logged in and another person is logged in. The user decides to force a login.
            // The user gets a message that he logged out the other person

            this.m_logged_in_simulation = user_name;

            i_callback_click_login_logout(user_name, true, LoginLogout.userForcedLoginLoggedOutMessage());
        }
        else if (user_is_logged_in && logged_in_name == LoginLogout.loginNameNobody())
        {
            // The user is logged in but the registration file say that nobody is logged in.
            // This means that somebody else took over the login and then logged out. 
            // The user gets informed about this and the user can login

            this.m_logged_in_simulation = user_name;

            i_callback_click_login_logout(user_name, true, LoginLogout.otherForcedLoginLoggedOutMessage());
        }
        else
        {
            alert("simulateClickLoginLogoutButton Error logged_in_name= " + logged_in_name + 
            " userIsLoggedInStr= " + user_is_logged_in.toString() + " user_name= " + user_name);
        }

    } // simulateClickLoginLogoutButton

    // Returns login name: Simulates a change
    simulateChangeOfLogggedInName()
    {
        var ret_logged_in_name = "";

        var user_name = this.getUserName();

        var user_is_logged_in = this.userIsLoggedIn();

        var in_file_logged_in_name = this.m_logged_in_simulation;

        if (in_file_logged_in_name.length == 0)
        {
            alert("simulateChangeOfLogggedInName Error m_logged_in_simulation");

            in_file_logged_in_name = user_name;
        }

        if (user_is_logged_in)
        {
            var random_value_change_in = Math.random();

            if (random_value_change_in < 0.8)
            {
                ret_logged_in_name = in_file_logged_in_name;
            }
            else if (random_value_change_in < 0.9)
            {
                ret_logged_in_name = LoginLogout.loginNameNobody();
            }
            else
            {
                ret_logged_in_name = LoginLogout.simulateGetLoggedInName();
            }
        } // user_is_logged_in
        else
        {
            var random_value_change_not = Math.random();

            if (random_value_change_not < 0.9)
            {
                ret_logged_in_name = LoginLogout.loginNameNobody();
            }
            else 
            {
                ret_logged_in_name = LoginLogout.simulateGetLoggedInName();
            }
        }


        return ret_logged_in_name;

    } // simulateChangeOfLogggedInName

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Simulation Functions ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////// 

} // class LoginLogout

//  Class handling user name as a local storage parameter

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start User Name /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Class with variables an functions that handle login and logout
// Here is a sample how an object of the class can be created:
// var object_user_name = new JazzUserName();
class JazzUserName
{
    // Function that is executed when an object of this class is created
    // Variables are defined and two inititialization functions are executed
    // Input parameters
    constructor(i_application_xml)
    {
        // Member variables
        // ================

        // Application XML object
        this.m_application_xml = i_application_xml;

        // User name
        this.m_user_name = "";

        // windows.localStorage key
        this.m_local_storage_jazz_user_name = "jazz_user_name_str";

        // Initialization functions
        // ========================

        // Keine 

    } // constructor

    // Member get and set functions
    // ============================

    // Get the user name from the local storage. 
    // If not yet stored, request name from the user, store and return it
    // 1. Return m_user_name if it is set
    // 2. If the user name not yet was saved in the computer, return JazzUserName.getUserNameNotYetSet
    // 3. If the user name is saved in the computer
    // 3.1 Set m_user_name with this name
    // 3.2 Return m_user_name
    // 4. 
    getUserName()
    {
        if (this.m_user_name.length > 0)
        {
            JazzUserName.debugToConsole('getUserName m_user_name= ' + this.m_user_name);

            return this.m_user_name;
        }

        var user_name_local_storage = localStorage.getItem(this.m_local_storage_jazz_user_name);

        if (user_name_local_storage == null)
        {
            var user_name_init = JazzUserName.getUserNameNotYetSet();

            JazzUserName.debugToConsole('getUserName user_name_init= ' + user_name_init);

            return user_name_init;
        }

        if (user_name_local_storage.length > 0)
        {
            this.setUserName(user_name_local_storage);

            return user_name_local_storage;
        }

        var user_name = JazzUserName.getUserNameNotYetSet();

        JazzUserName.debugToConsole('getUserName user_name= ' + user_name);

        return user_name;
        
    } // getUserName

    // Set user name
    setUserName(i_user_name)
    {
        this.m_user_name = i_user_name;

    } // setUserName

    // Returns true if user name not is saved and prompt the user to login
    // Returns false if the user name has been saved
    userNameIsNotSaved()
    {
        var user_name = this.getUserName();

        if (user_name == JazzUserName.getUserNameNotYetSet())
        {
            alert(JazzUserName.getUserNameNotSavedError());

            return true;
        }
        else
        {
            return false;
        }

    } // userNameIsNotSaved

    // Utility functions
    // -----------------

    // Request and set user name
    // The calling function should use the returned user name and not m_user_name
    // set by setUserName. 
    requestSetUserName()
    {
        var user_name_requested = this.requestUserName();

        if (user_name_requested.length > 0)
        {
            localStorage.setItem(this.m_local_storage_jazz_user_name, user_name_requested);

            this.setUserName(user_name_requested);    

            JazzUserName.debugToConsole('requestSetUserName Local storage name: user_name_requested= ' + user_name_requested);
            
            return user_name_requested;
        }
        else
        {
            return JazzUserName.getUserNameNotYetSet();
        }  

    } // requestSetUserName    

    // Request user name
    // Returns empty string for failure
    requestUserName()
    {
        var user_name_password = prompt(JazzUserName.getPromptUserName(), "");

        var ret_user_name = JazzUserName.getFirstWord(user_name_password);

        var user_password = JazzUserName.getSecondWord(user_name_password);

        var b_name_password = this.m_application_xml.namePasswordIsOk(ret_user_name, user_password);

        if (!b_name_password)
        {
            // alert("Name= " + user_name + " und/oder Passwort= " + user_password + " sind NICHT OK");

            ret_user_name = "";

            alert(JazzUserName.getUserNamePasswortError());
  
        }

        JazzUserName.debugToConsole('requestUserName ret_user_name= ' + ret_user_name.trim());

        return ret_user_name.trim();

    } // requestUserName

    // Return the first word
    static getFirstWord(i_name_password)
    {
        var ret_first_word = '';

        if (null == i_name_password)
        {
            ret_first_word = '';
        }
        else if (i_name_password.length == 0)
        {
            ret_first_word = "";
        }
        else
        {
            var name_password_trim = i_name_password.trim();

            var index_space = name_password_trim.indexOf(' ');

            if (name_password_trim.length == 0)
            {
                ret_first_word = '';
            }
            else if (index_space < 0 && name_password_trim.length > 0)
            {
                ret_first_word = name_password_trim;
            }
            else
            {
                ret_first_word = name_password_trim.substring(0, index_space);
            }
        }

        JazzUserName.debugToConsole('getFirstWord ret_first_word= ' + ret_first_word);

        return ret_first_word;
 
    } // getFirstWord

    // Returns the second word
    static getSecondWord(i_name_password)
    {
        var ret_second_word = '';

        var first_word = this.getFirstWord(i_name_password);

        if (first_word.length == 0)
        {
            ret_second_word = '';
        }
        else
        {
            var index_first = i_name_password.indexOf(first_word);

            var length_first = first_word.length;

            var removed_first = i_name_password.substring(index_first + length_first + 1);

            var removed_first_trim = removed_first.trim();

            if (removed_first_trim.length == 0)
            {
                ret_second_word = '';
            }
            else
            {
                ret_second_word = removed_first_trim;
            }
        }

        JazzUserName.debugToConsole('getSecondWord ret_second_word= ' + ret_second_word);

        return ret_second_word;

    } // getSecondWord

    // Returns true if user name is OK
    // This function is for the moment not used since member data names are used
    static checkUserName(i_user_name_trim)
    {
        if (i_user_name_trim.length == 0)
        {
            alert(JazzUserName.getUserNameErrorUserNameEmpty());

            return false;
        }

        if (i_user_name_trim.length < 2)
        {
            alert(JazzUserName.getUserNameErrorUserNameTooShort());

            return false;
        }

        var index_space = i_user_name_trim.indexOf(" ");

        if (index_space >= 0)
        {
            alert(JazzUserName.getUserNameErrorContainsSpaces());

            return false;
        }

        return true;

    } // checkUserName

    // Strings and messages
    // --------------------

    // Returns the prompt string for user name and password
    static getPromptUserName()
    {
        return "Bitte Name, Leerschlag und Passwort eingeben (die gleiche" +
        "\nLogin-Daten wie für die Homepage)." + 
        "\nDer Name wird für das Backup von DOCs vervendet und" + 
        "\nfür Login. Der Name wird im Computer gespeichert." +
        "\nNach Cache löschen muss er wieder eingegeben werden.";

    } // getPromptUserName

    // Returns the error message that the input name string is empty
    static getUserNameErrorUserNameEmpty()
    {
        return "Benutzer-Name ist leer";

    } // getUserNameErrorUserNameEmpty

    // Returns the error message that the user name is too short
    static getUserNameErrorUserNameTooShort()
    {
        return "Min Anzahl Buchstaben des Benutzer-Names ist zwei (2)";

    } // getUserNameErrorUserNameTooShort

    // Returns the error message that the user name are two or more name
    static getUserNameErrorContainsSpaces()
    {
        return "Benutzer-Name enthält Leerschlag";

    } // getUserNameErrorContainsSpaces    

    // Returns the error message user name and/or password not OK
    static getUserNamePasswortError()
    {
        return "Name und/oder Passwort ist nicht OK." + 
        "\nEingabe Daten sollen gleich sein als für Homepage Login.";

    } // getUserNameErrorContainsSpaces    

    // Returns the error message user name not yet saved
    static getUserNameNotSavedError()
    {
        return "Der Benutzername ist noch nicht gespeichert." + 
        "\nBitte mit Benutzername und Passwort einloggen";

    } // getUserNameNotSavedError    

    // Returns user name (flag) telling that user name not yet is set
    static getUserNameNotYetSet()
    {
        return "UserNameNotYetSet";

    } // getUserNameNotYetSet        

    // Writes debug to the console
    static debugToConsole(i_msg_str)
    {
        console.log('JazzUserName:' + i_msg_str);

    } // debugToConsole

} // JazzUserName

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End User Name ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Control Text Box //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Class that creates a text box
// The code that will be generated is 
// <label for="id_text_box">Label text</label>
// <input type="text" id="id_text_box" value="My remark" size="20" maxlength="30" oninput="myFunction()" title="Tip ...">  
// Compulsary input is the identity of the text box and the container 
// (normally a <div> element), where the text box shall be placed 
// Here is a sample how an object of the class can be created:
// var remark_text_box = new JazzTextBox("id_remark_text_box", "i_id_container")
class JazzTextBox 
{
    // Function that is executed when an object of this class is created
    constructor(i_id_text_box, i_id_div_container) 
    {
        // Member variables
        // ================

        // The identity of the text box
        this.m_id_text_box = i_id_text_box;

        // The identity of the container for the text box
        this.m_id_div_container = i_id_div_container;

        // The container element for the text box
        this.m_el_div_container = null;

        // The class for the text box
        this.m_class = '';
    
        // The value of the text box
        this.m_value = '';

        // The oninput function name. Only the name is input
        this.m_oninput_function = '';

        // Flag telling if the text box shall be read only
        this.m_read_only_flag = false;        

        // Label text
        this.m_label_text = '';

        // Label position relative the text box
        // left: Left of box right: Right of box above: Above box
        // Default is left of the text box
        this.m_label_text_position = 'left'; 

        // Size of the text box. Size is the number of characters
        // If size not is set there will be no attribute size= "20"
        // Then the default value for the browser application will be the size
        this.m_text_box_size = '';

        // Maximum length (number of characters) of the input string 
        // If the maximum length not is defined there will be no attribute maxlength= "30"
        // Then the default value for the browser application will be the maximum length
        this.m_maxlength = '';

        // The title attribute specifies extra information about an element.
        // The information is most often shown as a tooltip text when the mouse 
        // moves over the element.
        this.m_title = '';

        // Inner elements of start input m_el_div_container
        this.m_div_container_inner_html_start = "";

        // Initialization
        // ==============        

        this.setDivContainerElement();

        this.setDivInnerHtmlStartElements();

        this.setControl();

    } // constructor

    // Set div inner elements if already existing at start
    // Criterion is that '<input' or '<button' is contained in the string 
    // TODO add more elements
    setDivInnerHtmlStartElements()
    {
        var inner_html_start = this.m_el_div_container.innerHTML;

        if (inner_html_start.length > 0)
        {
            var index_input = inner_html_start.indexOf("<input");

            var index_button = inner_html_start.indexOf("<button");

            if (index_input >= 0 || index_button >= 0)
            {
                this.m_div_container_inner_html_start = inner_html_start;
            } // div is set with <input> and/or <button> elements

        } // div is set with something ...

    } // setDivInnerHtmlStartElements

    // Set and get functions
    // =====================

    // Sets the value for the text box 
    setValue(i_value) 
    {
      this.m_value = i_value;

      var element_html = this.getHtmlElement();

      element_html.value = this.m_value;

      // Not necessary this.setControl();

    } // setValue

    // Returns the value of the text box
    getValue()
    {
        var element_html = this.getHtmlElement();

        var value = element_html.value;

        this.setValue(value);

        return this.m_value;

    } // getValue    
    
    // Set functions for the layout member variables
    // =============================================

    // Set the oninput function name. Only the name is input
    setOninputFunctionName(i_oninput_function)
    {
        this.m_oninput_function = i_oninput_function;

        this.setControl();

    } // setOninputFunctionName

    // Sets the class for the text box 
    // There will be no class attribute if this function not is called
    setClass(i_class) 
    {
      this.m_class = i_class;

      this.setControl();

    } // setClass

    // Sets the label text for the text box 
    // There will be no label if the text not is set
    setLabelText(i_label_text) 
    {
      this.m_label_text = i_label_text;

      this.setControl();

    } // setLabelText    

    // Sets the label text to the left of the text box
    setLabelTextPositionLeft(i_label_text) 
    {
        this.m_label_text_position = 'left'; 

        this.setControl();

    } // setLabelTextPositionLeft

    // Sets the label text to the right of the text box
    setLabelTextPositionRight() 
    {
        this.m_label_text_position = 'right'; 

        this.setControl();

    } // setLabelTextPositionRight
    
    // Sets the label text above the text box
    setLabelTextPositionAbove() 
    {
        this.m_label_text_position = 'above'; 

        this.setControl();

    } // setLabelTextPositionAbove
    
    // Sets the text box size. The size is the number of characters
    setSize(i_text_box_size) 
    {
        this.m_text_box_size = i_text_box_size;
        
        this.setControl();

    } // setSize

    // Sets the maximum length of the input string. 
    // The maximum length value is the number of characters
    setMaxlength(i_maxlength) 
    {
        this.m_maxlength = i_maxlength; 

        this.setControl();

    } // setMaxlength

    // Set read only flag to false or true
    setReadOnlyFlag(i_read_only_flag)
    {
        this.m_read_only_flag = i_read_only_flag; 

        this.setControl();

    } // setReadOnlyFlag

    // Sets the title of this HTML element. The title can be a tool tip
    // In a desktop computer the title is displayed when the mouse is
    // over the HTML element
    setTitle(i_title) 
    {
        this.m_title = i_title; 

        this.setControl();

    } // setTitle

    // Utility functions
    // =================

    // Sets the div element container
    setDivContainerElement()
    {
        this.m_el_div_container = document.getElementById(this.m_id_div_container);

    } // setDivContainerElement

    // Checks
    checkContainerElement()
    {
        var ret_b_check = true;

        if (null == this.m_el_div_container)
        {
            alert("JazzTextBox error: HTML element with id= " + this.m_id_div_container + " does not exist.");

            ret_b_check = false;
        }   
        
        return ret_b_check;

    } // checkContainerElement

    // Sets the control
    // Append if the input div element had elements
    setControl()
    {
        if (!this.checkContainerElement())
        {
            return;
        }

        var html_str = this.getHtmlString();


        if (this.m_div_container_inner_html_start.length > 0)
        {

            var appended_html = this.m_div_container_inner_html_start + html_str;

            this.m_el_div_container.innerHTML = appended_html;
        }
        else
        {
            this.m_el_div_container.innerHTML = html_str;
        }       

    } // setControl

    // Returns the HTML text box element 
    getHtmlElement()
    {
        return document.getElementById(this.m_id_text_box);

    } // getHtmlElement

    // Returns the string that defines the HTML text box string
    // <input type="text" id="id_text_box" value="My remark" size="20" maxlength="30" title="Tip ...">  
    getHtmlString()
    {
        var ret_html_str = '';

        if (this.m_label_text.length > 0 && this.m_label_text_position == 'left')
        {
            ret_html_str = ret_html_str + 
                getHtmlElementLabelString(this.m_label_text, this.m_id_text_box, this.m_title);
        }

        if (this.m_label_text.length > 0 && this.m_label_text_position == 'above')
        {
            ret_html_str = ret_html_str + 
                getHtmlElementLabelString(this.m_label_text, this.m_id_text_box, this.m_title) + '<br>';
        }

        ret_html_str = ret_html_str + '<input type="text" id="' + this.m_id_text_box + '" ';

        if (this.m_class.length > 0)
        {
            ret_html_str = ret_html_str + ' class="' + this.m_class + '" ';
        }        

        ret_html_str = ret_html_str + ' value= "' + this.m_value + '" ';

        if (this.m_text_box_size.length > 0)
        {
            ret_html_str = ret_html_str + ' size="' + this.m_text_box_size + '" ';
        }

        if (this.m_maxlength.length > 0)
        {
            ret_html_str = ret_html_str + ' maxlength="' + this.m_maxlength + '" ';
        }


        if (this.m_oninput_function.length > 0)
        {
            ret_html_str = ret_html_str + ' oninput="' + this.m_oninput_function + '()" ';
        }

        if (this.m_title.length > 0)
        {
            ret_html_str = ret_html_str + ' title="' + this.m_title + '" ';
        }

        if (this.m_read_only_flag)
        {
            ret_html_str = ret_html_str + ' readonly';
        }

        ret_html_str = ret_html_str + '>';

        if (this.m_label_text.length > 0 && this.m_label_text_position == 'right')
        {
            ret_html_str = ret_html_str + 
                getHtmlElementLabelString(this.m_label_text, this.m_id_text_box, this.m_title);
        }

        return ret_html_str;

    } // getHtmlString

} // JazzTextBox

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Control Text Box ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Control Button ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// // Class that creates a button control
class JazzButton 
{
    // Creates the instance of the class
    constructor(i_id_button, i_id_div_container) 
    {
        // Member variables
        // ================

        // The identity of the button control
        this.m_id_button = i_id_button;

        // The identity of the container for the button control
        this.m_id_div_container = i_id_div_container;

        // The container element for the button control
        this.m_el_div_container = null;

        // The class for the button control
        this.m_class = '';

        // The onclick function name. Only the name is input
        this.m_onclick_function = '';

        // The caption for the button
        this.m_caption = '';

        // The width of the button
        this.m_width = '';

        // Label text
        this.m_label_text = '';

        // Label position relative the text box
        // left: Left of box right: Right of box above: Above box
        // Default is left of the text box
        this.m_label_text_position = 'left'; 

        // The title attribute specifies extra information about an element.
        // The information is most often shown as a tooltip text when the mouse 
        // moves over the element.
        this.m_title = '';

        // Inner elements of start input m_el_div_container
        this.m_div_container_inner_html_start = "";
        
        // Initialization
        // ==============

        this.setDivContainerElement();

        this.setDivInnerHtmlStartElements();

        this.setControl();

    } // constructor

    // Set div inner elements if already existing at start
    // Criterion is that '<input' or '<button' is contained in the string 
    // TODO add more elements
    setDivInnerHtmlStartElements()
    {
        var inner_html_start = this.m_el_div_container.innerHTML;

        if (inner_html_start.length > 0)
        {
            var index_input = inner_html_start.indexOf("<input");

            var index_button = inner_html_start.indexOf("<button");

            if (index_input >= 0 || index_button >= 0)
            {
                this.m_div_container_inner_html_start = inner_html_start;
            } // div is set with <input> and/or <button> elements

        } // div is set with something ...

    } // setDivInnerHtmlStartElements

    // Set functions for the layout member variables
    // =============================================

    // Sets the class for the button control 
    // There will be no class attribute if this function not is called
    setClass(i_class) 
    {
      this.m_class = i_class;

      this.setControl();

    } // setClass

    // Sets the caption for the button control 
    // There will be no caption if this function not is called
    setCaption(i_caption) 
    {
      this.m_caption = i_caption;

      this.setControl();

    } // setCaption    

    // Sets the width of a button
    setWidth(i_width)
    {
        this.m_width = i_width;

        this.setControl();

    } // setWidth

    // Sets the label text for the button
    // There will be no label if the text not is set
    setLabelText(i_label_text) 
    {
      this.m_label_text = i_label_text;

      this.setControl();

    } // setLabelText    

    // Sets the label text to the left of the button
    setLabelTextPositionLeft(i_label_text) 
    {
        this.m_label_text_position = 'left'; 

        this.setControl();

    } // setLabelTextPositionLeft

    // Sets the label text to the right of the button
    setLabelTextPositionRight() 
    {
        this.m_label_text_position = 'right'; 

        this.setControl();

    } // setLabelTextPositionRight
    
    // Sets the label text above the text box
    setLabelTextPositionAbove() 
    {
        this.m_label_text_position = 'above'; 

        this.setControl();

    } // setLabelTextPositionAbove    
     // Sets the title of this HTML element. The title can be a tool tip
    // In a desktop computer the title is displayed when the mouse is
    // over the HTML element
    setTitle(i_title) 
    {
        this.m_title = i_title; 

        this.setControl();

    } // setTitle
    
    // Sets the div element container
    setDivContainerElement()
    {
        this.m_el_div_container = document.getElementById(this.m_id_div_container);

    } // setDivContainerElement

    // Returns the button element
    getButtonElement()
    {
        return document.getElementById(this.m_id_button);

    } // getButtonElement

    // Hide the button
    hideButton()
    {
        this.getButtonElement().style.display = 'none';

    } // hideButton

 
    // Display the button
    showButton()
    {
        this.getButtonElement().style.display = 'block';

    } // showButton   

    // Sets the onchange function name. Only the name is input
    setOnclickFunctionName(i_onclick_function) 
    {
      this.m_onclick_function = i_onclick_function;

      this.setControl();

    } // setOnchangeFunctionName     

    // Checks
    checkContainerElement()
    {
        var ret_b_check = true;

        if (null == this.m_el_div_container)
        {
            alert("JazzButton error: HTML element with id= " + this.m_id_div_container + " does not exist.");

            ret_b_check = false;
        }   
        
        return ret_b_check;

    } // checkContainerElement

    // Sets the control
    // Append if input div already had elements
    setControl()
    {
        if (!this.checkContainerElement())
        {
            return;
        }

        var html_str = this.getHtmlString();

        if (this.m_div_container_inner_html_start.length > 0)
        {

            var appended_html = this.m_div_container_inner_html_start + html_str;

            this.m_el_div_container.innerHTML = appended_html;
        }
        else
        {
            this.m_el_div_container.innerHTML = html_str;
        }       

    } // setControl
        
    // Returns the string that defines the HTML button string
    // <button id="id_button" class="cl_button" onclick= "eventXyz" title="Tip ...">Click me</button>  
    getHtmlString()
    {
        var ret_html_str = '';

        if (this.m_label_text.length > 0 && this.m_label_text_position == 'left')
        {
            ret_html_str = ret_html_str + 
                getHtmlElementLabelString(this.m_label_text, this.m_id_button, this.m_title);
        }

        if (this.m_label_text.length > 0 && this.m_label_text_position == 'above')
        {
            ret_html_str = ret_html_str + 
                getHtmlElementLabelString(this.m_label_text, this.m_id_button, this.m_title) + '<br>';
        }

        ret_html_str = ret_html_str +  '<button  id="' + this.m_id_button + '" ';

        if (this.m_class.length > 0)
        {
            ret_html_str = ret_html_str + ' class="' + this.m_class + '" ';
        }

        if (this.m_onclick_function.length > 0)
        {
            ret_html_str = ret_html_str + ' onclick="' + this.m_onclick_function + '()" ';
        }

        if (this.m_width.length > 0)
        {
            ret_html_str = ret_html_str + '  style="width:' + this.m_width + '" ';
        }

        if (this.m_title.length > 0)
        {
            ret_html_str = ret_html_str + ' title="' + this.m_title + '" ';
        }

        ret_html_str = ret_html_str + '>'; 

        if (this.m_caption.length > 0)
        {
            ret_html_str = ret_html_str + this.m_caption;
        }

        // this.m_width
        
        ret_html_str = ret_html_str + '</button>'; 

        if (this.m_label_text.length > 0 && this.m_label_text_position == 'right')
        {
            ret_html_str = ret_html_str + 
                getHtmlElementLabelString(this.m_label_text, this.m_id_button, this.m_title);
        }

        return ret_html_str;

    } // getHtmlString

} // JazzButton

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Control Button //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Event Login Logout Functions //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// User clicked the login-logout button. 
// The name of this function is defined at the creation of the JazzLogin object
// This function calls (must call) JazzLogin.clickLoginLogoutButton
// 1. Get the user name. Call of JazzUserName.getUserName
//    This call is for the case that the user name not yet is saved
// 2. Case: User name is not saved
// 2.a Request name and password from user and set user name. 
//     Call of JazzUserName.requestSetUserName
// 2.b Set user name. Call of LoginLogout.setUserName
// 2.c Login if possible. Call of LoginLogout.loginIfPossible
// 3. Case: User name is saved
// 3.a Call member function LoginLogout.clickLoginLogoutButton
function onClickLoginLogoutButton()
{
    var user_name = g_web_login_logout.getUserNameObject().getUserName();

    debugJazzTasks('onClickLoginLogoutButton user_name= ' + user_name);

    if (user_name == JazzUserName.getUserNameNotYetSet())
    {
        var request_name =  g_web_login_logout.getUserNameObject().requestSetUserName();

        if (request_name != JazzUserName.getUserNameNotYetSet())
        {
            g_web_login_logout.getLoginLogoutObject().setUserName(request_name);

           //QQQ Only necessary for Admin Tasks g_web_login_logout.getLoginLogoutObject().loginIfPossible(callbackLoginIfPossible);
        }
    }
    else
    {
        g_web_login_logout.getLoginLogoutObject().clickLoginLogoutButton(callbackOnClickLoginLogoutButton);
    }

} // onClickLoginLogoutButton

// Callback function for LoginLogout.clickLoginLogoutButton
function callbackOnClickLoginLogoutButton(i_logged_in_name, i_b_user_has_logged_in, i_warning_msg)
{
    if (i_warning_msg.length > 0)
    {
        alert(i_warning_msg);
    }
    
    g_web_login_logout.setUserHasLoggedIn(i_b_user_has_logged_in);

    g_web_login_logout.getLoginLogoutObject().createSetControls(i_logged_in_name);

} // callbackOnClickLoginLogoutButton

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Event Login Logout Functions ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Callback Functions ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Callback function for LoginLogout.loginIfPossible
function callbackLoginIfPossible(i_logged_in_name, i_b_user_has_logged_in)
{
    alert("callbackLoginIfPossible Error: Should only be called for Admin Tasks")
    g_web_login_logout.setUserHasLoggedIn(i_b_user_has_logged_in);

    g_web_login_logout.GetLoginLogoutObject().createSetControls(i_logged_in_name);

} // callbackLoginIfPossible

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Callback Functions //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Utility Functions /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

    // Returns the label string. Sample string:
    // <label for="id_text_box" title= "Tooltip for the control ..." >Label text</label>
    function getHtmlElementLabelString(i_label_str, i_id_control, i_title)
    {
        var ret_label_str = '';

        if (i_label_str == 0)
        {
            alert("getHtmlElementLabelString Input label string is not set");

            return ret_label_str;
        }

        if (i_id_control == 0)
        {
            alert("getHtmlElementLabelString Input control identity string must be set");

            return ret_label_str;
        }

        ret_label_str = ret_label_str + '<label for= "' + i_id_control + '" ';

        if (i_title.length > 0)
        {
            ret_label_str = ret_label_str + ' title="' + i_title + '" ';
        }

        ret_label_str = ret_label_str + '>';

        ret_label_str = ret_label_str + i_label_str;

        ret_label_str = ret_label_str + '</label>';

        return ret_label_str;

    } // getHtmlElementLabelString
    
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Utility Functions ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Debug Function ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Displays the input string in the debugger Console
function debugJazzTasks(i_msg_str)
{
    console.log('JazzTasks:' + i_msg_str);

} // debugJazzTasks

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Debug Function //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

