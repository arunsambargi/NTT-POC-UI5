sap.ui.controller("pmps.ux3.controller.App", {

	onInit: function() {

		var userName = this.byId("aribaUserName");

		userName.setText("Hi, Arun Sambargi");

		var dashboard = sap.ui.view("dashboard_main", {
			viewName: "pmps.ux3.view.DashBoard",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.byId("uxShell").setContent(dashboard);

	},

	onAfterRendering: function() {},

	worksetItemSelected: function(oEvent) {
		var sId, oShell, that;
		sId = "";
		sId = oEvent.getParameter("key");
		oShell = oEvent.oSource;
		that = this;
		this.switchWorkListItem(oShell, sId);
	},

	handleLinkPress: function(oEvent) {
		var oShell = oEvent.oSource;
	},

	handleLogOff: function(evt) {},

	fireWorksetItemSelected: function(val) {
		isFromReviewSubmit = true;
		var selectedItem = sap.ui.getCore().byId(val);
		sap.ui.getCore().byId("App--uxShell").fireWorksetItemSelected(
			selectedItem);
	},

});