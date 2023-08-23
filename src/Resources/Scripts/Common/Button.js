'use strict';
export class Button {
    constructor(id, buttonParent, buttonClass, iconClass, buttonText,
        location='start', dataAttributesObject = {}, extraInformation = '', actions = {}, preventDuplicate =true) {
        if (!id) throw new Error(`Mandatory property 'id' is missing`); 
        if (!buttonParent) throw new Error(`Mandatory property 'buttonParent' is missing`);
        this.id = id;
        this.buttonParent = buttonParent;
        this.buttonClass = buttonClass;
        this.iconClass = iconClass;
        this.buttonText = buttonText;
        this.location = location;
        this.dataAttributesObject = dataAttributesObject;
        this.extraInformation = extraInformation;
        this.actions = actions;
        this.preventDuplicate = preventDuplicate;

        this.buttonSelector = buttonParent + ' #' + id;
        this.AlreadyExists=false;
        this.ButtonObject = null;
    }

    add() {
        var element = $(this.buttonParent);
        if (element.length === 0) throw 'Could not add a preview button. Please check buttonParent';

        this.AlreadyExists = false;
        if ( (this.preventDuplicate) ) {
            const elements = $(this.buttonSelector);
            if (elements.length > 0) {
                this.ButtonObject = elements[0];
                //if button already exists do not add again
                this.AlreadyExists = true;
                return;
            }
        }
        var attributesText = ` id='${this.id}' ${this.extraInformation} `;
        this.dataAttributesObject['parent-selector'] = this.buttonParent;
        if (this.dataAttributesObject) {
            for (const [key, value] of Object.entries(this.dataAttributesObject)) {
                attributesText += ` data-${key}='${value}'`;
            }
        }
        const buttonTagText = `<button ${attributesText}  class='${this.buttonClass}' type='button' >
                <i class='${this.iconClass}'></i>${this.buttonText}</button>`;

        if (this.location === 'start')
            element.prepend(buttonTagText);
        else
            element.append(buttonTagText);
        
        this.ButtonObject = $(this.buttonSelector);
        this.ButtonObject[0].actions = this.actions;
        return this.ButtonObject;
    }
}