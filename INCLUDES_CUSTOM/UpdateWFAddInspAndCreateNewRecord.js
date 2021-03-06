function UpdateWFAddInspAndCreateNewRecord(){
	if (inspType=="Non-warranty Inspection" && inspResult=="Passed"){
		deactivateActiveTasks("ENF_TREE_PLANT");
	}else if (inspType=="Non-warranty Inspection" && inspResult=="Failed"){
		//create a new insp of type Tree Removal
		scheduleInspect(capId,"Tree Removal",0);
		//create a child record 
	    var ChildCapId=createChild("Forestry","Request","Planting","NA");
		//update WfTask Tree Planting Intake
		updateTask("Tree Planting Intake","Add to List","","","",ChildCapId);
		//enter "Staff" in Custom Field "Source of Request" 
		editAppSpecific("Source of Request","Staff",ChildCapId);
		//Activate wfTask Site Review
		activateWFTask("Site Review",ChildCapId);
	}
}