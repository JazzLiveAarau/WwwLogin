// File: WebLoginLogout.js
// Date: 2023-04-28
// Author: Gunnar Lidén

// File content
// =============
//
// Class for the memmber login-logout controls

class WebLoginLogout
{
    // Creates the instance of the class
    // id_div_login_logout:      Identity of the div placeholder for the menu
    // i_callback_function_name: Function that shall be called after loading
    constructor(i_id_div_login_logout, i_callback_function_name) 
    {
        // Member variables
        // ================

        // Identity of the <div> for the member login-logout controls
        this.m_id_div_login_logout = i_id_div_login_logout;

        // Call back function name
        this.m_callback_function_name = i_callback_function_name;

        // The member login-logout menu object
        this.m_object_xml = null;

        // Creates the member login-logout controls
        this.createControls();

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

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Create Controls ///////////////////////////
    ///////////////////////////////////////////////////////////////////////////  
    
    // Creates the member login-logout controls
    createControls()
    {

    } // createControls

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Create Controls /////////////////////////////
    ///////////////////////////////////////////////////////////////////////////    

} // WebLoginLogout