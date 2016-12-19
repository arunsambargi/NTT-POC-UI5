sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("pmps.ux3.controller.tabIssue", {

		onInit: function(evt) {
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

			var model = new sap.ui.model.json.JSONModel({});
			var view = this.getView();
			var oNavCon = view.byId("navCon");

			this.getView().byId("map_canvas").addStyleClass("myMap");
			var oApplication = this.getView().byId("appMaps");

			var binding = {};

			binding.pager = "M";

			if (binding.pager === "M") {
				var page = view.byId("master");
			} else {
				var page = view.byId("detail");
			}

			//Get the Issues from Hana DataBase
			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/NotificationHeader", null, false);
			var data = cmodel.getData();
			binding.NotificationHeader = [];
			binding.NotificationHeader = data.d.results;

			//this.binding = this.oModel.loadData("/POC/ntt/pmsp/pmsp.xsodata/NotificationHeader");
			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDMaterials", null, false);
			var data = cmodel.getData();
			binding.MDMaterials = [];
			binding.MDMaterials = data.d.results;

			//Load Customer Model
			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDPriority", null, false);
			var data = cmodel.getData();
			binding.MDPriority = [];
			binding.MDPriority = data.d.results;

			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDCustomers", null, false);
			var data = cmodel.getData();
			binding.MDCustomers = [];
			binding.MDCustomers = data.d.results;

			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDUsers", null, false);
			var data = cmodel.getData();
			binding.MDUsers = [];
			binding.MDUsers = data.d.results;

			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/NotificationHeader", null, false);
			var data = cmodel.getData();
			binding.NotificationHeader = [];
			binding.NotificationHeader = data.d.results;

			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/MDPlants", null, false);
			var data = cmodel.getData();
			binding.MDPlants = [];
			binding.MDPlants = data.d.results;

			var oItemSelectTemplate = new sap.ui.core.Item({
				key: "{dkey}",
				text: "{dtext}"
			}); //Define the template for items, which will be inserted inside a select element

			var s1 = {
				"mRoot": [{
					"dkey": "1",
					"dtext": "5"
				}, {
					"dkey": "2",
					"dtext": "10"
				}, {
					"dkey": "3",
					"dtext": "15"
				}, {
					"dkey": "4",
					"dtext": "20"
				}]
			};

			var mySelectMenu = this.byId("mySelectMenu1");
			mySelectMenu.setModel(new sap.ui.model.json.JSONModel(s1)); // set model your_data_model to Select element
			mySelectMenu.bindAggregation("items", "/mRoot", oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above

			var s2 = {
				"mRoot": [{
					"dkey": "1",
					"dtext": "Material"
				}, {
					"dkey": "2",
					"dtext": "Customer"
				}]
			};

			var mySelectMenu = this.byId("mySelectMenu2");
			mySelectMenu.setModel(new sap.ui.model.json.JSONModel(s2)); // set model your_data_model to Select element
			mySelectMenu.bindAggregation("items", "/mRoot", oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above

			var s3 = {
				"mRoot": [{
					"dkey": "1",
					"dtext": "5"
				}, {
					"dkey": "2",
					"dtext": "10"
				}, {
					"dkey": "3",
					"dtext": "15"
				}, {
					"dkey": "4",
					"dtext": "20"
				}]
			};

			//var mySelectMenu = this.byId("mySelectMenu3");
			//mySelectMenu.setModel(new sap.ui.model.json.JSONModel(s3)); // set model your_data_model to Select element
			//mySelectMenu.bindAggregation("items", "/mRoot", oItemSelectTemplate); //bind aggregation, item to Select element with the template selected above

			this.updateTexts(binding);

			model.setData(binding);
			view.setModel(model);

			view.setModel(new sap.ui.model.json.JSONModel({
				globalFilter: "",
				availabilityFilterOn: false,
				cellFilterOn: false
			}), "ui");

			this._oGlobalFilter = null;
			this._oPriceFilter = null;

			this.createModel = new sap.ui.model.odata.ODataModel("/POC/ntt/pmsp/pmsp.xsodata", true);

			oNavCon.to(page);

		},

		filterGlobally: function(oEvent) {
			var sQuery = oEvent.getParameter("query");
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("KUNUM_TEXTS", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("MATNR_TEXTS", sap.ui.model.FilterOperator.Contains, sQuery)
				], false);
			}

			this.getView().byId("idProductsTable").getBinding("items").filter(this._oGlobalFilter, "Application");
		},

		onBackNavPress: function(evt) {
			var view = this.getView();
			var model = view.getModel();
			var binding = model.getData();
			binding.pager = "M";
			if (binding.pager === "M") {
				var page = view.byId("master");
			} else {
				var page = view.byId("detail");
			}
			var oNavCon = view.byId("navCon");

			//Get the Issues from Hana DataBase
			var cmodel = new sap.ui.model.json.JSONModel({});
			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/NotificationHeader", null, false);
			var data = cmodel.getData();
			binding.NotificationHeader = [];
			binding.NotificationHeader = data.d.results;
			this.updateTexts(binding);
			model.setData(binding);

			oNavCon.to(page);
		},
		onPress: function(evt) {

			var view = this.getView();
			var model = view.getModel();
			var binding = model.getData();

			var context = evt.getSource().getBindingContext();
			var contextData = evt.getSource().getBindingContext().getProperty();

			binding.pager = "P";

			if (binding.pager === "M") {
				var page = view.byId("master");
			} else {
				var page = view.byId("detail");
			}

			var oNavCon = view.byId("navCon");

			jQuery.each(binding.MDMaterials, function(i, input) {
				if (contextData.MATNR === input.MATNR) {
					contextData.MATNR = input.MATNR_TEXT;
					return false;
				}
			});

			jQuery.each(binding.MDCustomers, function(i, input) {
				if (contextData.KUNUM === input.KUNNR) {
					contextData.KUNUM = input.KUNNR_TEXT;
					return false;
				}
			});

			jQuery.each(binding.MDUsers, function(i, input) {
				if (contextData.QMNAM === input.UNAME) {
					contextData.QMNAM = input.UNAME_TEXT;
					return false;
				}
			});

			binding.IIssueNumber = contextData.QMNUM;
			binding.ICreateDate = this.formatDate();
			binding.IIssueDate = this.formatDate();
			binding.IIssueTime = this.formatTime();
			binding.IProduct = contextData.MATNR;
			binding.IDescription = contextData.QMTXT;
			binding.IPriority = contextData.PRIOK;
			binding.ICustomer = contextData.KUNUM;
			binding.IUser = contextData.QMNAM;
			binding.IEmail = contextData.EMAL;
			binding.ITelephone = contextData.TELE;

			model.setData(binding);

			oNavCon.to(page);

		},

		updateTexts: function(ip_binding) {

			jQuery.each(ip_binding.NotificationHeader, function(i, input) {
				if (input.MATNR) {
					jQuery.each(ip_binding.MDMaterials, function(im, inputm) {
						if (input.MATNR === inputm.MATNR) {
							ip_binding.NotificationHeader[i].MATNR_TEXTS = inputm.MATNR_TEXT;
							return false;
						}
					});
				}

				if (input.KUNUM) {
					jQuery.each(ip_binding.MDCustomers, function(ik, inputk) {
						if (input.KUNUM === inputk.KUNNR) {
							ip_binding.NotificationHeader[i].KUNUM_TEXTS = inputk.KUNNR_TEXT;
							return false;
						}
					});
				}

				if (input.PRIOK) {
					jQuery.each(ip_binding.MDPriority, function(ip, inputp) {
						if (input.PRIOK === inputp.PRIOK) {
							ip_binding.NotificationHeader[i].PRIOK_TEXTS = inputp.PRIOK_TEXT;
							return false;
						}
					});
				}

				if (input.WERKS) {
					jQuery.each(ip_binding.MDPlants, function(ip, inputpa) {
						if (input.WERKS === inputpa.WERKS) {
							ip_binding.NotificationHeader[i].WERKS_TEXTS = inputpa.WERKS_TEXT;
							return false;
						}
					});
				}

			});

		},

		updateIssue: function(evt) {

			var view = this.getView();
			var model = view.getModel();
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
			jsonSaveData.QMNUM = binding.IIssueNumber;
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

			var sPath = "/NotificationHeader('" + jsonSaveData.QMNUM + "')";

			this.createModel.update(sPath,
				jsonSaveData, null,
				function onSuccess(oData, response) {
					var msg = "Issue updated successfully";
					sap.m.MessageToast.show(msg);
					jQuery.sap.log.info(oData);
					jQuery.sap.log.info(response);
					//that.resetIssue();
				},
				function onError(oError) {
					jQuery.sap.log.error(oError);
					sap.m.MessageBox.show("Error Occured during Issue Updation", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error Occured during Issue Creation",
						actions: [sap.m.MessageBox.Action.CLOSE],
						onClose: function(oAction) {}.bind(this)
					});

				});

		},

		onMapPress: function(evt) {
			var view = this.getView();
			var model = view.getModel();
			var binding = model.getData();
			if (binding.pager === "P") {

				binding.IShowMaps = true;
				model.setData(binding);

				this.getView().byId("map_canvas").addStyleClass("myMap");
				var oApplication = this.getView().byId("map_canvas");
				var test = this.getView().byId("map_canvas").getDomRef();

				delete this.initialized;
				delete this.geocoder;
				delete this.map;

				if (!this.map) {
					delete this.initialized;
				}
				if (!this.initialized) {
					this.initialized = true;
					this.geocoder = new google.maps.Geocoder();
					var mapOptions = {
						center: new google.maps.LatLng(43.70011, -79.4163),
						zoom: 8,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					this.map = new google.maps.Map(this.getView().byId("map_canvas").getDomRef(),
						mapOptions);

					var myLatLng = {
						lat: 43.70011,
						lng: -79.4163
					};

					var marker = new google.maps.Marker({
						position: myLatLng,
						map: this.map,
						title: 'Product Location'
					});

					this.setMarkers(this.map);
				}
			}
		},

		onAfterRendering: function() {
			var view = this.getView();
			var model = view.getModel();
			var binding = model.getData();
			if (binding.pager === "P") {
				this.getView().byId("map_canvas").addStyleClass("myMap");
				var oApplication = this.getView().byId("map_canvas");
				var test = this.getView().byId("map_canvas").getDomRef();

				if (!this.map) {
					delete this.initialized;
				}
				if (!this.initialized) {
					this.initialized = true;
					this.geocoder = new google.maps.Geocoder();
					var mapOptions = {
						center: new google.maps.LatLng(-34.397, 150.644),
						zoom: 8,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					this.map = new google.maps.Map(this.getView().byId("map_canvas").getDomRef(),
						mapOptions);
				}
			}
		},

		setMarkers: function(map) {
			// Adds markers to the map.

			// Data for the markers consisting of a name, a LatLng and a zIndex for the
			// order in which these markers should display on top of each other.
			var beaches = [
				['New York City, NY, USA', 40.730610, -73.935242, 4],
				['Quebec, QC, Canada', 46.803284, -71.242798, 5],
				['Buffalo, NY, USA', 42.886448, -78.878372, 3],
				['Montreal, QC, Canada', 45.516136, -73.656830, 2],
				['Orlando, FL, USA', 28.538336, -81.379234, 1]
			];

			// Marker sizes are expressed as a Size of X,Y where the origin of the image
			// (0,0) is located in the top left of the image.

			// Origins, anchor positions and coordinates of the marker increase in the X
			// direction to the right and in the Y direction down.
			var image = {
				url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
				// This marker is 20 pixels wide by 32 pixels high.
				size: new google.maps.Size(20, 32),
				// The origin for this image is (0, 0).
				origin: new google.maps.Point(0, 0),
				// The anchor for this image is the base of the flagpole at (0, 32).
				anchor: new google.maps.Point(0, 32)
			};
			// Shapes define the clickable region of the icon. The type defines an HTML
			// <area> element 'poly' which traces out a polygon as a series of X,Y points.
			// The final coordinate closes the poly by connecting to the first coordinate.
			var shape = {
				coords: [1, 1, 1, 20, 18, 20, 18, 1],
				type: 'poly'
			};
			for (var i = 0; i < beaches.length; i++) {
				var beach = beaches[i];
				var marker = new google.maps.Marker({
					position: {
						lat: beach[1],
						lng: beach[2]
					},
					map: map,
					icon: image,
					shape: shape,
					title: beach[0],
					zIndex: beach[3]
				});
			}
		},

		onBeforeRendering: function() {

			var cmodel = new sap.ui.model.json.JSONModel({});
			var view = this.getView();
			var model = view.getModel();
			var binding = model.getData();
			var oNavCon = view.byId("navCon");

			if (binding.pager === "P") {
				var page = view.byId("detail");

			} else {
				var page = view.byId("master");
			}

			cmodel.loadData("/POC/ntt/pmsp/pmsp.xsodata/NotificationHeader", null, false);
			var data = cmodel.getData();
			binding.NotificationHeader = [];
			binding.NotificationHeader = data.d.results;

			this.updateTexts(binding);

			model.setData(binding);
			oNavCon.to(page);
		},
		onGetData: function() {

		},
		handleValidation: function(evt) {

			var ret = false;

			// collect input controls
			var view = this.getView();

			var inputs = [
				view.byId("ICTCI8"), //Issue Product
				view.byId("ICTCI4"), //Issue Descriptoin
				view.byId("ICTCI9"), // Customer
				view.byId("ICTCI7"),
				view.byId("ICTCI5"),
				view.byId("ICTCI6")
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

		onSearch: function(oEvt) {

			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = this.getView().byId("idList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
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

		onSelectionChange: function(oEvt) {

			var oList = oEvt.getSource();
			var oLabel = this.getView().byId("idFilterLabel");
			var oInfoToolbar = this.getView().byId("idInfoToolbar");

			// With the 'getSelectedContexts' function you can access the context paths
			// of all list items that have been selected, regardless of any current
			// filter on the aggregation binding.
			var aContexts = oList.getSelectedContexts(true);

			// update UI
			var bSelected = (aContexts && aContexts.length > 0);
			var sText = (bSelected) ? aContexts.length + " selected" : null;
			oInfoToolbar.setVisible(bSelected);
			oLabel.setText(sText);
		}

	});

});