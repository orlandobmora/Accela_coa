//script40_backFlowPreventerEmail Functions
//created by swakil

script40_backFlowPreventerEmail();
function script40_backFlowPreventerEmail()
{
	logDebug("Started script40_backFlowPreventerEmail..");
	if (wfTask == "Backflow Preventor" && wfStatus == "Final")
	{
		var applicant = getContactByType("Applicant", capId);
		if (!applicant || !applicant.getEmail())
		{
			logDebug("**WARN no applicant found on or no email capId=" + capId);
			return false;
		}
		var email = applicant.getEmail();
		var emailtemplatename = "BACKFLOW PREVENTER NOTIFICATION";
		var vEParams = aa.util.newHashtable();
		var emailparams = aa.util.newHashtable();
		emailparams = addStdVarsToEmail(vEParams, capId);
		emailparams.put("$$wfDate$$", wfDate);
		emailAsync(email, emailtemplatename, emailparams, "", "", "", "");
	}
	logDebug("Ended #40_backFlowPreventerEmail..");
};