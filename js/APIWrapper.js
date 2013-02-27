/*******************************************************************************
**
** FileName: APIWrapper.js
**
*******************************************************************************/

/*******************************************************************************
**
** Concurrent Technologies Corporation (CTC) grants you ("Licensee") a non-
** exclusive, royalty free, license to use, modify and redistribute this
** software in source and binary code form, provided that i) this copyright
** notice and license appear on all copies of the software; and ii) Licensee does
** not utilize the software in a manner which is disparaging to CTC.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-
** INFRINGEMENT, ARE HEREBY EXCLUDED.  CTC AND ITS LICENSORS SHALL NOT BE LIABLE
** FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
** DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL CTC  OR ITS
** LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT,
** INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER
** CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF
** OR INABILITY TO USE SOFTWARE, EVEN IF CTC  HAS BEEN ADVISED OF THE POSSIBILITY
** OF SUCH DAMAGES.
**
*******************************************************************************/

/*******************************************************************************
** This file is part of the ADL Sample API Implementation intended to provide
** an elementary example of the concepts presented in the ADL Sharable
** Content Object Reference Model (SCORM).
**
** The purpose in wrapping the calls to the API is to (1) provide a
** consistent means of finding the LMS API implementation within the window
** hierarchy and (2) to validate that the data being exchanged via the
** API conforms to the defined CMI data types.
**
** This is just one possible example for implementing the API guidelines for
** runtime communication between an LMS and executable content components.
** There are several other possible implementations.
**
** Usage: Executable course content can call the API Wrapper
**      functions as follows:
**
**    javascript:
**          var result = doLMSInitialize();
**          if (result != true) 
**          {
**             // handle error
**          }
**
**    authorware
**          result := ReadURL("javascript:doLMSInitialize()", 100)
**
*******************************************************************************/

var _Debug = false;  // set this to false to turn debugging off
                     // and get rid of those annoying alert boxes.

// Define exception/error codes
var _NoError = 0;
var _GeneralException = 101;
var _ServerBusy = 102;
var _InvalidArgumentError = 201;
var _ElementCannotHaveChildren = 202;
var _ElementIsNotAnArray = 203;
var _NotInitialized = 301;
var _NotImplementedError = 401;
var _InvalidSetValue = 402;
var _ElementIsReadOnly = 403;
var _ElementIsWriteOnly = 404;
var _IncorrectDataType = 405;


// local variable definitions
var apiHandle = null;
var API = null;
var findAPITries = 0;


/*******************************************************************************
**
** Function: doLMSInitialize()
** Inputs:  None
** Return:  CMIBoolean true if the initialization was successful, or
**          CMIBoolean false if the initialization failed.
**
** Description:
** Initialize communication with LMS by calling the LMSInitialize
** function which will be implemented by the LMS.
**
*******************************************************************************/
function doLMSInitialize()
{
   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSInitialize was not successful.");
      return "false";
   }

   var result = api.LMSInitialize("");

   if (result.toString() != "true")
   {
      var err = ErrorHandler();
   }

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSFinish()
** Inputs:  None
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Close communication with LMS by calling the LMSFinish
** function which will be implemented by the LMS
**
*******************************************************************************/
function doLMSFinish()
{

   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSFinish was not successful.");
      return "false";
   }
   else
   {
      // call the LMSFinish function that should be implemented by the API

      var result = api.LMSFinish("");
      if (result.toString() != "true")
      {
         var err = ErrorHandler();
      }

   }

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSGetValue(name)
** Inputs:  name - string representing the cmi data model defined category or
**             element (e.g. cmi.core.student_id)
** Return:  The value presently assigned by the LMS to the cmi data model
**       element defined by the element or category identified by the name
**       input value.
**
** Description:
** Wraps the call to the LMS LMSGetValue method
**
*******************************************************************************/
function doLMSGetValue(name)
{
   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetValue was not successful.");
      return "";
   }
   else
   {
      var value = api.LMSGetValue(name);
      var errCode = api.LMSGetLastError().toString();
      if (errCode != _NoError)
      {
         // an error was encountered so display the error description
         var errDescription = api.LMSGetErrorString(errCode);
         alert("LMSGetValue("+name+") failed. \n"+ errDescription);
         return "";
      }
      else
      {
         
         return value.toString();
      }
   }
}

/*******************************************************************************
**
** Function doLMSSetValue(name, value)
** Inputs:  name -string representing the data model defined category or element
**          value -the value that the named element or category will be assigned
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Wraps the call to the LMS LMSSetValue function
**
*******************************************************************************/
function doLMSSetValue(name, value)
{
   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSSetValue was not successful.");
      return;
   }
   else
   {
      var result = api.LMSSetValue(name, value);
      if (result.toString() != "true")
      {
         var err = ErrorHandler();
      }
   }

   return;
}

