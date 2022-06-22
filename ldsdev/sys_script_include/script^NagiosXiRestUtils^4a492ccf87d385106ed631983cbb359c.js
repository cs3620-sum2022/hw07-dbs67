NagiosXiRestUtils = Class.create();
NagiosXiRestUtils.prototype = {
  initialize: function (cumulativeLogging, scriptSummary) {
    var funcName = "initialize";
    if (!cumulativeLogging) {
      cumulativeLogging = true;
    }
    if (!scriptSummary) {
      scriptSummary = "NagiosXiRestUtils";
    }
    // this.protocol = protocol || "http";
    // this.hostname = host || "10.55.155.39";
    // this.port = port || 80;
    // this.path = path || "nagiosxi/api/v1/objects/";
    // this.endpoint = protocol + "://" + hostname + ":" + port + "/" + path;

    this.settings_name = "NagiosXiRestUtils";
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
    this.logger.debug(
      this.type,
      func,
      "Advanced Settings: " + this.advanced_settings
    );
    this.logger.debug(
      this.type,
      func,
      "ServiceNow Instance: " + this.snInstance
    );

    this.logger.writeCumulativeLog(true);
  },
  midServer: (function () {
    var funcName = "midServer";
    this.logger.debug(this.type, funcName, "START");

    var restMidServer = new FindMidServerByCapability("REST");
    var midServerName = restMidServer.find();

    this.logger.info(this.type, funcName, "midServerName = " + midServerName);
    this.logger.debug(this.type, funcName, "END");
    this.logger.writeCumulativeLog(true);

    return midServerName;
  })(),

  _nixSrvc: [
    {
      name: "ping",
      template:
        "host_name=$hostname&service_description=Ping&use=generic-ping&check_command=check_ping!500,50%!1000,70%&force=1",
    },
    {
      name: "cpu",
      template:
        "host_name=$hostname&service_description=CPU&use=check_lnx_cpu&check_command=check_lnx_cpu!95!97&force=1",
    },
    {
      name: "memory",
      template:
        "host_name=$hostname&service_description=Memory&use=check_lnx_mem&check_command=check_lnx_mem!0!0&force=1",
    },
    {
      name: "neterrors",
      template:
        "host_name=$hostname&service_description=Net Errors-$net_int&use=check_lnx_net_errors&check_command=check_lnx_net_errors!$net_int&force=1",
    },
    {
      name: "netusage",
      template:
        "host_name=$hostname&service_description=Net Usage-$net_int&use=check_lnx_net_usage&check_command=check_lnx_net_usage!$net_int&force=1",
    },
    {
      name: "procs",
      template:
        "host_name=$hostname&service_description=Procs&use=check_unix_procs_ssl&check_command=check_unix_procs_ssl!1800!1800&force=1",
    },
    {
      name: "load",
      template:
        "host_name=$hostname&service_description=Load&use=check_unix_load_ssl&check_command=check_unix_load_ssl!70,70,70!80,80,80&force=1",
    },
    {
      name: "swap",
      template:
        "host_name=$hostname&service_description=Swap&use=check_unix_swap_ssl&check_command=check_unix_swap_ssl!20%!10%&force=1",
    },
    {
      name: "tcpstats",
      template:
        "host_name=$hostname&service_description=TCPstats&use=check_lnx_netconn&check_command=check_lnx_netconn&force=1",
    },
    {
      name: "vintela_connection",
      template:
        "host_name=$hostname&service_description=vintela_connection&use=check_vintela_connection_ssl&check_command=check_vintela_connection_ssl&force=1",
    },
    {
      name: "root",
      template:
        "host_name=$hostname&service_description=Disk Space-/&use=check_unix_disk_ssl&check_command=check_unix_disk_ssl!10%!5%!/&force=1",
    },
    {
      name: "boot",
      template:
        "host_name=$hostname&service_description=Disk Space-/boot&use=check_unix_disk_ssl&check_command=check_unix_disk_ssl!10%!5%!/boot&force=1",
    },
    {
      name: "home",
      template:
        "host_name=$hostname&service_description=Disk Space-/home&use=check_unix_disk_ssl&check_command=check_unix_disk_ssl!10%!5%!/home&force=1",
    },
    {
      name: "opt",
      template:
        "host_name=$hostname&service_description=Disk Space-/opt&use=check_unix_disk_ssl&check_command=check_unix_disk_ssl!10%!5%!/opt&force=1",
    },
    {
      name: "tmp",
      template:
        "host_name=$hostname&service_description=Disk Space-/tmp&use=check_unix_disk_ssl&check_command=check_unix_disk_ssl!10%!5%!/tmp&force=1",
    },
    {
      name: "usr",
      template:
        "host_name=$hostname&service_description=Disk Space-/usr&use=check_unix_disk_ssl&check_command=check_unix_disk_ssl!10%!5%!/usr&force=1",
    },
    {
      name: "var",
      template:
        "host_name=$hostname&service_description=Disk Space-/var&use=check_unix_disk_ssl&check_command=check_unix_disk_ssl!10%!5%!/var&force=1",
    },
  ],

  setMidServer: function (midServer) {
    var funcName = "setMidServer";

    this.log.start(funcName);

    if (midServer) {
      this.midServer = midServer;
    }

    this.log.end(funcName);
  },

  indexOfHost: function (array, attribute, value) {
    var funcName = "indexOfHost";
    this.log.start(funcName);

    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attribute] === value) {
        this.log.end(funcName);
        return i;
      }
    }
    this.log.end(funcName);
    return -1;
  },

  lookupHostGroup: function (hostGroupNameId, hostGroups) {
    var funcName = "lookupHostGroup";
    this.log.start(funcName);

    for (var i = 0; i < hostGroups.length; i += 1) {
      var hostGroup = hostGroups[i];
      for (var j = 0; j < hostGroup.members.host.length; j += 1) {
        if (hostGroup.members.host[j].host_object_id == hostGroupNameId) {
          this.log.end(funcName);
          return hostGroup.hostgroup_name;
        }
      }
    }
    this.log.end(funcName);
    return null;
  },

  executeNagiosXiRequest: function (endpoint, payload) {
    var funcName = "executeNagiosXiRequest";
    var httpStatusCode;
    var resBody;

    this.log.start(funcName);

    if (!payload) {
    }

    try {
      this.log.info(funcName, "Executing request");

      var req = new sn_ws.RESTMessageV2("Nagios XI ReST Web Service", endpoint);
      req.setEccParameter("skip_sensor", true);
      req.setHttpTimeout(30000);
      req.setMIDServer(this.midServer);

      this.log.info(funcName, "MID Server = " + this.midServer);

      var res = req.execute();
      if (res.haveError()) {
        this.log.error(
          funcName,
          "Error returned: " + res.getErrorCode() + "-" + res.getErrorMessage()
        );
        return false;
      }

      httpStatusCode = res.getStatusCode();
      if (httpStatusCode != 200) {
        this.log.error(
          funcName,
          "Invalid HTTP response code: " + httpStatusCode
        );
        return false;
      }

      resBody = res.getBody();
      this.log.info(funcName, "Request succeeded (" + httpStatusCode + ")");
      this.log.end(funcName);

      return resBody;
    } catch (ex) {
      resBody = ex.getMessage();
      httpStatusCode = 500;
      this.log.error(resBody);
      return false;
    }
  },

  syncHostGroups: function () {
    var funcName = "syncHostGroups";

    this.log.start(funcName);
    this.log.end(funcName);
    return this.executeNagiosXiRequest("Get HostGroups");
  },

  syncHosts: function () {
    var funcName = "syncHosts";

    this.log.start(funcName);
    this.log.end(funcName);
    return this.executeNagiosXiRequest("Get Hosts");
  },

  syncServices: function () {
    var funcName = "syncServices";

    this.log.start(funcName);
    this.log.end(funcName);
    return this.executeNagiosXiRequest("Get Services");
  },

  setUrl: (function (ciName, opts, usrId) {})(),

  setService: function (ciName, hostType, ipAddress, serviceType, service) {
    var funcName = "setService";
    this.logger.info(this.type, funcName, "START");

    if (!ciName) {
      return { success: false, message: "ciName is required" };
    }

    if (!hostType) {
      return { success: false, message: "hostType is required" };
    }

    if (!ipAddress || !Array.isArray(ipAddress)) {
      return {
        success: false,
        message: "Parameter ipAddress not set.",
      };
    }

    if (!serviceType) {
      return { success: false, message: "serviceType is required" };
    }

    this.logger.info(this.type, funcName, "serviceType=" + serviceType);

    for (var i = 0; i < this._nixSrvc.length; i++) {
      this.logger.info(
        this.type,
        funcName,
        "_nixSrvc[i].name=" + _nixSrvc[i].name
      );
      if (serviceType == _nixSrvc[i].name) {
        this.logger.info(
          this.type,
          funcName,
          "template=" + _nixSrvc[i].template
        );
      }
    }

    this.logger.info(this.type, funcName, "END");
    this.logger.writeCumulativeLog(true);

    return this.executeNagiosXiRequest("Add Service");
  },

  /* Getting the list of hosts and services from the Nagios XI server and then sanitizing the data. */
  getCiMonitorNames: function (recordCount) {
    var funcName = "getCiMonitorNames";
    this.log.start(funcName);

    if (!recordCount) {
      recordCount = -1;
    }

    var hostGroups = JSON.parse(this.syncHostGroups()).hostgroup;

    var hosts = JSON.parse(this.syncHosts()).host;
    if (hosts.length == 0) {
      this.log.error(funcName, "No hosts");
      return false;
    }

    var services = JSON.parse(this.syncServices()).service;
    if (services.length == 0) {
      this.log.error(funcName, "No services");
      return false;
    }

    var ciMonitorNames = this.sanitizeCiMonitorNames(
      hosts,
      services,
      hostGroups,
      recordCount
    );

    this.log.end(funcName);
    return ciMonitorNames;
  },

  /* Taking the list of hosts and services and then creating a new array that contains the host name,
    host address, host id, service id, and service description. */
  sanitizeCiMonitorNames: function (hosts, services, hostGroups, recordCount) {
    var funcName = "sanitizeCiMonitorNames";
    this.log.start(funcName);

    if (hosts == false || services == false) {
      this.log.end(funcName);

      return false;
    }

    var ciMonitorNames = [];
    var servicesLen = recordCount;

    if (servicesLen === -1) {
      servicesLen = services.length;
    }

    for (var j = 0; j < servicesLen; j++) {
      var idx = this.indexOfHost(
        hosts,
        "host_object_id",
        services[j].host_object_id
      );

      if (host == -1) {
        continue;
      }

      var host = hosts[idx];
      var hostGroupName = this.lookupHostGroup(host.host_object_id, hostGroups);

      var ciMonitorName = {
        address: host.address,
        alias: host.alias,
        hostGroupName: hostGroupName,
        hostId: host.host_object_id,
        hostName: host.host_name,
        nagiosHostId: services[j].host_object_id,
        nagiosServiceId: services[j].object_id,
        lastUpdateDate: new Date(),
        serviceId: services[j].object_id,
        serviceHostId: services[j].host_object_id,
        serviceDescription:
          "Host: " +
          host.host_name +
          " Service: " +
          services[j].service_description,
        sourceId: host.host_object_id + "-" + services[j].object_id,
      };

      ciMonitorNames.push(ciMonitorName);
    }

    this.log.end(funcName);

    return ciMonitorNames;
  },

  /* Creating an import set. */
  createImportSet: function () {
    var funcName = "createImportSet";
    this.log.start(funcName);

    gs.setProperty("glide.import_set_insert_serialized.u_imp_nagios", false);

    var grImportSet = new GlideRecord("sys_import_set");
    grImportSet.initialize();
    grImportSet.short_description = "Type: CUSTOM";
    grImportSet.data_source = "c961704b875785106ed631983cbb3572";
    grImportSet.mode = "asynchronous";
    grImportSet.table_name = "u_imp_nagios";
    grImportSet.state = "Loading";
    grImportSet.insert();

    this.log.info(funcName + " " + grImportSet.number);
    this.log.end(funcName);

    return grImportSet.sys_id;
  },

  /* Updating the import set. */
  updateImportSet: function (sysId) {
    var funcName = "updateImportSet";
    this.log.start(funcName);

    var grImportSet = new GlideRecord("sys_import_set");
    grImportSet.addQuery("sys_id", sysId);
    grImportSet.query();
    grImportSet.next();
    grImportSet.state = "Loaded";
    grImportSet.load_completed = new GlideDateTime();
    grImportSet.update();

    this.log.end(funcName);
  },

  spliceIntoChunks: function (arr, chunkSize) {
    var funcName = "spliceIntoChunks";
    this.log.start(funcName);

    var res = [];
    while (arr.length > 0) {
      var chunk = arr.splice(0, chunkSize);
      res.push(chunk);
    }

    this.log.end(funcName);
    return res;
  },

  importSetTableInsert: function (importSetSysId, rowNum, row) {
    var importSetTable = new GlideRecord("u_imp_nagios");

    importSetTable.initialize();
    importSetTable.u_alias = row.alias;
    importSetTable.u_nagios_host_id = row.serviceHostId;
    importSetTable.u_nagios_service_id = row.serviceId;
    importSetTable.u_service_description = row.serviceDescription;
    importSetTable.u_source_id = row.sourceId;
    importSetTable.u_source = "Nagios XI";
    importSetTable.sys_import_set = importSetSysId;
    importSetTable.sys_import_row = rowNum;
    importSetTable.sys_transform_map = "3b456ce56faf93c42677511bbb3ee438";
    importSetTable.u_last_update_date = row.lastUpdateDate;
    importSetTable.insert();
  },

  loadCiMonitorNames: function (numberOfRecordsToRetrieve) {
    var funcName = "loadCiMonitorNames";
    this.log.start(funcName);

    var ciMonitorNames = this.getCiMonitorNames(numberOfRecordsToRetrieve);

    // sanity double-check
    if (numberOfRecordsToRetrieve == -1 || ciMonitorNames === false) {
      if (ciMonitorNames == false) {
        this.log.error(funcName, "ERROR: " + ciMonitorNames);
        return false;
      }
      if (numberOfRecordsToRetrieve == -1) {
        numberOfRecordsToRetrieve = ciMonitorNames.length;
      }
    }

    this.log.info(
      funcName,
      "Number of records to retrieve: " + numberOfRecordsToRetrieve
    );

    for (var i = 0; i < ciMonitorNames.length; i++) {
      this.importSetTableInsert(null, i, ciMonitorNames[i]);
    }

    this.log.end(funcName);

    return ciMonitorNames;
  },

  type: "NagiosXiRestUtils",
};
