//Editor =================================================== Refer https://github.com/json-editor/json-editor
export default class SchemaFormHandler {
    constructor(containerId) {
        this.containerId = containerId;
        this.jsonEditorForm = document.getElementById(containerId);
        this.isValidData = true;
        this.designerValidationErrors = '';
        this.jsoneditor = null;
        this.paramEditorOptions = {
            max_depth: 10,   //to avoid infinite loop. Max depth of the nested properties to be rendered of provided json schema.

            iconlib: 'fontawesome5',
            //object_layout: 'grid-strict',
            show_errors: 'always',
            theme: 'bootstrap5',
            array_controls_top: true,
            disable_array_add: false,
            disable_array_delete: false,
            disable_array_delete_all_rows: false,
            disable_array_delete_last_row: true,
            disable_array_reorder: false,
            disable_collapse: true,
            disable_edit_json: true,
            disable_properties: true,
            display_required_only: false,
            enable_array_copy: false
        };
    }
    initJsoneditor() {
        if (this.jsoneditor) {
            // //the form reset is clearling all he basic fields except the HTML fields.
            // document.querySelector('#' + this.containerId).reset();
            // //if jsoneditor is already loaded just set the new values to designer.
            // //The only time you need to destroy and create again is if the schema or any options change. Otherwise, you can just use setValue.
            // //This is not working properly. this.jsoneditor.setValue(null);
            // this.jsoneditor.setValue(window.aptTecReports.ReportParams);
            // return;

            // destroy old JSONEditor instance if exists and load the new values 
            // this is the only method works well
            this.jsoneditor.destroy(); 
        }
        this.paramEditorOptions.schema = window.aptTecReports.ReportSchema;

        // new instance of JSONEditor
        this.jsoneditor = new window.JSONEditor(this.jsonEditorForm, this.paramEditorOptions);
        // we can enable/disable entire form or part of the form as well
        //editor.getEditor('root.location').disable();

        //if it is loaded for the first time, try to get the values from global object
        this.jsoneditor.on('ready', () => {
            // Now the api methods will be available
            this.jsoneditor.setValue(window.aptTecReports.ReportParams);
        });
    }
    getCurrentParameters() {
        return this.jsoneditor.getValue();
    }
    saveParameters() {
        // validate
        var validationErrors = this.jsoneditor.validate();
        this.isValidData = !(validationErrors.length);  //true if length=0
        if (this.isValidData) {
            var designParams = this.jsoneditor.getValue();  // output
            this.#savePassedParamsRefresh(designParams);
            return;
        }

        // this.designerValidationErrors is an array of objects, each with a `path`, `property`, and `message` parameter
        // `property` is the schema keyword that triggered the validation error (e.g. "minLength")
        // `path` is a dot separated path into the JSON object (e.g. "root.path.to.field")
        this.designerValidationErrors = JSON.stringify(validationErrors, null, 2);
        alert(this.designerValidationErrors);
    }

    resetParameters() {
        localStorage.removeItem(window.aptTecReports.reportId);    //remove local report configuration
        //window.aptTecReports.ReportParams = window.aptTecReports.ServerParams; do not set the ReportParams other refresh will be skipped 
        this.#savePassedParamsRefresh(window.aptTecReports.ServerParams);
        this.initJsoneditor();
    }

    #savePassedParamsRefresh(modifiedParams) {
        localStorage.setItem(window.aptTecReports.reportId, JSON.stringify(modifiedParams));
        window.aptTecReports.ReportParams = modifiedParams;
        window.aptTecReports.onReportParametersChanged('reportIframe', true);
    }
}