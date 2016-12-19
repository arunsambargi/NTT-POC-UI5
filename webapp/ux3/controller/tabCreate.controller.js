sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("pmps.ux3.controller.tabCreate", {

		onInit: function() {
			jQuery.sap.require("sap.m.MessageToast");
			jQuery.sap.require("sap.m.MessageBox");

			// attach handlers for validation errors
			sap.ui.getCore().attachValidationError(function(evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("Error");
				}
			});
			sap.ui.getCore().attachValidationSuccess(function(evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("None");
				}
			});

			// set explored app's demo model on this sample
			this.oModel = new sap.ui.model.json.JSONModel({});

			this.binding = {};

			this.resetIssueInternal(this.binding);

			//this.binding = this.oModel.loadData("/POC/ntt/pmsp/pmsp.xsodata/NotificationHeader");
			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDPlants", null, false);
			var data = cmodel.getData();
			this.binding.MDPlants = [];
			this.binding.MDPlants = data.d.results;

			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDMaterials", null, false);
			var data = cmodel.getData();
			this.binding.MDMaterials = [];
			this.binding.MDMaterials = data.d.results;

			//Load Customer Model
			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDPriority", null, false);
			var data = cmodel.getData();
			this.binding.MDPriority = [];
			this.binding.MDPriority = data.d.results;

			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDCustomers", null, false);
			var data = cmodel.getData();
			this.binding.MDCustomers = [];
			this.binding.MDCustomers = data.d.results;

			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDUsers", null, false);
			var data = cmodel.getData();
			this.binding.MDUsers = [];
			this.binding.MDUsers = data.d.results;

			this.oModel.setData(this.binding);

			this.getView().setModel(this.oModel);

			this.createModel = new sap.ui.model.odata.ODataModel("/POC/ntt/pmsp/pmsp.xsodata", true);
		},

		getRandomInt: function(min, max) {
			var num = Math.floor(Math.random() * (max - min + 1)) + min;
			return num.toString();
		},

		resetIssueInternal: function(ip_binding) {
			ip_binding.ICreateDate = this.formatDate();
			ip_binding.IIssueDate = this.formatDate();
			ip_binding.IIssueTime = this.formatTime();
			ip_binding.IProduct = "";
			ip_binding.IDescription = "";
			ip_binding.IPriority = "3";
			ip_binding.ICustomer = "";
			ip_binding.IUser = "";
			ip_binding.IEmail = "";
			ip_binding.ITelephone = "";
			ip_binding.IPriority = "3";
			ip_binding.IEmail = "";
			ip_binding.ITelephone = "";
			ip_binding.IPlant = "";
		},

		formatDate: function() {
			var d = new Date(),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();
			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;
			return [year, month, day].join('-');
		},

		formatTime: function() {
			var date = new Date();
			var hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
			var period = date.getHours() >= 12 ? 'PM' : 'AM';
			var ret = hour + ':' + date.getMinutes() + ' ' + period;
			return ret;
		},

		formatDateInternal: function(ip_date) {
			if (ip_date === "") {
				return "";
			}
			var date = new Date(ip_date);
			return "/Date(" + date.getTime() + ")/";
		},

		formatTimeInternal: function(ip_time) {
			if (ip_time === "") {
				return "";
			}
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "hh:mm a"
			});
			//"PT10H0M0S"
			var time = timeFormat.parse(ip_time);
			return "PT" + time.getHours() + "H" + time.getMinutes() + "M" + time.getSeconds() + "S";
		},

		createIssue: function() {
			var model = this.getView().getModel();
			var binding = model.getData();

			var resultValidation = this.handleValidation();
			if (!resultValidation) {
				return false;
			}

			jQuery.each(binding.MDMaterials, function(i, input) {
				if (binding.IProduct === input.MATNR_TEXT) {
					binding.IProduct = input.MATNR;
					return false;
				}
			});

			jQuery.each(binding.MDCustomers, function(i, input) {
				if (binding.ICustomer === input.KUNNR_TEXT) {
					binding.ICustomer = input.KUNNR;
					return false;
				}
			});

			jQuery.each(binding.MDUsers, function(i, input) {
				if (binding.IUser === input.UNAME_TEXT) {
					binding.IUser = input.UNAME;
					return false;
				}
			});

			var jsonSaveData = {};
			jsonSaveData.QMNUM = this.getRandomInt(1000000, 9999999);

			jsonSaveData.QMART = "M1";
			jsonSaveData.QMTXT = binding.IDescription;
			jsonSaveData.PRIOK = binding.IPriority;

			if (binding.IIssueDate) {
				jsonSaveData.QMDAT = this.formatDateInternal(binding.IIssueDate);
			}

			if (binding.IIssueTime) {
				jsonSaveData.MZEIT = this.formatTimeInternal(binding.IIssueTime);
			}

			if (binding.ICreateDate) {
				jsonSaveData.AEDAT = this.formatDateInternal(binding.ICreateDate);
			}

			if (binding.ICreateDate) {
				jsonSaveData.ERDAT = this.formatDateInternal(binding.ICreateDate);
			}

			jsonSaveData.QMNAM = binding.IUser;
			jsonSaveData.AUFNR = "";
			jsonSaveData.WERKS = binding.IPlant;
			jsonSaveData.MATNR = binding.IProduct;
			jsonSaveData.KUNUM = binding.ICustomer;
			jsonSaveData.ERNAM = binding.IUser;
			jsonSaveData.AENAM = binding.IUser;
			jsonSaveData.TELE = binding.ITelephone;
			jsonSaveData.EMAL = binding.IEmail;

			var that = this;

			var sPath = "/NotificationHeader";
			this.createModel.create(sPath,
				jsonSaveData, null,
				function onSuccess(oData, response) {
					var msg = "Issue created successfully";
					sap.m.MessageToast.show(msg);
					jQuery.sap.log.info(oData);
					jQuery.sap.log.info(response);
					that.resetIssue();
				},
				function onError(oError) {
					jQuery.sap.log.error(oError);
					sap.m.MessageBox.show("Error Occured during Issue Creation", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error Occured during Issue Creation",
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: function(oAction) {}.bind(this)
					});

				});
		},

		handleValidation: function(evt) {

			var ret = false;

			// collect input controls
			var view = this.getView();

			var inputs = [
				view.byId("TCI8"), //Issue Product
				view.byId("TCI4"), //Issue Descriptoin
				view.byId("TCI9"), // Customer
				view.byId("TCI7"),
				view.byId("TCI5"),
				view.byId("TCI6")
			];

			// check that inputs are not empty
			// this does not happen during data binding as this is only triggered by changes
			jQuery.each(inputs, function(i, input) {
				if (!input.getValue()) {
					input.setValueState("Error");
				} else {
					input.setValueState("None");
				}
			});

			// check states of inputs
			var canContinue = true;
			jQuery.each(inputs, function(i, input) {
				if ("Error" === input.getValueState()) {
					canContinue = false;
					return false;
				}
			});

			// output result
			if (canContinue) {
				ret = true;
				//MessageToast.show("The input is correct. You could now continue to the next screen.");
			} else {
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert("Complete your input(s) first.");
			}

			return ret;
		},

		resetIssue: function() {
			// collect input controls
			var view = this.getView();

			var inputs = [
				view.byId("TCI8"), //Issue Product
				view.byId("TCI4"), //Issue Descriptoin
				view.byId("TCI9"), // Customer
				view.byId("TCI7"),
				view.byId("TCI5"),
				view.byId("TCI6")
			];

			// check that inputs are not empty
			// this does not happen during data binding as this is only triggered by changes
			jQuery.each(inputs, function(i, input) {
				input.setValueState("None");
			});

			var model = this.getView().getModel();
			var binding = model.getData();
			this.resetIssueInternal(binding);
			this.binding = binding;
			model.setData(this.binding);
		}

	});

});