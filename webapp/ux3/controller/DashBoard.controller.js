sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("pmps.ux3.controller.DashBoard", {

    onInit: function() {
        this.iconTabBar = this.getView().byId("MainToolBar");
        var model = new sap.ui.model.json.JSONModel({});
        this.getView().setModel(model);
    },

    handleIconTabBarSelect: function(oEvent) {
        var tab = oEvent.getParameter("selectedKey");
        var model = this.getView().getModel();
        this.iconTabBar.setExpanded(true);
    },

    onBeforeRendering: function() {

        var model = this.getView().getModel();

    }

	});

});