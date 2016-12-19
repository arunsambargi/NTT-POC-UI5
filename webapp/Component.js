sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"pmps/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("pmps.Component", {

		metadata: {
			manifest: "json"
		},

		createContent: function() {
			// create root view
			var view = sap.ui.view({
				id: "App",
				viewName: "pmps.ux3.view.App",
				type: sap.ui.core.mvc.ViewType.XML,
				viewData: {
					component: this
				}
			});
			return view;
		},

		init: function() {

			//var url = this.getMetadata().getConfig().serviceConfig.serviceUrl;

			//	this.oListSelector = new ListSelector();
			//	this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			var mow = models.createDeviceModel();
			console.log(mow)
			this.setModel(mow, "device");
			sap.ui.getCore().setModel(mow, "GLOBAL");
			// set the FLP model
			//this.setModel(models.createFLPModel(), "FLP");
			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

		},

		destroy: function() {
			// call Overriden destroy
			UIComponent.prototype.destroy.apply(this, arguments);
		}

	});
});