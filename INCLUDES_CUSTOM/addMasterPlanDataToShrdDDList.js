function addMasterPlanDataToShrdDDList(asiFieldName, recordReqStatus, inactivateRowValue) {

	if (appStatus != recordReqStatus) {
		logDebug("**WARN no match capStatus: " + cap.getCapStatus());
		return false;
	}

	var sharedDDL_asiValue_MAP = new Array();
	sharedDDL_asiValue_MAP["Single Family"] = "BLD SINGLE FAMILY MASTER";
	sharedDDL_asiValue_MAP["Multi Family"] = "BLD MULTI FAMILY MASTER";
	sharedDDL_asiValue_MAP["Other"] = "BLD OTHER FAMILY MASTER";

	//check if AInfo is loaded with useAppSpecificGroupName=true,
	//we need it useAppSpecificGroupName=false, most of time we don't have subgroup name
	var asiValue = null;
	if (useAppSpecificGroupName) {
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		asiValue = getAppSpecific(asiFieldName);
		useAppSpecificGroupName = olduseAppSpecificGroupName;
	} else {
		asiValue = AInfo[asiFieldName];
	}

	if (!asiValue || asiValue == null || asiValue == "") {
		logDebug("**WARN '" + asiFieldName + "' is null or empty, capId=" + capId);
		return false;
	}

	var sharedDDLName = sharedDDL_asiValue_MAP[asiValue];

	var bizDomainResult = aa.bizDomain.getBizDomainByValue(sharedDDLName, inactivateRowValue);
	if (bizDomainResult.getSuccess()) {
		bizDomainResult = bizDomainResult.getOutput();
		if (bizDomainResult != null && bizDomainResult.getBizDomain().getAuditStatus() == "A") {
			//in-activate:
			var bizModel = bizDomainResult.getBizDomain();
			bizModel.setAuditStatus("I");
			var edit = aa.bizDomain.editBizDomain(bizModel, "en_US");
			if (!edit.getSuccess()) {
				logDebug("**WARN DDL '" + sharedDDLName + "' - Edit failed, Error: " + edit.getErrorMessage());
			}
		}//active
	}//DDL row exist

	var appName = cap.getSpecialText();
	if (appName == null || appName == "") {
		logDebug("**WARN application name is null or empty, capId=" + capId);
		return false;
	}

	var added = aa.bizDomain.createBizDomain(sharedDDLName, appName, "A", "");
	if (!added.getSuccess()) {
		logDebug("**WARN DDL '" + sharedDDLName + "' - Add Row failed, Error: " + added.getErrorMessage());
	}
}