// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>WF-Config Reader</h1>`;

let configDocument = null;
getConfiguration();

function getConfiguration() {
  // fetch-Aufruf mit Pfad zur XML-Datei
  fetch('wf.xml')
    .then(function (response) {
      // Antwort kommt als Text-String
      return response.text();
    })
    .then(function (data) {
      console.log(data); // schnell mal in der Konsole checken

      // String in ein XML-DOM-Objekt umwandeln
      let parser = new DOMParser(),
        xmlDoc = parser.parseFromString(data, 'text/xml');

      console.log(xmlDoc.getElementsByTagName('item'));
      console.log(
        'item ' + xmlDoc.getElementsByTagName('item')[1].children[0].textContent
      );

      comicToday(xmlDoc); // Funktion zur Bearbeitung mit dem geparsten xmlDoc aufrufen
    })
    .catch(function (error) {
      console.log('Fehler: bei Auslesen der XML-Datei ' + error);
    });

  return configDocument;
}

function hideFields(stepId) {
  console.log('Hide Fields for StepId:' + stepId);
  // console.log(formHelper.getParameters());
  var hiddenFields = getParamByStepId(stepId, 'hiddenFields')
    .split(',')
    .splice();
  console.log(hiddenFields);
  console.log(
    'HiddenFields: ' +
      getParamByStepId(stepId, 'hiddenFields').split(',').splice()
  );
  hiddenFields.forEach((item) => {
    console.log('Hide Field: ' + item);
    //if (item){
    // Maskenname
    formHelper.getFieldByName(item).api.hide();
    // Besser so:
    // formHelper.getFieldByParameterName(item).api.hide();
    //}
  });
}

function disableFields(stepId) {
  console.log('Disabling Fields for StepId:' + stepId);
  var disabledFields = getParamByStepId(stepId, 'disabledFields')
    .split(',')
    .splice();
  console.log(disabledFields);
  console.log(
    'DisabledFields: ' +
      getParamByStepId(stepId, 'disabledFields').split(',').splice()
  );
  disabledFields.forEach((item) => {
    console.log('Disabling Field: ' + item);
    formHelper.getFieldByName(item).api.disable();
  });
}

/**
 * Gets a parameter by step ID
 */
function getParamByStepId(id, name) {
  var fieldElem, objElem;
  // "//Object[@id=""" & sId & """]/Field[@Name=""" & sValueName & """]"
  let myDoc = getConfiguration();
  var iterator = myDoc.evaluate(
    "//Object[@id='" + id + "']/Field[@Name='" + name + "']",
    myDoc,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  console.log(
    'StepID: ' +
      id +
      ' Name: ' +
      name +
      'Value: ' +
      iterator.singleNodeValue.textContent
  );
  return iterator.singleNodeValue.textContent;
}

/**
 * Sucht anhand des Namens der Activität die dazugehörige WF Schritt ID
 * @param ame der Aktivität
 * @return Number as String
 */
function getStepIdByName(name) {
  // var objectElements = getConfiguration().getElementsByTagName("Steps").item(0).getElementsByTagName("Object");
  let myDoc = getConfiguration();
  var iterator = myDoc.evaluate(
    "//Object[@step_name='" + name + "']/@id",
    myDoc,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  console.log(iterator.singleNodeValue.textContent);
  return iterator.singleNodeValue.textContent;
}
