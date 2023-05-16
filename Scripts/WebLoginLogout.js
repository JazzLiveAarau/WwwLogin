// File: WebLoginLogout.js
// Date: 2023-05-15
// Author: Gunnar Lidén

// File content
// =============
//
// Class for the memmber login-logout controls

class WebLoginLogout
{
    // Creates the instance of the class
    // id_div_login_logout:      Identity of the div placeholder for the menu
    // i_hide_display_elements:  Elements that shall be hidden if user not is logged in
    // i_b_only_read_data:       Flag telling if data only will be read (not changed or added)
    // i_n_level_xml:            Directory levels to /www/XML/
    // Four (global) functions with following names must be defined. These functions
    // shall call a corresponding member function with the same name:
    // - createLoginControlsAfterXml
    // - onClickWebLoginButton
    // - callbackonClickWebLoginButton
    // - callbackWebLoginIfPossible
    constructor(i_id_div_login_logout, i_hide_display_elements, i_b_only_read_data, i_n_level_xml) 
    {
        // Member variables
        // ================

        // Application XML object
        this.m_application_xml = null;

        // Identity of the <div> for the member login-logout controls
        this.m_id_div_login_logout = i_id_div_login_logout;

        // Array of elements that shall be hidden or displayed depending on if user not is logged in
        this.m_hide_display_elements = i_hide_display_elements;

        // Flag telling if data only will be read (not changed or added)
        this.m_b_only_read_data = i_b_only_read_data;

        // Directory levels to /www/XML/
        this.m_n_level_xml = i_n_level_xml;

        // Call back function name used after creation of application XML object
        this.m_callback_function_xml = createLoginControlsAfterXml;

        // Call back function login if possible
        this.m_callback_function_login_if_possible = callbackWebLoginIfPossible;

        // Event function name for the function that shall be called when the 
        // user clicks button Login/Logout
        this.m_event_function_click_str = 'onClickWebLoginButton';

        // Call back function on klick login-logout button
        this.m_callback_function_on_click = callbackonClickWebLoginButton;

        // Instance of class LoginLogout
        this.m_login_logout = null;

        // Object that handles the user name
        this.m_user_name_object = null;

        // Flag telling if the user has logged in
        this.m_user_has_logged_in = null;

        // The member login-logout menu object
        this.m_object_xml = null;

        // Flag telling if debug data shall be written to log
        this.m_write_debug_to_log = true;

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

    // Checks first that compulsory functions are defined. Call of functionsAreDefined
    // Creates the application XML object and calls afterward the function that
    // creates the controls. First is the normal (global) function called and 
    // thereafter the member function
    loadXml()
    {
        this.debugToConsole("loadXml Enter");

        var b_user_has_logged_in = false;

        this.hideDisplayElements(b_user_has_logged_in);

        if (!this.functionsAreDefined())
        {
            return;
        }

        this.m_application_xml = new JazzApplicationXml(this.m_callback_function_xml, this.m_n_level_xml);

        this.debugToConsole("loadXml Object JazzApplicationXml created");

    } // loadXml

    // Returns true if functions are defined
    functionsAreDefined()
    {
        var ret_b_exist = true;

        //var type_of_str = typeof createLoginControlsAfterXml;

        if ((typeof createLoginControlsAfterXml != 'function')) 
        {
            alert("WebLoginLogout.functionsAreDefined Function createLoginControlsAfterXml is not defined");

            ret_b_exist = false;
        }

        if ((typeof onClickWebLoginButton != 'function')) 
        {
            alert("WebLoginLogout.functionsAreDefined Function onClickWebLoginButton is not defined");

            ret_b_exist = false;
        }

        if ((typeof callbackonClickWebLoginButton != 'function')) 
        {
            alert("WebLoginLogout.functionsAreDefined Function callbackonClickWebLoginButton is not defined");

            ret_b_exist = false;
        }

        if ((typeof callbackWebLoginIfPossible != 'function')) 
        {
            alert("WebLoginLogout.functionsAreDefined Function callbackonClickWebLoginButton is not defined");

            ret_b_exist = false;
        }

        if (ret_b_exist)
        {
            this.debugToConsole("functionsAreDefined: Web Login-Logout functions are defined");
        }
        else
        {
            this.debugToConsole("functionsAreDefined: Web Login-Logout functions are NOT defined");
        }
        

        return ret_b_exist;

    } // functionsAreDefined

    // Creates the member login-logout controls when the application XML object has been created
    createLoginControlsAfterXml()
    {
        this.debugToConsole("createLoginControlsAfterXml Enter");

        this.m_user_name_object = new JazzUserName(this.m_application_xml);

        var user_name = this.m_user_name_object.getUserName();
    
        if (user_name == JazzUserName.getUserNameNotYetSet())
        {
            user_name = LoginLogout.UserNameIsUndefined();
        }

        this.debugToConsole("createLoginControlsAfterXml user_name= " + user_name);
    
        this.m_login_logout = new LoginLogout(this.getIdLoginLogoutTextBox(), this.getIdLoginLogoutButton(), 
                                    this.m_id_div_login_logout, this.m_event_function_click_str,
                                          user_name, this.m_b_only_read_data);

        this.debugToConsole("createLoginControlsAfterXml Object LoginLogout is created");
    
        if (this.userNameIsDefined(user_name) && !this.readOnlyDataApplication())
        {
            this.debugToConsole("createLoginControlsAfterXml Case: User name defined. A (true) login application");

            this.getLoginLogoutObject().loginIfPossible(this.m_callback_function_login_if_possible);
        }
        if (this.userNameIsDefined(user_name)  && this.readOnlyDataApplication())
        {
            this.debugToConsole("createLoginControlsAfterXml Case: User name defined. No checks if any other is logged in");

            this.m_callback_function_login_if_possible(user_name, true);
        }

        this.debugToConsole("createLoginControlsAfterXml Exit");
 
    } // createLoginControlsAfterXml

    // Returns true if user name is defined
    userNameIsDefined(i_user_name)
    {
        if (i_user_name != LoginLogout.UserNameIsUndefined())
        {
            return true;
        }
        else
        {
            return false;
        }
    } // userNameIsDefined

    // Returns true if it is a read only application
    readOnlyDataApplication()
    {
        return this.m_b_only_read_data;

    } // readOnlyDataApplication

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Create Controls /////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Event And Callback Functions //////////////
    ///////////////////////////////////////////////////////////////////////////  
    
    // User clicked the login-logout button. 
    // There must be a (global) event function. The name of the function is
    // input data to WebLoginLogout. This event function must call this
    // member function.
    // 1. Get the user name. Call of JazzUserName.getUserName
    //    This call is for the case that the user name not yet is saved
    // 2. Case: User name is not saved
    // 2.a Request name and password from user and set user name. 
    //     Call of JazzUserName.requestSetUserName
    // 2.b Set user name. Call of LoginLogout.setUserName
    // 2.c Login if possible. Call of LoginLogout.loginIfPossible
    // 3. Case: User name is saved
    // 3.a Call member function LoginLogout.clickLoginLogoutButton
    onClickWebLoginButton()
    {
        this.debugToConsole("onClickWebLoginButton Enter");

        var user_name = this.getUserNameObject().getUserName();

        this.debugToConsole("onClickWebLoginButton user_name= " + user_name);

        if (user_name == JazzUserName.getUserNameNotYetSet())
        {
            this.debugToConsole("onClickWebLoginButton Case: User name is not yet set");

            var request_name =  this.getUserNameObject().requestSetUserName();

            this.debugToConsole("onClickWebLoginButton request_name= " + request_name);
    
            if (request_name != JazzUserName.getUserNameNotYetSet())
            {
                this.debugToConsole("onClickWebLoginButton Case: Request name has not yet been set");

                this.getLoginLogoutObject().setUserName(request_name);

                if (!this.readOnlyDataApplication())
                {
                    this.debugToConsole("onClickWebLoginButton Case: A (true) login application");

                    this.getLoginLogoutObject().loginIfPossible(this.m_callback_function_login_if_possible);
                }
                else
                {
                    this.debugToConsole("onClickWebLoginButton Case: No checks if any other is logged in");

                    this.m_callback_function_login_if_possible(request_name, true);
                }
                
            }
        }
        else if (!this.readOnlyDataApplication())
        {
            this.debugToConsole("onClickWebLoginButton Case: A (true) login application");

            this.debugToConsole("onClickWebLoginButton Call of function LoginLogout.clickLoginLogoutButton");

            this.getLoginLogoutObject().clickLoginLogoutButton(this.m_callback_function_on_click);
        }
        else
        {
            this.debugToConsole("onClickWebLoginButton Case: No checks if any other is logged in");

            this.debugToConsole("onClickWebLoginButton Call of function callbackonClickWebLoginButton");

            if (!this.getLoginLogoutObject().userIsLoggedIn())
            {
                this.debugToConsole("onClickWebLoginButton Parameter 1= " + user_name + " (user name)");

                this.debugToConsole("onClickWebLoginButton Parameter 2= " + "true"+ " (user is logged in)");
    
                this.debugToConsole("onClickWebLoginButton Parameter 3= " + "empty"+ " (warning message)");
    
                this.m_callback_function_on_click(user_name, true, "")
            }
            else
            {
                this.debugToConsole("onClickWebLoginButton Parameter 1= " + LoginLogout.UserNameIsUndefined() + " (user name");

                this.debugToConsole("onClickWebLoginButton Parameter 2= " + "false"+ " (user is logged in)");
    
                this.debugToConsole("onClickWebLoginButton Parameter 3= " + "empty"+ " (warning message)");
    
                this.m_callback_function_on_click(LoginLogout.UserNameIsUndefined(), false, "")
            }

        }

        this.debugToConsole("onClickWebLoginButton Exit");

    } // onClickWebLoginButton

    // Callback function for clicking the login-logout button (LoginLogout.clickLoginLogoutButton)
    callbackonClickWebLoginButton(i_logged_in_name, i_b_user_has_logged_in, i_warning_msg)
    {
        this.debugToConsole("callbackonClickWebLoginButton Enter");

        if (i_warning_msg.length > 0)
        {
            alert(i_warning_msg);
        }
        
        this.setUserHasLoggedIn(i_b_user_has_logged_in);
    
        this.getLoginLogoutObject().createSetControls(i_logged_in_name);

        this.hideDisplayElements(i_b_user_has_logged_in);

        this.debugToConsole("callbackonClickWebLoginButton Exit");

    } // callbackonClickWebLoginButton

    // Callback function for LoginLogout.loginIfPossible
    callbackWebLoginIfPossible(i_logged_in_name, i_b_user_has_logged_in)
    {
        this.debugToConsole("callbackWebLoginIfPossible Enter");

        this.setUserHasLoggedIn(i_b_user_has_logged_in);

        this.getLoginLogoutObject().createSetControls(i_logged_in_name);

        this.hideDisplayElements(i_b_user_has_logged_in);

        this.debugToConsole("callbackWebLoginIfPossible Exit");

    } // callbackWebLoginIfPossible

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Event And Callback Functions ////////////////
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Hide Display Application Elements /////////
    ///////////////////////////////////////////////////////////////////////////  

    // Hide or display elements defined in array m_hide_display_elements
    hideDisplayElements(i_b_user_has_logged_in)
    {
        if (i_b_user_has_logged_in)
        {
            this.debugToConsole("hideDisplayElements Enter. Elements will be displayed");
        }
        else
        {
            this.debugToConsole("hideDisplayElements Enter. Elements will be hidden");
        }

        var n_elements = this.m_hide_display_elements.length;

        for (var index_el=0; index_el < n_elements; index_el++)
        {
            var current_el = this.m_hide_display_elements[index_el];

            if (i_b_user_has_logged_in)
            {
                current_el.style.display = 'block';
            }
            else
            {
                current_el.style.display = 'none';
            }
        }

        this.debugToConsole("hideDisplayElements Exit");

    } // hideDisplayElements

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Hide Display Application Elements ///////////
    ///////////////////////////////////////////////////////////////////////////  

   ////////////////////////////////////////////////////////////////////////////
   ///////////////////////// Start Debug Functions ////////////////////////////
   ////////////////////////////////////////////////////////////////////////////

   // Writes debug to the console
   debugToConsole(i_msg_str)
   {
       if (!this.m_write_debug_to_log)
       {
            return;
       }

       console.log('WebLoginLogout:' + i_msg_str);

   } // debugToConsole    
   
   ////////////////////////////////////////////////////////////////////////////
   ///////////////////////// End Debug Functions //////////////////////////////
   ////////////////////////////////////////////////////////////////////////////

} // WebLoginLogout



