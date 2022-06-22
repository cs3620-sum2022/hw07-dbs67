var NagiosXiEventUtils = Class.create();
NagiosXiEventUtils.prototype = {
  initialize: function () {
    this.log = new LDSLoggerWrapper("NagiosXiRestUtils");
    this.knownServices = [
      "boot",
      "cpu",
      "home",
      "load",
      "memory",
      "opt",
      "ping",
      "root",
      "swap",
      "tcpstats",
      "usr",
      "var",
      "vintela_connection",
    ];
    this.serverClassType = ["cmdb_ci_linux_server", "cmdb_ci_win_server"];
    this.typesWithMultiSelect = [
      "disk",
      "procs",
      "neterrors",
      "netusage",
      "servs",
    ];
    this.urlMonitors = ["url", "canaryjson"];
  },

  processEvent: function (event, parm1, parm2) {
    var funcName = "processEvent";
    this.log.start(funcName);
    switch (event) {
      case "ics.nagios.monitor.monitor.add":
        this.log.info(funcName, "Processing event: " + event);
        this._addService(parm1, parm2);
        break;
      case "ics.nagios.monitor.monitor.delete":
        this.log.info(funcName, "Processing event: " + event);
        this._deleteService(parm1, parm2);
        break;
      case "ics.nagios.monitor.host.add":
        this.log.info(funcName, "Processing event: " + event);
        this._addHost(parm1, parm2);
        break;
      case "ics.nagios.monitor.host.delete":
        this.log.info(funcName, "Processing event: " + event);
        this._deleteHost(parm1, parm2);
        break;
    }
    this.log.end(funcName);
  },

  _addService: function (srvc, usr) {
    var funcName = "_addService";
    this.log.start(funcName);

    srvc = JSON.parse(srvc);
    usr = JSON.parse(usr);

    switch (this._isMultiSelect(srvc.service_type)) {
      case true:
        this._addMultipleServices(srvc);
        break;
      case false:
        this._addSingleService(srvc);
        break;
      default:
        if (this._isUrlMonitor(srvc.service_type)) {
          this._addUrl(srvc); //TODO code _addUrl(srvc)
        }
    }

    this._sendEmail(usr);
  },

  _addMultipleServices: function (srvc) {
    var funcName = "_addMultipleServices";
    this.log.start(funcName);

    var nxi = new NagiosXiRestUtils();

    for (var i = 0; i < srvc.service.length; i++) {
      res = nxi.setService(
        srvc.ciName,
        this._getHostType(srvc.host_type),
        srvc.address,
        srvc.service_type
      );

      if (res === false) {
        var msg =
          "Request to Nagios XI failed, please look in the logs for 'executeNagiosXiRequest'.";
        this.log.error(funcName, msg);

        errDetails.push({
          success: false,
          service: srvc.service[i],
          message: msg,
        });
      }
    }
    this.log.end(funcName);

    return {
      success: true,
      message: "All services set for " + srvc.ciName,
    };
  },

  _addSingleService: function (srvc) {
    var funcName = "_addSingleService";
    this.log.start(funcName);

    this.log.info(funcName, "Adding service: " + srvc.service_type);

    if (!this._isKnownService(srvc.server_type)) {
      var msg = "Unknown service: " + srvc.service_type;
      this.log.error(funcName, msg);
      return { success: false, message: msg };
    }

    var nxi = new NagiosXiRestUtils();

    res = nxi.setService(
      srvc.ciName,
      this._getHostType(srvc.host_type),
      srvc.address,
      srvc.service_type
    );

    if (res === false) {
      var msg =
        "Request to Nagios XI failed, please look in the logs for 'executeNagiosXiRequest'.";
      this.log.error(funcName, msg);
      return {
        success: false,
        message: msg,
      };
    }

    this.log.end(funcName);

    return {
      success: true,
      message: srvc.service_type + " set for " + srvc.ciName,
    };
  },

  _addUrl: function (srvc) {
    var opts = {};
    if (this.serverClassType.indexOf(srvc.host_type) !== -1 && srvc.host_id) {
      opts.hostId = srvc.host_id;
    }
    if (srvc.url) {
      opts.url = srvc.url;
      opts.url_text_check = srvc.url_text_check;
    } else {
      opts.json_url = srvc.json_url;
      opts.json_path = srvc.json_path;
      opts.json_value = srvc.json_value;
    }

    var nxi = new NagiosXiRestUtils();
    var res = nxi.setUrl(srvc.ciName, opts, srvc.userID);
  },

  _getHostType: function (className) {
    var funcName = "_getHostType";
    this.log.start(funcName);
    switch (className) {
      case "cmdb_ci_linux_server":
        this.log.info(funcName, 'returning "linux"');
        return "linux";
      case "u_cmdb_ci_oracle_database":
        this.log.info(funcName, 'returning "oracle_database"');
        return "oracle_database";
      case "cmdb_ci_windows_server":
        this.log.info(funcName, 'returning "windows"');
        return "windows";
    }
    this.log.info(funcName, 'returning "unknown"');
    return "unknown";
  },

  _isKnownService: function (srvcType) {
    // return this.knownServices.indexOf(srvcType) != -1;
    for (var i = 0; i < this.knownServices.length; i++) {
      if (this.knownServices[i].name == srvcType) {
        return true;
      }
    }
    return false;
  },

  _isMultiSelect: function (srvcType) {
    return this.typesWithMultiSelect.indexOf(srvcType) != -1;
  },

  _isUrlMonitor: function (srvcType) {
    return this.urlMonitors.indexOf(srvcType) != -1;
  },

  _sendEmail: function (usr) {
    var funcName = "sendEmail";
    this.log.start(funcName);
    gs.eventQueue(
      "ics.nagios.monitor.email",
      null,
      usr.userSysId,
      JSON.stringify(usr)
    );
    this.log.info(funcName, "queued send email event");
    this.log.end(funcName);
  },

  type: "NagiosXiEventUtils",
};
