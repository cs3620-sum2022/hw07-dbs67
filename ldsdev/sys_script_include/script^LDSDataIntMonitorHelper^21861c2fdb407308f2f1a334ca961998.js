var LDSDataIntMonitorHelper = Class.create();
LDSDataIntMonitorHelper.prototype = {
    initialize: function(cumulativeLogging, scriptSummary) {
        var func = "initialize";
        if (!cumulativeLogging) {
            cumulativeLogging = true;
        }
        if (!scriptSummary) {
            scriptSummary = "DataIntegrations Monitoring";
        }

        this.settings_name = "DataIntegrations Monitoring";
        this.settings = new LoggingSettingsHelper(this.settings_name);
        this.log_level = this.settings.getProperty('u_log_level');
        this.event_level = this.settings.getProperty('u_event_level');
        this.default_event_name = this.settings.getProperty('u_default_event_name');
        this.advanced_settings = this.settings.getProperty('u_advanced', false);
        this.snInstance = this.settings.getProperty('instance_name', 'ldsdev');
        this.logger = new LDSLogger(cumulativeLogging, this.log_level, this.event_level);
        this.logger.debug(this.type, func, scriptSummary);
        this.logger.debug(this.type, func, "Advanced Settings: " + this.advanced_settings);
        this.logger.debug(this.type, func, "ServiceNow Instance: " + this.snInstance);

        // Write to log
        this.logger.writeCumulativeEntries(true);
    },

    checkForLockedIntegrationAccounts: function() {
        var func = "checkForLockedIntegrationAccounts";
        this.logger.debug(this.type, func, "Entering function");

        var aIssues = [];

        var issueCount = 0;
        var eventStatus = 'clear';
        var issueStringHeader = 'Integration Accounts Locked';
        var issueString = '';

        // Query for Import Set Failures
        var gr = new GlideRecord('sys_user');
        gr.addQuery('active=true^sys_class_name=sys_user^internal_integration_user=true^web_service_access_only=true^locked_out=true');
        gr.query();
        while (gr.next()) {
            eventStatus = 'error';
            var srcStatus = 'Locked';
            var srcName = gr.user_name;
            issueCount++;
            issueString = issueString + '\nAccount: ' + srcName + ' State: ' + srcStatus + '';
            aIssues.push(issueString);

        }

        var eventDesc = issueStringHeader + ' - Count(' + issueCount + ')\n\n' + issueString;

        // Write to log
        this.logger.writeCumulativeEntries(true);

        if (eventStatus == 'error') {
            var eventDetail = {
                source: 'ServiceNow',
                node: 'ServiceNow Platform',
                type: 'Integration Accounts Locked',
                severity: 3,
                message_key: 'SN_INTEGRATION_ACCOUNT_LOCKED',
                description: eventDesc
            };

            var response = this._createEvent(eventDetail);
        } else {
            var eventDetail1 = {
                source: 'ServiceNow',
                node: 'ServiceNow Platform',
                type: 'Integration Accounts Locked',
                severity: 0,
                message_key: 'SN_INTEGRATION_ACCOUNT_LOCKED',
                description: eventDesc
            };

            var response1 = this._createEvent(eventDetail1);
        }

        // Write to log
        this.logger.writeCumulativeEntries(true);
    },

    checkForFailedImports: function() {
        var func = "checkForFailedImports";
        this.logger.debug(this.type, func, "Entering function");

        var aIssues = [];

        var issueCount = 0;
        var eventStatus = 'clear';
        var issueStringHeader = 'Data Source Integration Errors';
        var issueString = '';

        // Query for Import Set Failures
        var gr = new GlideRecord('sys_progress_worker');
        gr.addQuery('nameSTARTSWITHTransforming:^ORnameSTARTSWITHCreating import set:^state_code!=success^ORstate_code=^state_code=error^sys_created_onRELATIVEGE@hour@ago@24');
        gr.query();
        while (gr.next()) {
            var objSourceConfig = this._getDataSourceConfig(gr.name);
            var srcStatus = objSourceConfig.status;
            var srcName = objSourceConfig.name;
            var srcEnabled = objSourceConfig.enabled;
            var srcNoRecords = objSourceConfig.alert_no_records;
            if (srcStatus == 'success' && srcEnabled == 'true') {
                issueCount++;
                eventStatus = 'error';
                issueString = issueString + 'DataSource: ' + srcName + ' State: ' + gr.state_code + ' Total Run Time: ' + gr.total_run_time.getDisplayValue();
                issueString = issueString + '\nErrorMessage: ' + gr.message + '\n-----------------------------------\n';
                aIssues.push(issueString);
            }

        }

        var eventDesc = issueStringHeader + ' - Count(' + issueCount + ')\n\n' + issueString;

        // Write to log
        this.logger.writeCumulativeEntries(true);

        if (eventStatus == 'error') {
            var eventDetail = {
                source: 'ServiceNow',
                node: 'ServiceNow Platform',
                type: 'Data Source Integration Errors',
                severity: 3,
                message_key: 'SN_DATAINTEGRATION_ERROR',
                description: eventDesc
            };

            var response = this._createEvent(eventDetail);
        }

        // Write to log
        this.logger.writeCumulativeEntries(true);
    },

	// Method called by the ServiceNow Monitor SAM Jobs for Errors scheduled job
    checkForFailedSAMImports: function() {
        var func = "checkForFailedSAMImports";
        this.logger.debug(this.type, func, "Entering function");

        var aIssues = [];

        var issueCount = 0;
        var eventStatus = 'clear';
        var issueStringHeader = 'Software Asset Job Errors';
        var issueString = '';

        // Query for Import Set Failures
        var gr = new GlideRecord('samp_job_log');
        gr.addQuery('status=failed^sys_created_onRELATIVEGE@hour@ago@24');
        gr.query();
        while (gr.next()) {
            //var objSourceConfig = this._getDataSourceConfig(gr.name);
            var srcStatus = gr.status;
            var srcName = gr.name;
            var srcNumber = gr.number;
            issueCount++;
            eventStatus = 'error';
            issueString = issueString + 'DataSource: ' + srcName + ' \nState: ' + srcStatus + ' \nNumber: ' + srcNumber;
            issueString = issueString + '\n-----------------------------------\n';
            aIssues.push(issueString);
        }

        var eventDesc = issueStringHeader + ' - Count(' + issueCount + ')\n\n' + issueString;

        // Write to log
        this.logger.writeCumulativeEntries(true);

        if (eventStatus == 'error') {
            var eventDetail = {
                source: 'ServiceNow',
                node: 'ServiceNow Platform',
                type: 'Software Asset Job Errors',
                severity: 3,
                message_key: 'SN_SAMJOB_ERROR',
                description: eventDesc
            };

            var response = this._createEvent(eventDetail);
        }

        // Write to log
        this.logger.writeCumulativeEntries(true);
    },

    _getDataSourceConfig: function(srcName) {
        var func = "_getDataSourceConfig";
        this.logger.debug(this.type, func, "Entering function");
        this.logger.debug(this.type, func, "Variables: srcName: " + srcName);
        var response = {
            name: '',
            status: '',
            enabled: 'false',
            alert_no_records: 'false'
        };

        var aSplit = srcName.split(': ');
        var tblName = aSplit[1];
        this.logger.debug(this.type, func, "Searching for: " + tblName);
        // Get Data Source
        var gr = new GlideRecord('sys_data_source');
        gr.addQuery('import_set_table_name=' + tblName);
        gr.query();
        if (gr.next()) {
            response.name = gr.name.toString();
            response.enabled = gr.u_operational_monitoring.toString();
            response.alert_no_records = gr.u_alert_on_no_records.toString();
            response.status = 'success';

        } else {
            response.status = 'failed';
        }

        // Write to log
        this.logger.writeCumulativeEntries(true);

        return response;
    },

    _createEvent: function(eventDetail) {
        var func = "_createEvent";
        this.logger.debug(this.type, func, "Entering function");
        var event = new GlideRecord('em_event');
        event.initialize();
        event.source = eventDetail.source;
        event.node = eventDetail.node;
        event.type = eventDetail.type;
        event.severity = eventDetail.severity;
        event.message_key = eventDetail.message_key;
        event.description = eventDetail.description;
        var result = event.insert();

        // Write to log
        this.logger.writeCumulativeEntries(true);

        return result;
    },

    type: 'LDSDataIntMonitorHelper'
};