/*******************************************************************************
**
** Function doLMSCommit()
** Inputs:  None
** Return:  None
**
** Description:
** Call the LMSCommit function 
**
*******************************************************************************/
function doLMSCommit()
{
   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
      return "false";
   }
   else
   {
      var result = api.LMSCommit("");
      if (result != "true")
      {
         var err = ErrorHandler();
      }
   }

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSGetLastError()
** Inputs:  None
** Return:  The error code that was set by the last LMS function call
**
** Description:
** Call the LMSGetLastError function 
**
*******************************************************************************/
function doLMSGetLastError()
{
   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetLastError was not successful.");
      //since we can't get the error code from the LMS, return a general error
      return _GeneralError;
   }

   return api.LMSGetLastError().toString();
}

/*******************************************************************************
**
** Function doLMSGetErrorString(errorCode)
** Inputs:  errorCode - Error Code
** Return:  The textual description that corresponds to the input error code
**
** Description:
** Call the LMSGetErrorString function 
**
********************************************************************************/
function doLMSGetErrorString(errorCode)
{
   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetErrorString was not successful.");
   }

   return api.LMSGetErrorString(errorCode).toString();
}

/*******************************************************************************
**
** Function doLMSGetDiagnostic(errorCode)
** Inputs:  errorCode - Error Code(integer format), or null
** Return:  The vendor specific textual description that corresponds to the 
**          input error code
**
** Description:
** Call the LMSGetDiagnostic function
**
*******************************************************************************/
function doLMSGetDiagnostic(errorCode)
{
   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetDiagnostic was not successful.");
   }

   return api.LMSGetDiagnostic(errorCode).toString();
}

/*******************************************************************************
**
** Function LMSIsInitialized()
** Inputs:  none
** Return:  true if the LMS API is currently initialized, otherwise false
**
** Description:
** Determines if the LMS API is currently initialized or not.
**
*******************************************************************************/
function LMSIsInitialized()
{
   // there is no direct method for determining if the LMS API is initialized
   // for example an LMSIsInitialized function defined on the API so we'll try
   // a simple LMSGetValue and trap for the LMS Not Initialized Error

   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSIsInitialized() failed.");
      return false;
   }
   else
   {
      var value = api.LMSGetValue("cmi.core.student_name");
      var errCode = api.LMSGetLastError().toString();
      if (errCode == _NotInitialized)
      {
         return false;
      }
      else
      {
         return true;
      }
   }
}

/*******************************************************************************
**
** Function ErrorHandler()
** Inputs:  None
** Return:  The current value of the LMS Error Code
**
** Description:
** Determines if an error was encountered by the previous API call
** and if so, displays a message to the user.  If the error code
** has associated text it is also displayed.
**
*******************************************************************************/
function ErrorHandler()
{
   var api = SCORM_GrabAPI();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
      return;
   }

   // check for errors caused by or from the LMS
   var errCode = api.LMSGetLastError().toString();
   if (errCode != _NoError)
   {
      // an error was encountered so display the error description
      var errDescription = api.LMSGetErrorString(errCode);

      if (_Debug == true)
      {
         errDescription += "\n";
         errDescription += api.LMSGetDiagnostic(null);
         // by passing null to LMSGetDiagnostic, we get any available diagnostics
         // on the previous error.
      }

      alert(errDescription);
   }

   return errCode;
}

/******************************************************************************
**
** Function getAPIHandle()
** Inputs:  None
** Return:  value contained by APIHandle
**
** Description:
** Returns the handle to API object if it was previously set,
** otherwise it returns null
**
*******************************************************************************/
function WriteToDebug(a)
{
	//alert(a)
}
function SCORM_GrabAPI(){
	
	WriteToDebug("In SCORM_GrabAPI");
	
	//if we haven't already located the API, find it using our algorithm
	if (typeof(SCORM_objAPI) == "undefined" || SCORM_objAPI == null){
		WriteToDebug("Searching with Rustici Software algorithm");
		SCORM_objAPI = SCORM_SearchForAPI(window);
	}
	
	//if it's still not found, try the algorithm from the SCORM spec
	if (typeof(SCORM_objAPI) == "undefined" || SCORM_objAPI == null){
		WriteToDebug("Searching with ADL algorithm");
		SCORM_objAPI = SCORM_getAPI();
	}	
	
	WriteToDebug("API Found, returning");
	
	return SCORM_objAPI;
	
}


