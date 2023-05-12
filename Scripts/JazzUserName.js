// File: JazzUserName.js
// Date: 2023-05-11
// Author: Gunnar Lidén

// File content
// =============
//
// Class JazzUserName handling user name as a local storage parameter

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