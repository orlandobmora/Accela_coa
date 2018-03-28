var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	}	eval(getScriptText("INCLUDES_CUSTOM",null,useProductScript));if (documentOnly) {	doStandardChoiceActions2(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName, servProvCode, useProductScripts) {	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();	vScriptName = vScriptName.toUpperCase();	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		if (useProductScripts) {			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		} else {			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");		}		return emseScript.getScriptText() + "";	} catch (err) {		return "";	}}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z); 

/*
User code generally goes inside the try block below.
*/
showDebug = true;

//WTUA:Building/Permit/*/*

updateExpirationDateAsi();

/*
Title : Set the Code Reference custom field value (WorkflowTaskUpdateAfter)
Purpose : If the workflow status = "Issued" and the custom field "Code Reference" is not filled out with data then
          update the "Code Reference" field with the value "2015 I-Codes/Aurora Muni Codes/2017-NEC".

Author: Ahmad WARRAD
 
Functional Area : Records

Sample Call:
	setCodeReference("Complete");

Notes:
1- The script will update the "Code Reference" custom field, when the workflow status = "Complete"
*/

// In specification record the status is "Issued", but we set it to "Complete", since we didn't find an "Issued" status
var wfStatusCompareVal = "Complete";
setCodeReference(wfStatusCompareVal);

/*------------------------------------------------------------------------------------------------------/
Title 		: Building Certificate of Occupancy does Complete on License WF(WorkflowTaskUpdateAfter).

Purpose		:If the workflow task “Inspection Phase” has a status of “Temporary CO Issued” or “Ready for CO” then use the address on
		the record to go out and see if an MJ License Application exists on that address. and If a MJ License Application exists on
		that address then close the workflow task “Certificate of Occupancy” with a status of “Final CO Issued”.
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : closeWfTaskCertificateOfOccupancy()

Notes		: Provided Record type "MJ License Application" , is not available ,replaced with a Sample Record Type "Licenses/Marijuana/Retail Store/License"
	          ,to be replaced with the correct record type
/------------------------------------------------------------------------------------------------------*/
closeWfTaskCertificateOfOccupancy();

/*------------------------------------------------------------------------------------------------------/
Title	: Building Certificate of Occupancy does Complete on License WF(WorkflowTaskUpdateAfter).
Purpose	: Send email to Applicant email address using tempalte BACKFLOW PREVENTER NOTIFICATION if wfTask == "Backflow Preventor" && wfStatus == "Final"
Author	: Suhail Wakil
Functional Area : Record WF
Sample Call : script40_backFlowPreventerEmail()
/------------------------------------------------------------------------------------------------------*/
script40_backFlowPreventerEmail();

//Supporting Functions
function script40_backFlowPreventerEmail(){
	//if (wfTask == "Backflow Preventor" && wfStatus == "Final") {
		var applicant = getContactByType("Applicant", capId);
		if (!applicant || !applicant.getEmail()) {
			logDebug("**WARN no applicant found on or no email capId=" + capId);
			return false;
		}
		var email = applicant.getEmail();
		var emailtemplatename = "BACKFLOW PREVENTER NOTIFICATION";
		var vEParams = aa.util.newHashtable();
		var emailparams = addStdVarsToEmail(vEParams, capId);
		emailparams.put("$$wfDate$$", "01/01/2018");
		emailAsync(email, emailtemplatename, emailparams, "", "", "", "");

	//}
}

