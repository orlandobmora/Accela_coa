function createTempChild(appNameAppendix, utilityPermitType, emailTemplate) {
    var appName = cap.getSpecialText() + "-" + appNameAppendix;
    var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
    ctm.setGroup("Water");
    ctm.setType("Utility");
    ctm.setSubType("Permit");
    ctm.setCategory("NA");

    createChildResult = aa.cap.createSimplePartialRecord(ctm, appName, "INCOMPLETE EST");
    if (createChildResult.getSuccess()) {
        childCapId = createChildResult.getOutput();
        aa.cap.createAppHierarchy(capId, childCapId);
        // Copy APO
        copyAddresses(capId, childCapId);
        copyParcels(capId, childCapId);
        copyOwner(capId, childCapId);
        // Copy contacts
        copyContacts(capId, childCapId);
        // Update the child Utility Permit Type ASI
        editAppSpecific("Utility Permit Type", utilityPermitType, childCapId);
        // Send an email
        sendEmail(emailTemplate);
    } else {
        logDebug("**WARN creating a temporary child failed, error:" + sent.getErrorMessage());
    }
}