function SCORM_SearchForAPI(wndLookIn){
	
	WriteToDebug("SCORM_SearchForAPI");
	
	var objAPITemp = null;
	var strDebugID = "";
	
	strDebugID = "Name=" + wndLookIn.name + ", href=" + wndLookIn.location.href
	
	objAPITemp = wndLookIn.API;
	
	if (SCORM_APIFound(objAPITemp)){
		WriteToDebug("Found API in this window - "  + strDebugID);
		return objAPITemp;
	}
	
	if (SCORM_WindowHasParent(wndLookIn)){
		WriteToDebug("Searching Parent - "  + strDebugID);
		objAPITemp = SCORM_SearchForAPI(wndLookIn.parent);
	}
	
	if (SCORM_APIFound(objAPITemp)){
		WriteToDebug("Found API in a parent - "  + strDebugID);
		return objAPITemp;
	}
	
	if (SCORM_WindowHasOpener(wndLookIn)){
		WriteToDebug("Searching Opener - "  + strDebugID);
		objAPITemp = SCORM_SearchForAPI(wndLookIn.opener);
	}
	
	if (SCORM_APIFound(objAPITemp)){
		WriteToDebug("Found API in an opener - "  + strDebugID);
		return objAPITemp;
	}	
	
	//look in child frames individually, don't call this function recursively
	//on them to prevent an infinite loop when it looks back up to the parents
	WriteToDebug("Looking in children - "  + strDebugID);
	objAPITemp = SCORM_LookInChildren(wndLookIn);

	if (SCORM_APIFound(objAPITemp)){
		WriteToDebug("Found API in Children - "  + strDebugID);
		return objAPITemp;
	}
	
	WriteToDebug("Didn't find API in this window - "  + strDebugID);
	return null;
}


function SCORM_LookInChildren(wnd){
	
	WriteToDebug("SCORM_LookInChildren");
	
	var objAPITemp = null;
	
	var strDebugID = "";
	
	strDebugID = "Name=" + wnd.name + ", href=" + wnd.location.href

	for (var i=0; i < wnd.frames.length; i++){
		
		WriteToDebug("Looking in child frame " + i);
		objAPITemp = win.frames[i].API;
		
		if (SCORM_APIFound(objAPITemp)){
			WriteToDebug("Found API in child frame of " + strDebugID);
			return objAPITemp;
		}
		
		WriteToDebug("Looking in this child's children " + strDebugID);
		objAPITemp = SCORM_LookInChildren(wnd.frames[i]);

		if (SCORM_APIFound(objAPITemp)){
			WriteToDebug("API found in this child's children " + strDebugID);
			return objAPITemp;
		}		
	}
	
	return null;
}

function SCORM_WindowHasOpener(wnd){
	WriteToDebug("In SCORM_WindowHasOpener");
	if ((wnd.opener != null) && (wnd.opener != wnd) && (typeof(wnd.opener) != "undefined")){
		WriteToDebug("Window Does Have Opener");
		return true;
	}
	else{
		WriteToDebug("Window Does Not Have Opener");
		return false;
	}	
}

function SCORM_WindowHasParent(wnd){
	WriteToDebug("In SCORM_WindowHasParent");
	if ((wnd.parent != null) && (wnd.parent != wnd) && (typeof(wnd.parent) != "undefined")){
		WriteToDebug("Window Does Have Parent");
		return true;
	}
	else{
		WriteToDebug("Window Does Not Have Parent");
		return false;
	}
}


function SCORM_APIFound(obj){
	WriteToDebug("In SCORM_APIFound");
	if (obj == null || typeof(obj) == "undefined"){
		WriteToDebug("API NOT Found");
		return false;
	}
	else{
		WriteToDebug("API Found");
		return true;
	}
}

 SCORM_findAPITries = 0;


function SCORM_findAPI(win)
{
	WriteToDebug("In SCORM_findAPI");
   // Check to see if the window (win) contains the API
   // if the window (win) does not contain the API and
   // the window (win) has a parent window and the parent window  
   // is not the same as the window (win)
   while ( ( win.API == null) && (win.parent != null) && (win.parent != win) )
   {	
	 // increment the number of findAPITries
      SCORM_findAPITries++;
	 WriteToDebug("SCORM_findAPITries=" + SCORM_findAPITries);
      // Note: 7 is an arbitrary number, but should be more than sufficient
      if (SCORM_findAPITries > 7) 
      {
         WriteToDebug("Error finding API -- too deeply nested.");
		 //set it back to 0
		 SCORM_findAPITries = 0;
         return null;
      }
      
      // set the variable that represents the window being 
      // being searched to be the parent of the current window
      // then search for the API again
      win = win.parent;
   }
   return win.API;
}

function getAPIHandle()
{
	WriteToDebug("In SCORM_getAPI");
	
   // start by looking for the API in the current window
   var theAPI = SCORM_findAPI(window);
   // if the API is null (could not be found in the current window)
   // and the current window has an opener window
   
   //we have to use parent.window.opener here because the APIWraper is in the nav.htm file and we need to get up to the parent to check for the opener window
   if ( (theAPI == null) && (parent.window.opener != null) && (typeof(parent.window.opener) != "undefined"))
   {
	   WriteToDebug("Looking in opener");
      // try to find the API in the current windows opener
      theAPI = SCORM_findAPI(parent.window.opener);
   }
   // if the API has not been found
   
   if (theAPI == null)
   {
      // Alert the user that the API Adapter could not be found
      WriteToDebug("Unable to find an API adapter");
   }
   return theAPI;
}


