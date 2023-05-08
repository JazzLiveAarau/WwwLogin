// File: JazzApplicationXml.js
// Date: 2021-06-20
// Author: Gunnar Lidén

// File content
// =============
//
// Class for the application XML file JazzApplication.xml

// Class for the retrieval of season data 
class JazzApplicationXml
{
    // Creates the instance of the class
    // i_callback_function_name: Function that shall be called after loading
    constructor(i_callback_function_name) 
    {
        // Member variables
        // ================

        // Call back function name
        this.m_callback_function_name = i_callback_function_name;

        // Path and name of XML file in the computer
        this.m_xml_file_name_local = 'XmlTestData/JazzApplicationTestData.xml';

        // The jazz application xml object
        this.m_object_xml = null;

        // Object holding the tags
        this.m_tags = new JazzApplicationTags();

        // Flag that a node value not have been set
        this.m_not_yet_set_node_value = "NotYetSetNodeValue";

        // Loads the XML object for aapplication file and calls the function m_callback_function_name
        this.loadOneXmlFile(this, this.getXmlApplicationFileName(), this.m_callback_function_name);

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
    ///////////////////////// Start Member Data ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Returns the member first name for a given member number
    getMemberName(i_member_number)
    {
        return this.getMemberNodeValue(this.m_tags.getMemberName(), i_member_number);
        
    } // getMemberName

    // TODO All other member data functions




    // Returns the member password
    getMemberPassword(i_member_number)
    {
        return this.getMemberNodeValue(this.m_tags.getMemberPassword(), i_member_number);
        
    } // getMemberPassword

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Member Data /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Password //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Returns true if name and password is OK
    namePasswordIsOk(i_name_str, i_password_str)
    {
        var ret_b_ok = false;

        var name_trim = i_name_str.trim();

        var password_trim = i_password_str.trim();

        var n_members = this.getNumberOfMembers();

        for (var member_number=1; member_number <= n_members; member_number++)
        {
            var member_name = this.getMemberName(member_number);

            var member_password = this.getMemberPassword(member_number);

            if (member_name == name_trim && member_password == password_trim)
            {
                ret_b_ok = true;

                break;
            }

        } // member_number

        return ret_b_ok;

    } // namePasswordIsOk

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Password ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////    

    ///////////////////////////////////////////////////////////////////////////
    /////// Start Load Functions //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Load the XML file.
    // https://codeburst.io/javascript-what-the-heck-is-a-callback-aba4da2deced
    // i_object_xml is the instance of this class. Call of this.setXmlObject
    // does not work, while this= jazz_xmlhttp 
    loadOneXmlFile(i_object_xml, i_path_file_name_xml, i_callback_function_name)
    {
    // Request server object for the XML file
    var jazz_xmlhttp = new XMLHttpRequest();
    
    // Event function: The server will return state and status 
    // from object functions open and send.
    jazz_xmlhttp.onreadystatechange = function() 
    {
        if (jazz_xmlhttp.readyState == 4 && jazz_xmlhttp.status == 200) 
        {
            var xml_object = jazz_xmlhttp.responseXML;

            i_object_xml.setXmlObject(xml_object);

            i_callback_function_name();    
        }
        else if (jazz_xmlhttp.readyState == 4 && jazz_xmlhttp.status == 404) 
        {
            alert("Error 404: File " + i_path_file_name_xml + " not found" );
        }	
    };
    
    // Open the file
    jazz_xmlhttp.open("GET", i_path_file_name_xml, true);
    
    jazz_xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
        
    jazz_xmlhttp.send();	

    } // jazzUtilLoadXml

    ///////////////////////////////////////////////////////////////////////////
    /////// End Load Functions ////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Number Members  //////////////////////////
    //////////////////////////////////////////////////////////////////////////

    // Returns the number of members
    getNumberOfMembers()
    {
        var ret_n_members = -12345;

        if (!this.checkApplicationXml()){ return ret_n_members; }

        var concert_nodes = this.m_object_xml.getElementsByTagName(this.m_tags.getMember());

        ret_n_members = concert_nodes.length;

        return ret_n_members;

    } // getNumberOfMembers

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Number Members  /////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Member Node Value  ////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Returns the node value for a given member number and a tag name
    getMemberNodeValue(i_member_tag, i_member_number)
    {
        var ret_data = '';
        
        if (!this.checkApplicationXml()){ return ret_data; }

        var n_members = this.getNumberOfMembers();
        
        if (i_member_number < 1 || i_member_number > n_members)
        {
            alert("JazzApplicationXml.getMemberNodeValue Member number is not between 1 and " + n_members.toString());
            return ret_data;		
        }
            
        var member_nodes = this.getXmlObject().getElementsByTagName(this.m_tags.getMember());

        var member_node = member_nodes[i_member_number-1];
        
        var xml_node_value = this.getNodeValueTagName(member_node, i_member_tag);
        
        ret_data = this.removeFlagNodeValueNotSet(xml_node_value);
        
        return ret_data;
        
    } // getMemberNodeValue

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Member Node Value  //////////////////////////
    ///////////////////////////////////////////////////////////////////////////  

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start XML Node Values  //////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Returns the node value. Input is an XML node and the tag name
    getNodeValueTagName(i_node, i_xml_tag)
    {	
        return i_node.getElementsByTagName(i_xml_tag)[0].childNodes[0].nodeValue;
        
    } // getNodeValueTagName

    // Returns the node value. Input is an XML node 
    getNodeValue(i_node)
    {	
        return i_node.childNodes[0].nodeValue;
        
    } // getNodeValue

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// End XML Node Values  ////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////// Start Not Set Values  ///////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Returns true if the node value is set
    nodeValueIsSet(i_node_value)
    {
        if (i_node_value == this.m_not_yet_set_node_value)
        {
            return false;
        }
        else
        {
            return true;
        }
        
    } // nodeValueIsSet

    // Returns empty string if i_node_value is equal to m_not_yet_set_node_value
    removeFlagNodeValueNotSet(i_node_value)
    {
        if (!this.nodeValueIsSet(i_node_value))
        {
            return "";
        }
        
        return i_node_value; 
        
    } // removeFlagNodeValueNotSet

    // Return flag (string) g_not_yet_set_node_value if input string is empty
    setFlagNodeValueIsNotSetForEmptyString(i_node_value)
    {
        var trimmed_node_value = i_node_value.trim();
        
        if (trimmed_node_value.length == 0)
        {
            return this.m_not_yet_set_node_value;
        }
        
        return i_node_value;

    } // setFlagNodeValueIsNotSetForEmptyString

    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// End Not Set Values  /////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    /////// Start Utility Functions ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Returns the XML application file name and path
    getXmlApplicationFileName()
    {
        var ret_file_name = '';

        ret_file_name = ret_file_name + '../XML/JazzApplication.xml';

        if (!JazzApplicationXml.execApplicationOnServer())
        {
            return this.m_xml_file_name_local;
        }        

        return ret_file_name;

    } // getXmlApplicationFileName

    // Check that the season program XML object is set
    checkApplicationXml()
    {      
        if (null == this.getXmlObject())
        {
            alert("JazzApplicationXml.checkApplicationXml Application XML object is null");

            return false;
        }	
        else
        {
            return true;
        }
        
    } // checkApplicationXml

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

    ///////////////////////////////////////////////////////////////////////////
    /////// End Utility Functions /////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

} // JazzApplicationXml

// Class defining the tags of the XML application file
class JazzApplicationTags 
{
    // Creates the instance of the class
    constructor() 
    {
        // Member variables
        // ================

        ///// Start Publish Tags //////////////////////////////////////////////

        this.m_tag_application_publish_season_start_year = "PublishSeasonStartYear";


        ///// End Publish Tags ////////////////////////////////////////////////

        ///// Start Jazzclub Tags /////////////////////////////////////////////

        this.m_tag_application_club_name = 'ClubName';

        this.m_tag_application_club_email = 'EmailJazzLiveAarau';

        ///// End Jazzclub Tags ///////////////////////////////////////////////

        ///// Start About Us (Concept) Tags ///////////////////////////////////

        this.m_tag_application_about_us_header = "AboutUsHeader";
        this.m_tag_application_about_us_one = "AboutUsOne";
        this.m_tag_application_about_us_two = "AboutUsTwo";
        this.m_tag_application_about_us_three = "AboutUsThree";


        ///// End About Us (Concept) Tags /////////////////////////////////////

        ///// Start Requests Tags /////////////////////////////////////////////

        this.m_tag_application_request_caption = "RequestCaption";
        this.m_tag_application_request_header = "RequestHeader";
        this.m_tag_application_request_dates_display = "RequestDatesDisplay";
        this.m_tag_application_request_no_dates_text = "RequestNoDatesText";
        this.m_tag_application_request_dates_text = "RequestDatesText";
        this.m_tag_application_request_content_header = "RequestContentHeader";
        this.m_tag_application_request_content_one = "RequestContentOne";
        this.m_tag_application_request_content_two = "RequestContentTwo";
        this.m_tag_application_request_content_three = "RequestContentThree";
        this.m_tag_application_request_content_four = "RequestContentFour";
        this.m_tag_application_request_content_five = "RequestContentFive";
        this.m_tag_application_request_content_six = "RequestContentSix";
        this.m_tag_application_request_content_seven = "RequestContentSeven";
        this.m_tag_application_request_content_eight = "RequestContentEight";
        this.m_tag_application_request_content_nine = "RequestContentNine";
        this.m_tag_application_request_email_address = "RequestEmailAddress";
        this.m_tag_application_request_email_title = "RequestEmailTitle";
        this.m_tag_application_request_email_caption = "RequestEmailCaption";
        this.m_tag_application_request_email_remark = "RequestEmailRemark";
        this.m_tag_application_request_end_paragraph = "RequestEndParagraph";

        ///// End Requests Tags ///////////////////////////////////////////////

        ///// Start Premises Tags /////////////////////////////////////////////

        this.m_tag_application_premises_header = "PremisesHeader";
        this.m_tag_application_premises = "Premises";
        this.m_tag_application_premises_street = "PremisesStreet";
        this.m_tag_application_premises_city = "PremisesCity";
        this.m_tag_application_premises_website = "PremisesWebsite";
        this.m_tag_application_premises_telephone = "PremisesTelephone";
        this.m_tag_application_premises_photo = "PremisesPhoto";
        this.m_tag_application_premises_map = "PremisesMap";


        ///// End Premises Tags ///////////////////////////////////////////////

        ///// Start Reservation Tags //////////////////////////////////////////

        this.m_tag_application_reservation_url = "ReservationUrl";
        this.m_tag_application_reservation_not_allowed_flag = "ReservationNotAllowed";
        this.m_tag_application_reservation_not_allowed_text = "ReservationNotAllowedText";

        ///// End Reservation Tags ////////////////////////////////////////////

        ///// Start Newsletter Tags ///////////////////////////////////////////

        this.m_tag_application_newsletter_header = "NewsletterHeader";

        this.m_tag_application_newsletter_subject = "NewsletterSubject";

        ///// End Newsletter Tags /////////////////////////////////////////////

        ///// Start Supporter Tags ////////////////////////////////////////////

        this.m_tag_application_supporters_1 = "Supporters1";
        this.m_tag_application_supporters_2 = "Supporters2";
        this.m_tag_application_supporters_3 = "Supporters3";
        this.m_tag_application_supporters_4 = "Supporters4";

        ///// End Supporter Tags //////////////////////////////////////////////

        ///// Start Member Tags ///////////////////////////////////////////////

        this.m_tag_application_member = "Member";
        this.m_tag_application_member_name = "Name";
        this.m_tag_application_family_name = "FamilyName";
        this.m_tag_application_member_email_address = "EmailAddress";
        this.m_tag_application_member_email_private = 'EmailPrivate';
        this.m_tag_application_member_telephone = 'Telephone';
        this.m_tag_application_member_telephone_fix = 'TelephoneFix';
        this.m_tag_application_member_street = "Street";
        this.m_tag_application_member_city = "City";
        this.m_tag_application_member_post_code = "PostCode";
        this.m_tag_application_member_photo_small_size = "PhotoSmallSize";
        this.m_tag_application_member_tasks = "Tasks";
        this.m_tag_application_member_tasks_short = "TasksShort";
        this.m_tag_application_member_active_flag = "Vorstand";
        this.m_tag_application_member_order_number = "Number";
        this.m_tag_application_member_why = "Why";
        this.m_tag_application_member_start_year = 'StartYear';
        this.m_tag_application_member_end_year = 'EndYear';
        this.m_tag_application_member_password = 'Password';

        ///// End Member Tags /////////////////////////////////////////////////

        ///// Start Caption Tags //////////////////////////////////////////////

        this.m_tag_application_caption_contact_person_concert = "CaptionContactPersonConcert";
        this.m_tag_application_caption_musician_documents_contract = "CaptionMusicianDocumentsContract";
        this.m_tag_application_caption_musician_concert_info = "CaptionMusicianConcertInfo";
        this.m_tag_application_caption_musician_driveway_permit = "CaptionMusicianDrivewayPermit";
        this.m_tag_application_caption_unload_address = "CaptionUnloadAddress";
        this.m_tag_application_caption_parking_one = "CaptionParkingOne";
        this.m_tag_application_caption_parking_two = "CaptionParkingTwo";
        this.m_tag_application_caption_driveway_permit = "CaptionMusicianDrivewayPermit";

        ///// End Caption Tags ////////////////////////////////////////////////

        ///// Start Musician Info Tags ////////////////////////////////////////

        this.m_tag_application_contact_concert_member_number = "ContactConcertMemberNumber";
        // Not used: Data is retrieved with ContactConcertMemberNumber
        // this.m_tag_application_contact_concert_telephone = "ContactConcertTelephone";
        //this.m_tag_application_contact_concert_email = "ContactConcertEmail";

        this.m_tag_application_unload_street = "UnloadStreet";
        this.m_tag_application_unload_city = "UnloadCity";
        this.m_tag_application_parking_one = "ParkingOne";
        this.m_tag_application_parking_two = "ParkingTwo";


        ///// End Musician Info Tags //////////////////////////////////////////

    } // constructor

    // Get member variable functions
    // =============================

    ///// Start Member Tags ///////////////////////////////////////////////////

    getMember(){return this.m_tag_application_member;} 
    getMemberName(){return this.m_tag_application_member_name;} 

    getMemberPassword(){return this.m_tag_application_member_password;} 

    ///// End Member Tags /////////////////////////////////////////////////////


} // JazzApplicationTags

