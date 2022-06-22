var LDSLoggerWrapper = Class.create();
LDSLoggerWrapper.prototype = {
  typeName: this.type,
  initialize: function (cumulativeLogging, scriptSummary) {
    var funcName = "initialize";

    if (!cumulativeLogging) {
      cumulativeLogging = true;
    }

    if (!scriptSummary) {
      scriptSummary = "LDSLoggerWrapper";
    } else {
      this.typeName = scriptSummary;
    }

    this.settings_name = "LDSLoggerWrapper";
    this.settings = new LoggingSettingsHelper(this.settings_name);
    this.log_level = this.settings.getProperty("u_log_level");
    this.event_level = this.settings.getProperty("u_event_level");
    this.default_event_name = this.settings.getProperty("u_default_event_name");
    this.advanced_settings = this.settings.getProperty("u_advanced", false);
    this.snInstance = this.settings.getProperty("instance_name", "ldsdev");

    this.logger = new LDSLogger(
      cumulativeLogging,
      this.log_level,
      this.event_level
    );

    this.logger.debug(this.typeName, funcName, scriptSummary);

    this.logger.debug(
      this.typeName,
      funcName,
      "Advanced Settings: " + this.advanced_settings
    );

    this.logger.debug(
      this.typeName,
      funcName,
      "ServiceNow Instance: " + this.snInstance
    );
  },
  start: function (funcName) {
    this.logger.info(this.typeName + ":" + funcName + ": START");
  },
  end: function (funcName) {
    this.logger.info(this.typeName + ":" + funcName + ": END");
  },
  info: function (funcName, msg) {
    this.logger.info(this.typeName + ":" + funcName + ": " + msg);
  },
  error: function (funcName, msg) {
    this.logger.error(this.typeName + ":" + funcName + ": " + msg);
  },
  warn: function (funcName, msg) {
    this.logger.warning(this.typeName + ":" + funcName + ": " + msg);
  },

  type: "LDSLoggerWrapper",
};
