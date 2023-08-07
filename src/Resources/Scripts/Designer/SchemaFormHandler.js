//Editor =================================================== Refer https://github.com/json-editor/json-editor
class SchemaFormHandler {
    constructor(containerId) {
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
        if (this.jsoneditor)
        { //if jsoneditor is already loaded just set the new values to designer.
            //jsoneditor.destroy(); // destroy old JSONEditor instance if exists
            this.jsoneditor.setValue(aptTecReports.ReportParams);
            return;
        }
        this.paramEditorOptions.schema = aptTecReports.ReportSchema;

        // new instance of JSONEditor
        this.jsoneditor = new window.JSONEditor(this.jsonEditorForm, this.paramEditorOptions);
        // we can enable/disable entire form or part of the form as well
        //editor.getEditor('root.location').disable();

        this.jsoneditor.on('ready', () =>    //if it is loaded for the first time, try to get the values from global object
        {
            // Now the api methods will be available
            this.jsoneditor.setValue(aptTecReports.ReportParams);
        });

        // listen for changes
        //this.jsoneditor.on('change', function () {
        //    saveParameters();
        //});
    }
    saveParameters() {
        // validate
        var validationErrors = this.jsoneditor.validate();
        if (validationErrors.length)
        {
            this.isValidData = false;
            // this.designerValidationErrors is an array of objects, each with a `path`, `property`, and `message` parameter
            // `property` is the schema keyword that triggered the validation error (e.g. "minLength")
            // `path` is a dot separated path into the JSON object (e.g. "root.path.to.field")
            this.designerValidationErrors = JSON.stringify(validationErrors, null, 2)
            alert(this.designerValidationErrors);
        } else
        {
            this.isValidData = true;
            // output
            var reportParams = this.jsoneditor.getValue();
            localStorage.setItem(aptTecReports.ReportId, JSON.stringify(reportParams));
            aptTecReports.ReportParams = reportParams;
            //refreshReport('reportIframe', aptTecReports.ReportId);
            aptTecReports.onReportParametersChanged('reportIframe', true);
            //modifiedParams = JSON.stringify(json, null, 2); 
        }
    }
    resetParameters() {
        localStorage.removeItem(aptTecReports.ReportId);    //remove local report configuration
        aptTecReports.ReportParams = aptTecReports.ServerParams;
        this.jsoneditor.setValue(aptTecReports.ReportParams);
        aptTecReports.onReportParametersChanged('reportIframe', true);
    }
}