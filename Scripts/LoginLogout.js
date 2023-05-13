// File: LoginLogout.js
// Date: 2023-05-13
// Author: Gunnar Lidén


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

        // Flag telling if debug data shall be written to log
        this.m_write_debug_to_log = true;

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
        debugToConsole("loginIfPossible Enter");

        var user_name = this.getUserName();

        debugToConsole("loginIfPossible user_name= " + user_name);

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

        debugToConsole("loginIfPossible Call of Php/LoginLogout.php. Case= " + LoginLogout.execPhpCaseLoginIfPossible());

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

                debugToConsole("loginIfPossible logged_in_name= " + logged_in_name + " flag_logged_in= " + flag_logged_in);

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
        debugToConsole("clickLoginLogoutButton Enter");

        var user_name = this.getUserName();

        debugToConsole("clickLoginLogoutButton user_name= " + user_name);

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

        debugToConsole("clickLoginLogoutButton Call of Php/LoginLogout.php Case= " + LoginLogout.execPhpCaseClickLoginLogoutButton());

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

                debugToConsole("clickLoginLogoutButton logged_in_name= " + logged_in_name + " flag_logged_in= " + flag_logged_in + " warning_msg= " + warning_msg);

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
        debugToConsole("getLoggedInName Enter");

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

        debugToConsole("getLoggedInName Call of Php/LoginLogout.php. Case= " + LoginLogout.execPhpCaseGetLoggedInName());

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

                debugToConsole("getLoggedInName logged_in_name= " + logged_in_name + " flag_logged_in= " + flag_logged_in);

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

        debugToConsole("setLoggedInName Call of Php/LoginLogout.php. Case= " + LoginLogout.execPhpCaseSetLoggedInName());

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

                debugToConsole("setLoggedInName reply_trim_str= " + reply_trim_str);

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
        debugToConsole("createSetControls Enter");

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

            this.debugToConsole('createSetControls i_login_name= ' + LoginLogout.UserNameIsUndefined() + ' (1)');
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

            this.debugToConsole('createSetControls i_login_name= ' + LoginLogout.UserNameIsUndefined() + ' (2)');
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

        debugToConsole("createSetControls Exit");

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
        debugToConsole("setElementStyles Enter");

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

        debugToConsole("setElementStyles Exit");

    } // setElementStyles

    // Set element colors
    setElementColors(i_login_name)
    {
        debugToConsole("setElementColors Enter");

        this.setColorButton(i_login_name);

        var div_container_el = this.getDivContainerElement();

        var label_el = this.getLabelElement();

        var input_el = this.getInputElement();

        var button_el = this.getButtonElement();

        div_container_el.style.backgroundColor = this.m_container_color;

        label_el.style.backgroundColor = this.m_label_color;

        input_el.style.backgroundColor = this.m_input_color;

        button_el.style.cursor = "pointer";

        debugToConsole("setElementColors Exit");

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
        //20230509 return "Data/LoginLogout.txt";
        // The relative path is not OK if JazzScripts file is used
        return "../../Tasks/Php/Data/LoginLogout.txt";

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
    debugToConsole(i_msg_str)
    {
        if (!this.m_write_debug_to_log)
        {
             return;
        }

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
        debugToConsole("simulateGetLoggedInName Enter");

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

        debugToConsole("simulateGetLoggedInName Exit ret_logged_in_name= " + ret_logged_in_name);

        return ret_logged_in_name;

    } // simulateGetLoggedInName

    // Simulates loginIfPossible(. This is the the function that is called when the 
    // user starts the application. For the tests this corresponds to reload application
    simulateLoginIfPossible(i_callback_login_if_possible)
    {
        debugToConsole("simulateLoginIfPossible Enter");

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
            debugToConsole("simulateLoginIfPossible Callback user_name= " + user_name + " is logged in");

            i_callback_login_if_possible(user_name, true);
        }
        else
        {
            debugToConsole("simulateLoginIfPossible Callback user_name= " + user_name + " is not logged in");

            i_callback_login_if_possible(logged_in_name, false);
        }

    } // simulateLoginIfPossible

    // Simulates a click on the login/logout button
    simulateClickLoginLogoutButton(i_callback_click_login_logout)
    {
        debugToConsole("simulateClickLoginLogoutButton Enter");

        var user_name = this.getUserName();

        var logged_in_name = this.simulateChangeOfLogggedInName();

        var user_is_logged_in = this.userIsLoggedIn();

        if (user_is_logged_in && logged_in_name == user_name)
        {
            // User i logged in and nobody else hs logged in, i.e. the user can logout
            // and nobody is has logged out

            this.m_logged_in_simulation = LoginLogout.loginNameNobody();

            debugToConsole("simulateClickLoginLogoutButton Callback user_name= " + LoginLogout.loginNameNobody() + " is not logged in. No warning");

            i_callback_click_login_logout(LoginLogout.loginNameNobody(), false, "");
        }
        else if (user_is_logged_in && logged_in_name != user_name)
        {
            // The user is logged in but somebody else has logged out the user. The user gets
            // a warning and the name of the logged in person will be displayed

            this.m_logged_in_simulation = logged_in_name;

            debugToConsole("simulateClickLoginLogoutButton Callback user_name= " + logged_in_name + " is not logged in. Warning= " + LoginLogout.otherForcedLoginMessage());

            i_callback_click_login_logout(logged_in_name, false, LoginLogout.otherForcedLoginMessage());
        }
        else if (!user_is_logged_in && logged_in_name == LoginLogout.loginNameNobody())
        {
            // The user is not logged in ant in the file nobody is registered, i.e. the user can login.
            // This is the normal case. It is not likely that two persons work at the same time, nor
            // that somebody forgets to logout

            this.m_logged_in_simulation = user_name;

            debugToConsole("simulateClickLoginLogoutButton Callback user_name= " + user_name + " is logged in. No warning");

            i_callback_click_login_logout(user_name, true, "");
        }
        else if (!user_is_logged_in && logged_in_name != user_name)
        {
            // The user is not logged in and another person is logged in. The user decides to force a login.
            // The user gets a message that he logged out the other person

            this.m_logged_in_simulation = user_name;

            debugToConsole("simulateClickLoginLogoutButton Callback user_name= " + user_name + " is logged in. Warning= " + LoginLogout.otherForcedLoginMessage());

            i_callback_click_login_logout(user_name, true, LoginLogout.userForcedLoginLoggedOutMessage());
        }
        else if (user_is_logged_in && logged_in_name == LoginLogout.loginNameNobody())
        {
            // The user is logged in but the registration file say that nobody is logged in.
            // This means that somebody else took over the login and then logged out. 
            // The user gets informed about this and the user can login

            this.m_logged_in_simulation = user_name;

            debugToConsole("simulateClickLoginLogoutButton Callback user_name= " + user_name + " is logged in. Warning= " + LoginLogout.otherForcedLoginLoggedOutMessage());

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
        debugToConsole("simulateChangeOfLogggedInName Enter");

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

        debugToConsole("simulateChangeOfLogggedInName Exit ret_logged_in_name= " + ret_logged_in_name);

        return ret_logged_in_name;

    } // simulateChangeOfLogggedInName

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Simulation Functions ////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////// 

} // class LoginLogout
