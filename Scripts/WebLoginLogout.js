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
    // id_div_login_logout:      Identity of the div placeholder for the menu
    // i_hide_display_elements:  Elements that shall be hidden if user not is logged in
    // Four (global) functions with following names must be defined. These functions
    // shall call a corresponding member function with the same name:
    // - createLoginLogoutControlsAfterLoadOfXml
    // - onClickWebLoginLogoutButton
    // - callbackOnClickWebLoginLogoutButton
    // - callbackWebLoginIfPossible
    constructor(i_id_div_login_logout, i_hide_display_elements) 
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
        this.m_callback_function_xml = createLoginLogoutControlsAfterLoadOfXml;

        // Call back function login if possible
        this.m_callback_function_login_if_possible = callbackWebLoginIfPossible;

        // Event function name for the function that shall be called when the 
        // user clicks button Login/Logout
        this.m_event_function_click_str = 'onClickWebLoginLogoutButton';

        // Call back function on klick login-logout button
        this.m_callback_function_on_click = callbackOnClickWebLoginLogoutButton;

        // Instance of class LoginLogout
        this.m_login_logout = null;

        // Object that handles the user name
        this.m_user_name_object = null;

        // Flag telling if the user has logged in
        this.m_user_has_logged_in = null;

        // The member login-logout menu object
        this.m_object_xml = null;

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
    loadXml()
    {
        if (!this.functionsAreDefined())
        {
            return;
        }

        this.m_application_xml = new JazzApplicationXml(this.m_callback_function_xml);
    }

    // Returns true if functions are defined
    functionsAreDefined()
    {
        var ret_b_exist = true;

        //var type_of_str = typeof createLoginLogoutControlsAfterLoadOfXml;

        if ((typeof createLoginLogoutControlsAfterLoadOfXml != 'function')) 
        {
            alert("WebLoginLogout.functionsAreDefined Function createLoginLogoutControlsAfterLoadOfXml is not defined");

            ret_b_exist = false;
        }

        if ((typeof onClickWebLoginLogoutButton != 'function')) 
        {
            alert("WebLoginLogout.functionsAreDefined Function onClickWebLoginLogoutButton is not defined");

            ret_b_exist = false;
        }

        if ((typeof callbackOnClickWebLoginLogoutButton != 'function')) 
        {
            alert("WebLoginLogout.functionsAreDefined Function callbackOnClickWebLoginLogoutButton is not defined");

            ret_b_exist = false;
        }

        if ((typeof callbackWebLoginIfPossible != 'function')) 
        {
            alert("WebLoginLogout.functionsAreDefined Function callbackOnClickWebLoginLogoutButton is not defined");

            ret_b_exist = false;
        }

        return ret_b_exist;

    } // functionsAreDefined

    // Creates the member login-logout controls when the application XML object has been created
    createLoginLogoutControlsAfterLoadOfXml()
    {
        this.m_user_name_object = new JazzUserName(this.m_application_xml);

        var user_name = this.m_user_name_object.getUserName();
    
        if (user_name == JazzUserName.getUserNameNotYetSet())
        {
            user_name = LoginLogout.UserNameIsUndefined();
        }
    
        this.m_login_logout = new LoginLogout(this.getIdLoginLogoutTextBox(), this.getIdLoginLogoutButton(), 
                                    this.m_id_div_login_logout, this.m_event_function_click_str,
                                          user_name);
    
        if (user_name != LoginLogout.UserNameIsUndefined())
        {
            this.getLoginLogoutObject().loginIfPossible(this.m_callback_function_login_if_possible);
        }
 
    } // loadXml

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
    onClickWebLoginLogoutButton()
    {
        var user_name = this.getUserNameObject().getUserName();

        if (user_name == JazzUserName.getUserNameNotYetSet())
        {
            var request_name =  this.getUserNameObject().requestSetUserName();
    
            if (request_name != JazzUserName.getUserNameNotYetSet())
            {
                this.getLoginLogoutObject().setUserName(request_name);
    
                this.getLoginLogoutObject().loginIfPossible(this.m_callback_function_login_if_possible);
            }
        }
        else
        {
            this.getLoginLogoutObject().clickLoginLogoutButton(this.m_callback_function_on_click);
        }

    } // onClickWebLoginLogoutButton

    // Callback function for clicking the login-logout button (LoginLogout.clickLoginLogoutButton)
    callbackOnClickWebLoginLogoutButton(i_logged_in_name, i_b_user_has_logged_in, i_warning_msg)
    {
        if (i_warning_msg.length > 0)
        {
            alert(i_warning_msg);
        }
        
        this.setUserHasLoggedIn(i_b_user_has_logged_in);
    
        this.getLoginLogoutObject().createSetControls(i_logged_in_name);

    } // callbackOnClickWebLoginLogoutButton

    // Callback function for LoginLogout.loginIfPossible
    callbackWebLoginIfPossible(i_logged_in_name, i_b_user_has_logged_in)
    {
        this.setUserHasLoggedIn(i_b_user_has_logged_in);

        this.getLoginLogoutObject().createSetControls(i_logged_in_name);

    } // callbackWebLoginIfPossible

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Event And Callback Functions ////////////////
    ///////////////////////////////////////////////////////////////////////////

} // WebLoginLogout



