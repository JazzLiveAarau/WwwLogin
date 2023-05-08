// File: JazzButton.js
// Date: 2023-05-08
// Author: Gunnar Lidén

// File content
// =============
//
// Class JazzButton

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
