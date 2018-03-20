//Script 207
//Record Types:	Building/Permit/New Building/NA 
//Event: 		WTUA
//Desc:	 
//
//              Criteria wfTask = = Certification of Occupancy status = Final CO Issued or Not Required 
//             			and If custom field “Single Family Detached home” = “No” 
//
//              Action then auto generate the record “Fire/Primary Inspection/NA/NA” 
//              		and auto populate the custom field “Building Square Footage” from 
//						the Building/Permit/New Building/NA record when the workflow status is 
//						“CO Issued” on the building record. 
//
//Created By: Silver Lining Solutions

function script207_SetTotalSqFtOnFireRecord() {
	logDebug("script207_SetTotalSqFtOnFireRecord() started.");
	try {
	if(wfTask == "Certification of Occupancy" && (wfStatus == "Final CO Issued" || wfStatus == "Not Required") && {Single Family Detached home} == "No")
		{
		var cCapId = createChild("Fire", "Primary Inspection", "NA", "NA", ""); // this function
		if (cCapId != null) {
			editAppSpecific("Building Square Footage", "9999", cCapId);
		}
	}
	catch (err) {
		comment("Error on custom function script207_SetTotalSqFtOnFireRecord(). Please contact administrator. Err: " + err);
	}

};//END script207_SetTotalSqFtOnFireRecord();
