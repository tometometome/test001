
//======================================================================================
// function    : portalverbundPocGetCurrentDateAndTime
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocGetCurrentDateAndTime() {

  var currentDateAndTime;
  var currentJavaScriptDateAndTime;
  var jahr;
  var monat;
  var tag;
  var stunden;
  var minuten;
  var sekunden;
  
  currentJavaScriptDateAndTime = new Date();

  jahr = currentJavaScriptDateAndTime.getFullYear();
  
  monat = currentJavaScriptDateAndTime.getMonth() + 1; 
  
  if ( monat <= 9 ) { monat = "0".toString() + monat.toString(); } else { monat = monat.toString(); }
  
  tag = currentJavaScriptDateAndTime.getDate();
  
  if ( tag <= 9 ) { tag = "0".toString() + tag.toString(); } else { tag = tag.toString(); }
  
  stunden = currentJavaScriptDateAndTime.getHours();
  
  if ( stunden <= 9 ) { stunden = "0".toString() + stunden.toString(); } else { stunden = stunden.toString(); }  

  minuten = currentJavaScriptDateAndTime.getMinutes();
  
  if ( minuten <= 9 ) { minuten = "0".toString() + minuten.toString(); } else { minuten = minuten.toString(); }  

  sekunden = currentJavaScriptDateAndTime.getSeconds();
  
  if ( sekunden <= 9 ) { sekunden = "0".toString() + sekunden.toString(); } else { sekunden = sekunden.toString(); }  

  currentDateAndTime = tag.toString() + "." + monat.toString() + "." + jahr.toString() + " " + stunden.toString() + ":" + minuten.toString() + ":" + sekunden.toString();
  
  return currentDateAndTime;

}

//======================================================================================
// function    : portalverbundPocConsoleLogChalk
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocConsoleLogChalk(currentText) {

  var currentPortalColour;
  var currentText2;

  currentText2 = portalverbundPocGetCurrentDateAndTime();
  currentText2 = currentText2.toString() + ": "+ currentText.toString();
  
  currentPortalColor = portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString().toLowerCase();

  if ( currentPortalColor === "darkgreen" ) { console.log(portalverbundPocModuleChalk.green(currentText2.toString())); }
  if ( currentPortalColor === "blue" ) { console.log(portalverbundPocModuleChalk.blue(currentText2.toString())); }
  if ( currentPortalColor === "red" ) { console.log(portalverbundPocModuleChalk.red(currentText2.toString())); }


}

//======================================================================================
// function    : portalverbundPocGetRedisKeyValue
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocGetRedisKeyValue(redisKey) {

  var portalverbundPocRedisClient;

  portalverbundPocRedisClient = portalverbundPocModuleRedis.createClient();

  portalverbundPocRedisClient.get(redisKey, function(err, value) {

    if ( err ) {

      console.log("Redis get error");
      
      portalverbundPocRedisClient.quit();      

      process.exit();
           
    } else {
         
      console.log("Worked: " + value);
    
      portalverbundPocRedisClient.quit(); 
     
      process.exit();
         
    }
        
  });
      
}

//======================================================================================
// function    : portalverbundPocSetRedisKeyValue
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocSetRedisKeyValue(redisKey, redisValue) {

  var portalverbundPocRedisClient;

  portalverbundPocRedisClient = portalverbundPocModuleRedis.createClient();

  portalverbundPocRedisClient.set(redisKey.toString(), redisValue.toString(), function(err) { 
    
    if ( err ) {
  
//      console.log("Redis set error");
      
      portalverbundPocRedisClient.quit();
  
    } else {

//      console.log("Redis set ok");
    
      portalverbundPocRedisClient.quit();
    
    }
  
  });

}

//======================================================================================
// function    : getXMLElementValue
// description : 
// input       : 
// output      :  
//======================================================================================

function getXMLElementValue(inputXML, XMLElement, inputXMLStartIndex, inputXMLEndIndex) {

  var XMLElementValue;
  var XMLElement2;
  var endTag;
  var pos1;
  var pos2;

  XMLElementValue = "";

  if ( XMLElement.toString().length > 0 ) {
  
    XMLElement2 = portalverbundPocModuleLodash.trimStart(XMLElement).toLowerCase();
  
    pos1 = inputXML.toLowerCase().indexOf(XMLElement2, inputXMLStartIndex);
  
    if ( ( pos1 >= 0 ) && ( pos1 <= inputXMLEndIndex ) ) {
    
      pos1 = inputXML.toLowerCase().indexOf(">", pos1);
      
      if ( ( pos1 >= 0 ) && ( pos1 <= inputXMLEndIndex ) ) {
      
        endTag = "</" + XMLElement2.substring(1, XMLElement2.length);
        endTag = portalverbundPocModuleLodash.trim(endTag);
      
        pos2 = inputXML.toLowerCase().indexOf(endTag, pos1);
      
        if ( ( pos2 >= 0 ) && ( pos2 <= inputXMLEndIndex ) ) {
      
          XMLElementValue = inputXML.substring(pos1 + 1, pos2);
      
        }
    
      }
    
    }
  
  } 
  
  return XMLElementValue;

}

//======================================================================================
// function    : portalverbundPocRunMessageEngine
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocRunMessageEngine() {

  var messageEngine;
  var messageEngineUpperCase;
  
  messageEngine = portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocMessageEngine"];
  messageEngineUpperCase = portalverbundPocModuleLodash.upperCase(messageEngine);

  if ( messageEngineUpperCase === "MQTT" ) {

    var ascoltatore = {
  
      type:"redis",
      redis:require("redis"),
      db:12,
      port:parseInt(portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocRedisPort"].toString(), 10),
      return_buffers:true,
      host:portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocRedisHostname"]

    };

    var moscaSettings = {
  
      port:parseInt(portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocMQTTServerPort"].toString(), 10),
      backend:ascoltatore,
      persistence: {

        factory:portalverbundPocModuleMosca.persistence.Redis
    
      }

    };

    var MQTTServer = new portalverbundPocModuleMosca.Server(moscaSettings);

    MQTTServer.on("ready", portalverbundPocMQTTSetup);

    MQTTServer.on("clientConnected", function(client) {

//      console.log("Client verbunden: ", client.id);		

    });

// fired when a message is received

    MQTTServer.on("published", function(packet, client) {

//      console.log("Veroeffentlicht: ", packet.topic, packet.payload);

    });

  }

}

//======================================================================================
// function    : portalverbundPocMQTTSetup
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocMQTTSetup() {

//  console.log('Portalverbund-Broker laeuft ...');

  portalverbundPocConsoleLogChalk("INFO: Bereitstelldienst: Message-Broker (MQTT) ist gestartet.");

}

//======================================================================================
// function    : portalverbundPocDatumFormatieren
// description : 
// input       : inputDatum  =
// output      : outputDatum = 
//======================================================================================

function portalverbundPocDatumFormatieren(inputDatum) {

  var tempArray1;
  var outputDatum;
  
  tempArray1 = inputDatum.split("-");
  
  outputDatum = tempArray1[0].toString() + tempArray1[1].toString() + tempArray1[2].toString(); 

  return outputDatum;

}

//======================================================================================
// function    : elasticsearchIndexDocument
// description : 
// input       : 
// output      :  
//======================================================================================

function elasticsearchIndexDocument(elasticsearchDocument) {

  var elasticsearchId;
  var elasticsearchIndex;
  var elasticsearchType;
  var elasticsearchClient;
  var elasticsearchConnectionString;
  var elasticsearchLeistung;
  var elasticsearchLeistungArray;
  var posBeginnXZuFiErgebnisLeistung;
  var posEndeXZuFiErgebnisLeistung;
  var posBeginnXZuFiVersionsinformation;
  var posBeginnXZuFiZustaendigkeit;
  var posBeginnXZuFiInhalt;
  var posBeginnXZuFiBegriff;
  var leistungID;
  var leistungGueltigAbDatum;
  var leistungGueltigBisDatum;
  var leistungVersion;
  var gebietID;  
  
//======================================================================================
// Immediately-invoked function expression (IIFE) erzeugt lokalen Kontext fuer 
// Variablen, welche im Callback vor Veraenderungen geschuetzt sind und
// entsprechend mit beruecksichtigt werden koennen
//======================================================================================

  (function(elasticsearchDocument) {

  })(elasticsearchDocument);


  posBeginnXZuFiErgebnisLeistung = elasticsearchDocument.toLowerCase().indexOf("<xzufi:ergebnisLeistung>".toLowerCase(), 0);
  posEndeXZuFiErgebnisLeistung = elasticsearchDocument.toLowerCase().indexOf("</xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);
  
  leistungID = getXMLElementValue(elasticsearchDocument, "<xzufi:id>", posBeginnXZuFiErgebnisLeistung, posEndeXZuFiErgebnisLeistung);
  
  leistungVersion = getXMLElementValue(elasticsearchDocument, "<xzufi:version>", posBeginnXZuFiErgebnisLeistung, posEndeXZuFiErgebnisLeistung);
  if ( leistungVersion === "" ) { leistungVersion = "1.0"; }

  leistungGueltigAbDatum = portalverbundPocDatumFormatieren(getXMLElementValue(elasticsearchDocument, "<xzufi:beginn>", posBeginnXZuFiVersionsinformation, posEndeXZuFiErgebnisLeistung));
  if ( leistungGueltigAbDatum === "" ) { leistungGueltigAbDatum = "1.0"; }
  
  leistungGueltigBisDatum = portalverbundPocDatumFormatieren(getXMLElementValue(elasticsearchDocument, "<xzufi:ende>", posBeginnXZuFiVersionsinformation, posEndeXZuFiErgebnisLeistung));  
  if ( leistungGueltigBisDatum === "" ) { leistungGueltigBisDatum = "1.0"; }  
  

  posBeginnXZuFiZustaendigkeit = elasticsearchDocument.toLowerCase().indexOf("<xzufi:zustaendigkeit>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);

  gebietID = getXMLElementValue(elasticsearchDocument, "<xzufi:gebietID>", posBeginnXZuFiZustaendigkeit, elasticsearchDocument.length);  

  elasticsearchLeistungArray = [];
  
  posBeginnXZuFiInhalt = 0;
  posBeginnXZuFiInhalt = elasticsearchDocument.toLowerCase().indexOf("<xzufi:inhalt ".toLowerCase(), posBeginnXZuFiInhalt);

  while ( posBeginnXZuFiInhalt >= 0 ) {
  
    elasticsearchLeistungArray.push(getXMLElementValue(elasticsearchDocument, "<xzufi:inhalt ", posBeginnXZuFiInhalt, elasticsearchDocument.length));  
    elasticsearchLeistungArray.push(" ");
  
    posBeginnXZuFiInhalt = posBeginnXZuFiInhalt + 1; 
    posBeginnXZuFiInhalt = elasticsearchDocument.toLowerCase().indexOf("<xzufi:inhalt ".toLowerCase(), posBeginnXZuFiInhalt);
  
  }

  posBeginnXZuFiBegriff = 0;
  posBeginnXZuFiBegriff = elasticsearchDocument.toLowerCase().indexOf("<xzufi:begriff ".toLowerCase(), posBeginnXZuFiBegriff);

  while ( posBeginnXZuFiBegriff >= 0 ) {
  
    elasticsearchLeistungArray.push(getXMLElementValue(elasticsearchDocument, "<xzufi:begriff", posBeginnXZuFiBegriff, elasticsearchDocument.length));  
    elasticsearchLeistungArray.push(" ");
  
    posBeginnXZuFiBegriff = posBeginnXZuFiBegriff + 1; 
    posBeginnXZuFiBegriff = elasticsearchDocument.toLowerCase().indexOf("<xzufi:begriff ".toLowerCase(), posBeginnXZuFiBegriff);
  
  }

  elasticsearchLeistungArray.push(gebietID.toString());  
  elasticsearchLeistungArray.push(" ");  

  elasticsearchLeistung = elasticsearchLeistungArray.join("");



//  console.log("--------------------------------------------------");
//  console.log("leistungID=" + leistungID.toString());
//  console.log("leistungVersion=" + leistungVersion.toString());
//  console.log("leistungGueltigAbDatum=" + leistungGueltigAbDatum.toString());
//  console.log("leistungGueltigBisDatum=" + leistungGueltigBisDatum.toString());
//  console.log("gebietID=" + gebietID.toString());
//  console.log("--------------------------------------------------");



  elasticsearchId = leistungID.toString() + "_" + gebietID.toString() + "_" + leistungVersion.toString();
  elasticsearchIndex = "portalverbund_poc_index";
  elasticsearchType = "portalverbund_poc_type";

   

//  console.log("==> elasticsearchId=" + elasticsearchId.toString());
  

       
  elasticsearchConnectionString = portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocElasticsearchHostname"] + ":" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocElasticsearchPort"];

  elasticsearchClient = new portalverbundPocModuleElasticsearch.Client({
    
    host:elasticsearchConnectionString
//      log:"trace"
    
  });




//  elasticsearchClient.delete({
  
//    index:elasticsearchIndex,
//    type:elasticsearchType,
//    id:elasticsearchId

//  }, function (error, response) {

//    console.log("delete response=" + JSON.stringify(response));


//  });


//  console.log("==> elasticsearchLeistung=" + elasticsearchLeistung.toString());


  elasticsearchClient.indices.exists({
  
    index:elasticsearchIndex

  }, function (error, exists) {

    if ( !exists ) {
    
      elasticsearchClient.indices.create({
    
        index:elasticsearchIndex

      }, function(error, response, status) { 

        elasticsearchClient.index({

          index:elasticsearchIndex,
          type:elasticsearchType,  
          id:elasticsearchId,
          body: {
          
//            "leistung":"Halten und Parken, Beantragungen von Bewohnerparkausweisen Die Bewohnerparkausweise sollen AnwohnerInnen in Wohngebieten mit erheblichem Parkraummangel das Parken erleichtern. Die Stadt Hamburg hat dafür sechs Gebiete eingerichtet: M100 Großneumarkt, M101 Schaarmarkt, M102 Cremon, M103 Kontorhausviertel, M200 St. Pauli, N100 Flughafen. Als BewohnerIn eines dieser Gebietekönnen Sie beim Landesbetrieb Verkehr (LBV) einen Bewohnerparkausweis beantragen, der Sie von der Bezahlung der Parkgebühren befreit. Achtung: Der Bewohnerparkausweis sichert also keinen speziellen Parkplatz, sondern erlaubt nur das Parkenauf einem Parkplatz in der beschilderten Zone. Auch für Fahrzeuge, die nicht auf die/den AntragstellerIn zugelassen sind, können Bewohnerparkausweise beantragtwerden. Falls Sie zum Beispiel als BewohnerIn St. Paulis das Auto Ihrer Mutter nutzen, die außerhalb Hamburgs wohnt, können Sie trotzdem für dieses Auto einen Bewohnerparkausweis beantragen. In diesem Fall ist eine Bestätigung der Halterinoder des Halters erforderlich, dass der Wagen allein und ausschließlich von der/von dem AntragstellerIn genutzt wird. Falls Sie Besuch bekommen, können Sie ebenfalls im LBV Besucherscheine beantragen. Der Besucherschein gilt für den jeweiligen Tag und darf nicht mehrmals verwendet werden. In Hamburg ist die Ausgabe von Bewohnerparkausweisen nur für bestimmte Bereiche in der Stadt vorgesehen. Anwohnerparkausweise Bewohnerparkausweise Besucherparkausweise 02000000"
//            "leistung":"Parkausweis Bewohnerparkausweis Anwohnerparkausweis und noch viele Punkte mehr"
//            "leistung":elasticsearchLeistung
            "leistung":elasticsearchDocument
                    
          } 
          
        }, function (error, response) {

//           console.log("1 Index Document:" + JSON.stringify(response));       
       
        });
  
      }); 

    } else {

      elasticsearchClient.index({

        index:elasticsearchIndex,
        type:elasticsearchType,  
        id:elasticsearchId,
        body: {
  
//            "leistung":"Halten und Parken, Beantragungen von Bewohnerparkausweisen Die Bewohnerparkausweise sollen AnwohnerInnen in Wohngebieten mit erheblichem Parkraummangel das Parken erleichtern. Die Stadt Hamburg hat dafür sechs Gebiete eingerichtet: M100 Großneumarkt, M101 Schaarmarkt, M102 Cremon, M103 Kontorhausviertel, M200 St. Pauli, N100 Flughafen. Als BewohnerIn eines dieser Gebietekönnen Sie beim Landesbetrieb Verkehr (LBV) einen Bewohnerparkausweis beantragen, der Sie von der Bezahlung der Parkgebühren befreit. Achtung: Der Bewohnerparkausweis sichert also keinen speziellen Parkplatz, sondern erlaubt nur das Parkenauf einem Parkplatz in der beschilderten Zone. Auch für Fahrzeuge, die nicht auf die/den AntragstellerIn zugelassen sind, können Bewohnerparkausweise beantragtwerden. Falls Sie zum Beispiel als BewohnerIn St. Paulis das Auto Ihrer Mutter nutzen, die außerhalb Hamburgs wohnt, können Sie trotzdem für dieses Auto einen Bewohnerparkausweis beantragen. In diesem Fall ist eine Bestätigung der Halterinoder des Halters erforderlich, dass der Wagen allein und ausschließlich von der/von dem AntragstellerIn genutzt wird. Falls Sie Besuch bekommen, können Sie ebenfalls im LBV Besucherscheine beantragen. Der Besucherschein gilt für den jeweiligen Tag und darf nicht mehrmals verwendet werden. In Hamburg ist die Ausgabe von Bewohnerparkausweisen nur für bestimmte Bereiche in der Stadt vorgesehen. Anwohnerparkausweise Bewohnerparkausweise Besucherparkausweise 02000000"          
//            "leistung":"Parkausweis Bewohnerparkausweis Anwohnerparkausweis und noch viele Punkte mehr"
//            "leistung":elasticsearchLeistung
          "leistung":elasticsearchDocument
          
        } 
          
      }, function (error, response) {

//        console.log("2 Index Document:" + JSON.stringify(response));       
       
      });
      
    }

//    console.log("Index exists=" + exists.toString());

  });


  
//  console.log("~~~~~~~~~~~~~~~~~~~~~");
//  console.log(elasticsearchDocument.toString());
//  console.log("~~~~~~~~~~~~~~~~~~~~~");

// client.index({
//    index: 'test',
//    type: 'house',
//    id: '1',
//    body: {
//      name: 'huhu'
//    }
// });


      
}

//======================================================================================
// function    : portalverbundPocRunMessageEngine
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocSubscribeMessageEngines() {

  var messageEngine;
  var messageEngineUpperCase;
  var i;
  var bereitstelldienstMQTT;
  var MQTTConnectionString;
  var redisKey;
  var redisValue;
  var tempArray1;
  
  messageEngine = portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocMessageEngine"];
  messageEngineUpperCase = portalverbundPocModuleLodash.upperCase(messageEngine);

  if ( messageEngineUpperCase === "MQTT" ) {

    i = 0;
    
    portalverbundPocGlobalApplicationData["portalverbundPocBereitstelldienstMQTTArray"] = [];
    
    while ( i < portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"].length ) {
    
//      console.log("hostname=" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"][i]["hostname"].toString());
//      console.log("port=" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"][i]["port"].toString());
          
      MQTTConnectionString = "mqtt://" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"][i]["hostname"].toString() + ":" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"][i]["port"].toString();   
       
//      console.log("MQTTConnectionString=" + MQTTConnectionString.toString());   
          
      bereitstelldienstMQTT = portalverbundPocModuleMQTT.connect(MQTTConnectionString);   
          
      portalverbundPocGlobalApplicationData["portalverbundPocBereitstelldienstMQTTArray"].push(bereitstelldienstMQTT);    
          
      portalverbundPocGlobalApplicationData["portalverbundPocBereitstelldienstMQTTArray"][i].subscribe("PORTALVERBUND_POC_BEREITSTELLDIENST_LEISTUNGSVERZEICHNIS");
      portalverbundPocGlobalApplicationData["portalverbundPocBereitstelldienstMQTTArray"][i].subscribe("PORTALVERBUND_POC_BEREITSTELLDIENST_DIENSTEVERZEICHNIS");
      portalverbundPocGlobalApplicationData["portalverbundPocBereitstelldienstMQTTArray"][i].subscribe("PORTALVERBUND_POC_BEREITSTELLDIENST_BEREITSTELLDIENSTE_HINZUFUEGEN");

      
      portalverbundPocGlobalApplicationData["portalverbundPocBereitstelldienstMQTTArray"][i].on("message", function(MQTTTopic, MQTTMessage) {

//        console.log("---------------------------------------------------"); 
//        console.log("MQTTTopic=" + MQTTTopic.toString());
//        console.log("MQTTMessage=" + MQTTMessage.toString());
//        console.log("---------------------------------------------------");
      
        if ( MQTTTopic === "PORTALVERBUND_POC_BEREITSTELLDIENST_LEISTUNGSVERZEICHNIS" ) {
  
          portalverbundPocConsoleLogChalk("INFO: Bereitstelldienst: Subscribe: Aktualisierung im Leistungsverzeichnis (Gesamtdatenbestand)");
  
          elasticsearchIndexDocument(MQTTMessage.toString());
        
        }

        if ( MQTTTopic === "PORTALVERBUND_POC_BEREITSTELLDIENST_DIENSTEVERZEICHNIS" ) {

          portalverbundPocConsoleLogChalk("INFO: Bereitstelldienst: Subscribe: Registrierung im Dienstverzeichnis");
  
          tempArray1 = MQTTMessage.toString().split("~");
  
          redisKey = tempArray1[0].toString();
          redisValue = tempArray1[1].toString();
  
          portalverbundPocSetRedisKeyValue(redisKey, redisValue);  
  
//          console.log("DiensteverzeichnisMessage=" + MQTTMessage.toString());
        
        }

        if ( MQTTTopic === "PORTALVERBUND_POC_BEREITSTELLDIENST_BEREITSTELLDIENSTE_HINZUFUEGEN" ) {

          portalverbundPocConsoleLogChalk("INFO: Bereitstelldienst: Subscribe: Bereitstelldienste hinzufuegen");
  
          portalverbundPocBereistelldienstBereitstelldiensteHinzufuegen(MQTTMessage.toString());
                  
        }
      
      });   
          
      i = i + 1;
    
    }

  }  
  
}  


//======================================================================================
// function    : portalverbundPocBereitstelldienstBereitstelldiensteHinzufuegen
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocBereitstelldiensteHinzufuegen(bereitstelldienste) {

  var messageEngine;
  var messageEngineUpperCase;
  var i;
  
  messageEngine = portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocMessageEngine"];
  messageEngineUpperCase = portalverbundPocModuleLodash.upperCase(messageEngine);

  if ( messageEngineUpperCase === "MQTT" ) {
  
    i = 0;
  
    while ( i < bereitstelldienste.length ) {
    
//    if ( bereitstelldienstObject ist nicht in portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"] ) {

//      portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"].push(bereitstelldienste[i]);

//    }
    
    
      i = i + 1;
    
    }
  
  
  }  

}

//======================================================================================
// function    : portalverbundPocBereitstelldienst
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocBereitstelldienst(topic, message) {

  var currentDate;
  var messageEngine;
  var messageEngineUpperCase;
  var i;
  
  messageEngine = portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocMessageEngine"];
  messageEngineUpperCase = portalverbundPocModuleLodash.upperCase(messageEngine);

//======================================================================================
// Message ueber Leistungsaenderung an alle beteiligten Portale senden
//======================================================================================

  if ( messageEngineUpperCase === "MQTT" ) {

    i = 0;
        
    while ( i < portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"].length ) {
    
//      console.log("hostname=" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"][i]["hostname"].toString());
//      console.log("port=" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"][i]["port"].toString());

//======================================================================================
// Immediately-invoked function expression (IIFE) erzeugt lokalen Kontext fuer 
// Variablen, welche im Callback vor Veraenderungen geschuetzt sind und
// entsprechend mit beruecksichtigt werden koennen
//======================================================================================

      (function(currentMessage) {

        var bereitstelldienstMQTT;
        var MQTTConnectionString;

        MQTTConnectionString = "mqtt://" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"][i]["hostname"].toString() + ":" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocBereitstelldienstMQTTArray"][i]["port"].toString();   
       
//      console.log("MQTTConnectionString=" + MQTTConnectionString.toString());   
                
//        portalverbundPocConsoleLogChalk("=> PUBLISH");
        
        portalverbundPocConsoleLogChalk("INFO: Bereitstelldienst: Publish: Nachricht an alle Bereitstelldienste der Portale");
                  
        bereitstelldienstMQTT = portalverbundPocModuleMQTT.connect(MQTTConnectionString); 
      
        bereitstelldienstMQTT.on("connect", function() {
                    
//        currentDate = new Date();            
                    
          bereitstelldienstMQTT.subscribe(topic);        
//        bereitstelldienstMQTT.publish("PORTALVERBUND_POC_BEREITSTELLDIENST_LEISTUNGSVERZEICHNIS", "Neue Leistungsdaten fuer Bereitstelldienst (" + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + ")");
          bereitstelldienstMQTT.publish(topic, currentMessage);
      
        });

      })(message);
      
      i = i + 1;
    
    }

  }
  
}

//======================================================================================
// function    : portalverbundPocSammlerdienst
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocSammlerdienst(funktionsdaten) {

  var posBeginnXZuFiErgebnisLeistung;
  var posEndeXZuFiErgebnisLeistung;
  var posBeginnXZuFiErgebnisOrganisationseinheit;
  var posEndeXZuFiErgebnisOrganisationseinheit;
  var posBeginnXZuFiLeistungID;
  var posEndeXZuFiLeistungID;
  var leistungID1;
  var leistungID2;
  var leistungXML;
  var organisationseinheitXML;
  var funktionsdatenLength;
  var messageArray1;
  var messageArray2;
  var message;
  
  funktionsdatenLength = funktionsdaten.length;

  messageArray1 = [];
  messageArray2 = [];
  message = "";
  
  posBeginnXZuFiErgebnisLeistung = 0;
  posBeginnXZuFiErgebnisLeistung = funktionsdaten.toLowerCase().indexOf("<xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);

  if ( posBeginnXZuFiErgebnisLeistung >= 0 ) {
    
    posEndeXZuFiErgebnisLeistung = funktionsdaten.toLowerCase().indexOf("</xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);
    
  } 
  
  while ( ( posBeginnXZuFiErgebnisLeistung >= 0 ) && ( posEndeXZuFiErgebnisLeistung > posBeginnXZuFiErgebnisLeistung ) ) {

    messageArray1 = [];
    messageArray2 = [];
    message = "";

    messageArray1.push("<xzufi:leistungsverzeichnis.antwort.leistungsbericht.030108 xmlns=\"http://xoev.de/schemata/xzufi/2_1_0\" xmlns:xzufi=\"http://xoev.de/schemata/xzufi/2_1_0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" produktbezeichnung=\"String\" produkthersteller=\"String\" produktversion=\"String\" xzufiVersion=\"String\" xsi:schemaLocation=\"http://xoev.de/schemata/xzufi/2_1_0 xzufi-leistungsverzeichnis.xsd\">");
	messageArray1.push("<xzufi:nachrichtenkopf>");
	messageArray1.push("<xzufi:nachrichtUUID>76b4df51-e824-49f7-8fec-b4af3152a263</xzufi:nachrichtUUID>");
	messageArray1.push("<xzufi:erstelltDatumZeit>2017-11-24T12:30:47Z</xzufi:erstelltDatumZeit>");
	messageArray1.push("<xzufi:empfaenger>Alle angebundenen Online-Gateway Instanzen</xzufi:empfaenger>");
	messageArray1.push("<xzufi:sender>HamburgService Informationssystem</xzufi:sender>");
	messageArray1.push("</xzufi:nachrichtenkopf>");
	messageArray1.push("<xzufi:antwort>");
	messageArray1.push("<xzufi:antwortnummer>1f0069d7-9a18-4327-be5e-d67ebd2c206f</xzufi:antwortnummer>");
	messageArray1.push("<xzufi:antwortrueckgabecode listURI=\"urn:de:xzufi:codeliste:nachrichtantwortcode\" listVersionID=\"1.1\">");
	messageArray1.push("<xzufi:code>202</xzufi:code>");
	messageArray1.push("</xzufi:antwortrueckgabecode>");

    posEndeXZuFiErgebnisLeistung = funktionsdaten.toLowerCase().indexOf("</xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);
  
    leistungXML = funktionsdaten.substring(posBeginnXZuFiErgebnisLeistung, posEndeXZuFiErgebnisLeistung + "</xzufi:ergebnisLeistung>".length);
    messageArray1.push(leistungXML);  
    
//    console.log("leistungXML=" + leistungXML.substring(leistungXML.length - 40, leistungXML.length));
  
    leistungID1 = getXMLElementValue(funktionsdaten, "<xzufi:id>", posBeginnXZuFiErgebnisLeistung, posEndeXZuFiErgebnisLeistung);
  
//    console.log("leistungID1=" + leistungID1.toString());
  
    posBeginnXZuFiErgebnisOrganisationseinheit = 0;
    posBeginnXZuFiErgebnisOrganisationseinheit = funktionsdaten.toLowerCase().indexOf("<xzufi:ergebnisOrganisationseinheit>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
  
    while ( posBeginnXZuFiErgebnisOrganisationseinheit >= 0 ) {

      messageArray2 = [];
      message = "";
    
      posEndeXZuFiErgebnisOrganisationseinheit = funktionsdaten.toLowerCase().indexOf("</xzufi:ergebnisOrganisationseinheit>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
    
      posBeginnXZuFiLeistungID = funktionsdaten.toLowerCase().indexOf("<xzufi:leistungID>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
      
      while ( ( posBeginnXZuFiLeistungID >= 0 ) && ( posBeginnXZuFiLeistungID <= posEndeXZuFiErgebnisOrganisationseinheit ) ) {  

        messageArray2 = [];
        message = "";

        posEndeXZuFiLeistungID = funktionsdaten.toLowerCase().indexOf("</xzufi:leistungID>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
      
        leistungID2 = getXMLElementValue(funktionsdaten, "<xzufi:leistungID>", posBeginnXZuFiLeistungID, posEndeXZuFiLeistungID);

//        console.log("leistungID2=" + leistungID2.toString());
      
        if ( leistungID1.toString() === leistungID2.toString() ) {
      
          organisationseinheitXML = funktionsdaten.substring(posBeginnXZuFiErgebnisOrganisationseinheit, posEndeXZuFiErgebnisOrganisationseinheit + "</xzufi:ergebnisOrganisationseinheit>".length);                   
          messageArray2.push(organisationseinheitXML);  
            
//          console.log("organisationseinheitXML=" + organisationseinheitXML.substring(organisationseinheitXML.length - 40, organisationseinheitXML.length));   

          messageArray2.push("</xzufi:antwort>");
          messageArray2.push("</xzufi:leistungsverzeichnis.antwort.leistungsbericht.030108>");

          message = messageArray1.join("") + messageArray2.join("");
    
          portalverbundPocBereitstelldienst("PORTALVERBUND_POC_BEREITSTELLDIENST_LEISTUNGSVERZEICHNIS", message);
   
        }

        posBeginnXZuFiLeistungID = posBeginnXZuFiLeistungID + 1;
        posBeginnXZuFiLeistungID = funktionsdaten.toLowerCase().indexOf("<xzufi:leistungID>".toLowerCase(), posBeginnXZuFiLeistungID);
      
      } 
    
      posBeginnXZuFiErgebnisOrganisationseinheit = posBeginnXZuFiErgebnisOrganisationseinheit + 1;
      posBeginnXZuFiErgebnisOrganisationseinheit = funktionsdaten.toLowerCase().indexOf("<xzufi:ergebnisOrganisationseinheit>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
      
    }
  
    posBeginnXZuFiErgebnisLeistung = posBeginnXZuFiErgebnisLeistung + 1;
    posBeginnXZuFiErgebnisLeistung = funktionsdaten.toLowerCase().indexOf("<xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);
  
    if ( posBeginnXZuFiErgebnisLeistung >= 0 ) {
    
      posEndeXZuFiErgebnisLeistung = funktionsdaten.toLowerCase().indexOf("</xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);
    
    } 
  
  }
  
}

//======================================================================================
// function    : portalverbundPocRegistrierungImDiensteverzeichnis
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocRegistrierungImDiensteverzeichnis(funktionsdaten) {

  var posBeginnXZuFiErgebnisLeistung;
  var posEndeXZuFiErgebnisLeistung;
  var posBeginnXZuFiErgebnisOrganisationseinheit;
  var posEndeXZuFiErgebnisOrganisationseinheit;
  var posBeginnXZuFiLeistungID;
  var posEndeXZuFiLeistungID;
  var posBeginnXZuFiVersionsinformation;
  var posEndeXZuFiVersionsinformation;
  var leistungID1;
  var leistungID2;
  var funktionsdatenLength;
  var messageArray;
  var message;
  var leistungVersion;
  var leistungGueltigAbDatum;  
  var leistungGueltigBisDatum;
  var gebietId;
  var diensteverzeichnisKey;
  var diensteverzeichnisValue;
  var leistungLinkURLOnlineDienst;

  funktionsdatenLength = funktionsdaten.length;

  messageArray = [];
  message = "";
  
  posBeginnXZuFiErgebnisLeistung = 0;
  posBeginnXZuFiErgebnisLeistung = funktionsdaten.toLowerCase().indexOf("<xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);

  if ( posBeginnXZuFiErgebnisLeistung >= 0 ) {
    
    posEndeXZuFiErgebnisLeistung = funktionsdaten.toLowerCase().indexOf("</xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);
    
  } 
 
  while ( ( posBeginnXZuFiErgebnisLeistung >= 0 ) && ( posEndeXZuFiErgebnisLeistung > posBeginnXZuFiErgebnisLeistung ) ) {

    leistungID1 = getXMLElementValue(funktionsdaten, "<xzufi:id>", posBeginnXZuFiErgebnisLeistung, posEndeXZuFiErgebnisLeistung);
  
    console.log("leistungID1=" + leistungID1.toString());
    
    leistungLinkURLOnlineDienst = getXMLElementValue(funktionsdaten, "<xzufi:uri>", posBeginnXZuFiErgebnisLeistung, posEndeXZuFiErgebnisLeistung);    
    
    console.log("leistungLinkURLOnlineDienst=" + leistungLinkURLOnlineDienst.toString());

    
    posBeginnXZuFiVersionsinformation = funktionsdaten.toLowerCase().indexOf("<xzufi:versionsinformation>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);
    
    if ( posBeginnXZuFiVersionsinformation >= 0 ) { 
  
      leistungVersion = getXMLElementValue(funktionsdaten, "<xzufi:version>", posBeginnXZuFiVersionsinformation, posEndeXZuFiErgebnisLeistung);
  
      leistungGueltigAbDatum = portalverbundPocDatumFormatieren(getXMLElementValue(funktionsdaten, "<xzufi:beginn>", posBeginnXZuFiVersionsinformation, posEndeXZuFiErgebnisLeistung));
 
      leistungGueltigBisDatum = portalverbundPocDatumFormatieren(getXMLElementValue(funktionsdaten, "<xzufi:ende>", posBeginnXZuFiVersionsinformation, posEndeXZuFiErgebnisLeistung));  

    }

    if ( leistungVersion === "" ) { leistungVersion = "1.0"; }
    if ( leistungGueltigBisDatum === "" ) { leistungGueltigBisDatum = "1.0"; }  
    if ( leistungGueltigAbDatum === "" ) { leistungGueltigAbDatum = "1.0"; }
    

    
  
    posBeginnXZuFiErgebnisOrganisationseinheit = 0;
    posBeginnXZuFiErgebnisOrganisationseinheit = funktionsdaten.toLowerCase().indexOf("<xzufi:ergebnisOrganisationseinheit>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
  
    while ( posBeginnXZuFiErgebnisOrganisationseinheit >= 0 ) {
    
      posEndeXZuFiErgebnisOrganisationseinheit = funktionsdaten.toLowerCase().indexOf("</xzufi:ergebnisOrganisationseinheit>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
      
      posBeginnXZuFiLeistungID = funktionsdaten.toLowerCase().indexOf("<xzufi:leistungID>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
       
      while ( ( posBeginnXZuFiLeistungID >= 0 ) && ( posBeginnXZuFiLeistungID <= posEndeXZuFiErgebnisOrganisationseinheit ) ) {  

        posEndeXZuFiLeistungID = funktionsdaten.toLowerCase().indexOf("</xzufi:leistungID>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
      
        leistungID2 = getXMLElementValue(funktionsdaten, "<xzufi:leistungID>", posBeginnXZuFiLeistungID, posEndeXZuFiLeistungID);

        console.log("leistungID2=" + leistungID2.toString());
      
        if ( leistungID1.toString() === leistungID2.toString() ) {
      
          posBeginnXZuFiZustaendigkeit = funktionsdaten.toLowerCase().indexOf("<xzufi:zustaendigkeit>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);

          gebietID = getXMLElementValue(funktionsdaten, "<xzufi:gebietID>", posBeginnXZuFiZustaendigkeit, funktionsdaten.length);  


//        console.log("--------------------------------------------------");
//        console.log("leistungID1=" + leistungID1.toString());
//        console.log("leistungVersion=" + leistungVersion.toString());
//        console.log("leistungGueltigAbDatum=" + leistungGueltigAbDatum.toString());
//        console.log("leistungGueltigBisDatum=" + leistungGueltigBisDatum.toString());
//        console.log("gebietID=" + gebietID.toString());
//        console.log("--------------------------------------------------");
          
          diensteverzeichnisKey = leistungID1.toString() + "_" + gebietID.toString() + "_" + leistungVersion.toString();
          diensteverzeichnisValue = leistungLinkURLOnlineDienst.toString();
          
          message = diensteverzeichnisKey.toString() + "~" + diensteverzeichnisValue.toString();      

          portalverbundPocBereitstelldienst("PORTALVERBUND_POC_BEREITSTELLDIENST_DIENSTEVERZEICHNIS", message);
            
        }

        posBeginnXZuFiLeistungID = posBeginnXZuFiLeistungID + 1;
        posBeginnXZuFiLeistungID = funktionsdaten.toLowerCase().indexOf("<xzufi:leistungID>".toLowerCase(), posBeginnXZuFiLeistungID);
      
      } 
    
      posBeginnXZuFiErgebnisOrganisationseinheit = posBeginnXZuFiErgebnisOrganisationseinheit + 1;
      posBeginnXZuFiErgebnisOrganisationseinheit = funktionsdaten.toLowerCase().indexOf("<xzufi:ergebnisOrganisationseinheit>".toLowerCase(), posBeginnXZuFiErgebnisOrganisationseinheit);
      
    }
    
    posBeginnXZuFiErgebnisLeistung = posBeginnXZuFiErgebnisLeistung + 1;
    posBeginnXZuFiErgebnisLeistung = funktionsdaten.toLowerCase().indexOf("<xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);

    if ( posBeginnXZuFiErgebnisLeistung >= 0 ) {
    
      posEndeXZuFiErgebnisLeistung = funktionsdaten.toLowerCase().indexOf("</xzufi:ergebnisLeistung>".toLowerCase(), posBeginnXZuFiErgebnisLeistung);
    
    } 
  
  }
      
}

//======================================================================================
// function    : portalverbundPocSuche
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocSuche(suchtext, ort, funktion, portalverbundPocResponseHTTP) {

  var agsFile;
  var agsFileContents;
  var ortAGSArray;
  var tempJavaScript;
  var ags;
  var tempIndex1;
  var tempArray1;
  var tempKey1;
  var tempObject1;
  var elasticsearchId;
  var elasticsearchIndex;
  var elasticsearchType;
  var elasticsearchBody;
  var elasticsearchClient;
  var elasticsearchConnectionString;  
  var elasticsearchResponseSource;
  var elasticsearchResponseLeistung;  

  portalverbundPocConsoleLogChalk("INFO: Suche: Anfrage mit Suchtext \"" + suchtext.toString() + "\" und Ort \"" + ort.toString() + "\"");

//  console.log("suchtext=" + suchtext.toString());
//  console.log("ort=" + ort.toString());

  ags = "";

  agsFile = portalverbundPocGlobalApplicationData["portalverbundPocWorkDir"].toString() + portalverbundPocGlobalApplicationData["portalverbundPocPathSeparator"].toString() + "portalverbund_poc_ort_array.txt";  
  agsFileContents = portalverbundPocModuleFs.readFileSync(agsFile, "utf8");

  tempJavaScript = "ortAGSArray=" + agsFileContents.toString();
  
  eval(tempJavaScript);
  
  tempIndex1 = portalverbundPocModuleLodash.findIndex(ortAGSArray, ort.toLowerCase());

  if ( tempIndex1 >= 0 ) {
  
//    console.log("ags=" + JSON.stringify(ortAGSArray[tempIndex1]));
    
    tempObject1 = ortAGSArray[tempIndex1];
  
    tempArray1 = portalverbundPocModuleLodash.keys(tempObject1);
    tempKey1 = tempArray1[0].toString();
    
    ags = tempObject1[tempKey1].toString();
    
//    console.log("ags=" + ags.toString());    
  
  }

  elasticsearchConnectionString = portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocElasticsearchHostname"] + ":" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocElasticsearchPort"];

  elasticsearchClient = new portalverbundPocModuleElasticsearch.Client({
    
    host:elasticsearchConnectionString
//      log:"trace"
    
  })
  
  elasticsearchIndex = "portalverbund_poc_index";
  elasticsearchType = "portalverbund_poc_type";  

  elasticsearchClient.search({
  
    index:elasticsearchIndex,
    type:elasticsearchType,
    body: { 
    
      query: {
      
        match: {
        
//          "leistung":"parkausweis"
          "leistung":suchtext
     
        }
  
      }

    }
  
  }).then(function (elasticsearchResponse) {

     var posBeginnXZuFiInhalt;
     var tempHTMLArray;
     var tempHTML;
     var elasticsearchId;
     var elasticsearchHits;
     var portalverbundPocRedisClient;
     var portalverbundPocLinkURLOnlineDienst;
     var redisKey;

     tempHTMLArray = [];     
     elasticsearchHits = elasticsearchResponse.hits.hits;
     
//     console.log("elasticsearchResponse=" + JSON.stringify(elasticsearchResponse));

     if ( elasticsearchResponse.hits.total >= 1 ) {

       elasticsearchResponseId = elasticsearchHits[0]["_id"];
       elasticsearchResponseSource = elasticsearchHits[0]["_source"];
       elasticsearchResponseLeistung = elasticsearchResponseSource["leistung"]; 
       
       if ( ( ags === "" ) || ( elasticsearchResponseLeistung.indexOf(ags) >= 0 ) ) {  
       
//       console.log(elasticsearchResponseLeistung);

         portalverbundPocRedisClient = portalverbundPocModuleRedis.createClient();
         redisKey = elasticsearchResponseId.toString();

         portalverbundPocRedisClient.get(redisKey, function(err, value) {

           if ( err ) {

             console.log("Redis get error");
      
             portalverbundPocRedisClient.quit();      

           } else {
             
             portalverbundPocRedisClient.quit(); 
     
             if ( value === null ) {
             
               portalverbundPocLinkURLOnlineDienst = "";
             
             } else {
             
               portalverbundPocLinkURLOnlineDienst = value.toString();
             
             }

             if ( portalverbundPocLinkURLOnlineDienst === "" ) {

               tempHTMLArray.push("Zu der Verwaltungsleistung gibt es keinen Link bzw. keine URL zu einem Online-Dienst.<br/><br/>");

             } else {
             
               tempHTMLArray.push("Zu der Verwaltungsleistung gibt es folgenden Link bzw. folgende URL zu einem Online-Dienst:<br/><br/><a target=\"_blank\" href=\"" + portalverbundPocLinkURLOnlineDienst.toString() + "\">" + portalverbundPocLinkURLOnlineDienst.toString() + "</a><br/><br/>");
             
             }

             posBeginnXZuFiInhalt = 0;
             posBeginnXZuFiInhalt = elasticsearchResponseLeistung.toLowerCase().indexOf("<xzufi:inhalt ".toLowerCase(), posBeginnXZuFiInhalt);
 
             while ( posBeginnXZuFiInhalt >= 0 ) {
          
               tempHTMLArray.push(getXMLElementValue(elasticsearchResponseLeistung, "<xzufi:inhalt ", posBeginnXZuFiInhalt, elasticsearchResponseLeistung.length));
               tempHTMLArray.push("<br/><br/>");
  
               posBeginnXZuFiInhalt = posBeginnXZuFiInhalt + 1; 
               posBeginnXZuFiInhalt = elasticsearchResponseLeistung.toLowerCase().indexOf("<xzufi:inhalt ".toLowerCase(), posBeginnXZuFiInhalt);
  
             }

             tempHTML = tempHTMLArray.join("");

             portalverbundPocHTMLErgebnisseite(funktion, portalverbundPocResponseHTTP, tempHTML);
         
           }
        
         });
         
       } else {
       
         tempHTMLArray.push("Es gibt keinen Treffer f&uuml;r Ihre Suchangaben.");
         tempHTML = tempHTMLArray.join("");

         portalverbundPocHTMLErgebnisseite(funktion, portalverbundPocResponseHTTP, tempHTML);          
       
       }  
  
     } else {

       tempHTMLArray.push("Es gibt keinen Treffer f&uuml;r Ihre Suchangaben.");
       tempHTML = tempHTMLArray.join("");

       portalverbundPocHTMLErgebnisseite(funktion, portalverbundPocResponseHTTP, tempHTML);     
     
     }
    
  }, function (err) {

     console.trace(err.message);
  
  });

  
  
  
// client.search({
//  index: 'twitter',
//  type: 'tweets',
//  body: {
//    query: {
//      match: {
//        body: 'elasticsearch'
//      }
//    }
//  }
//}).then(function (resp) {
//    var hits = resp.hits.hits;
//}, function (err) {
//    console.trace(err.message);
//});


}

//======================================================================================
// function    : portalverbundPocGetSammlerdienstHTMLSeite
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocGetSammlerdienstHTMLSeite() {

  var HTMLSeiteArray;
  var HTMLSeite;
    
  HTMLSeiteArray = [];

  HTMLSeiteArray.push("<html>");
  HTMLSeiteArray.push("<head>");
  HTMLSeiteArray.push("</head>");
  HTMLSeiteArray.push("<body style=\"font-family:arial;font-size:14px;color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + ";\">");
  HTMLSeiteArray.push(portalverbundPocGetHTMLTitle());
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<span style=\"font-size:18px\">| Sammlerdienst testen |</span>");             
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<form method=\"post\" action=\"http://" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocHTTPServerHostname"].toString() + ":" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocHTTPServerPort"].toString() + "\">");
  HTMLSeiteArray.push("<input type=\"hidden\" name=\"funktion\" value=\"PORTALVERBUND_POC_SAMMLERDIENST\"></input>");
  HTMLSeiteArray.push("| Leistungsbericht (XZuFi) |"); 
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>"); 
  HTMLSeiteArray.push("<textarea style=\"border-size:2px;border-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + "\" name=\"funktionsdaten\" rows=\"20\" cols=\"160\">");      
  HTMLSeiteArray.push("</textarea>");  
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<button style=\"font-size:16px;font-weight:bold;background-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + ";color:#ffffff;border-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + "\" type=\"submit\" name=\"mybutton\">Sammlerdienst testen</button>");
  HTMLSeiteArray.push("</form>");
  HTMLSeiteArray.push("</body>");
  HTMLSeiteArray.push("</html>");

  HTMLSeite = HTMLSeiteArray.join("");
  
  return HTMLSeite;

}

//======================================================================================
// function    : portalverbundPocGetRegistrierungImDiensteverzeichnisHTMLSeite
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocGetRegistrierungImDiensteverzeichnisHTMLSeite() {

  var HTMLSeiteArray;
  var HTMLSeite;
    
  HTMLSeiteArray = [];

  HTMLSeiteArray.push("<html>");
  HTMLSeiteArray.push("<head>");
  HTMLSeiteArray.push("</head>");
  HTMLSeiteArray.push("<body style=\"font-family:arial;font-size:14px;color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + ";\">");
  HTMLSeiteArray.push(portalverbundPocGetHTMLTitle());
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<span style=\"font-size:18px\">| Registrierung im Diensteverzeichnis testen |</span>");             
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<form method=\"post\" action=\"http://" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocHTTPServerHostname"].toString() + ":" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocHTTPServerPort"].toString() + "\">");
  HTMLSeiteArray.push("<input type=\"hidden\" name=\"funktion\" value=\"PORTALVERBUND_POC_REGISTRIERUNG_IM_DIENSTEVERZEICHNIS\"></input>");
  HTMLSeiteArray.push("| Leistungsbericht (XZuFi) |"); 
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>"); 
  HTMLSeiteArray.push("<textarea style=\"border-size:2px;border-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + "\" name=\"funktionsdaten\" rows=\"20\" cols=\"160\">");      
  HTMLSeiteArray.push("</textarea>");  
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<button style=\"font-size:16px;font-weight:bold;background-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + ";color:#ffffff;border-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + "\" type=\"submit\" name=\"mybutton\">Registrierung im Diensteverzeichnis testen</button>");
  HTMLSeiteArray.push("</form>");
  HTMLSeiteArray.push("</body>");
  HTMLSeiteArray.push("</html>");

  HTMLSeite = HTMLSeiteArray.join("");
  
  return HTMLSeite;

}

//======================================================================================
// function    : portalverbundPocGetSucheHTMLSeite
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocGetSucheHTMLSeite() {

  var HTMLSeiteArray;
  var HTMLSeite;
  var HTMLOrtAuswahlfeldFile;
  var HTMLOrtAuswahlfeldFileContents;

//  HTMLOrtAuswahlfeldFile = portalverbundPocGlobalApplicationData["portalverbundPocWorkDir"].toString() + portalverbundPocGlobalApplicationData["portalverbundPocPathSeparator"].toString() + "portalverbund_poc_ort_auswahlfeld.html";  
//  HTMLOrtAuswahlfeldFileContents = portalverbundPocModuleFs.readFileSync(HTMLOrtAuswahlfeldFile, "utf8");

  HTMLSeiteArray = [];

  HTMLSeiteArray.push("<html>");
  HTMLSeiteArray.push("<head>");
  HTMLSeiteArray.push("</head>");
  HTMLSeiteArray.push("<body style=\"font-family:arial;font-size:14px;color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + ";\">");
  HTMLSeiteArray.push(portalverbundPocGetHTMLTitle());
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<span style=\"font-size:18px\">| Suche testen |</span>");             
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<form method=\"post\" action=\"http://" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocHTTPServerHostname"].toString() + ":" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocHTTPServerPort"].toString() + "\">");
  HTMLSeiteArray.push("<input type=\"hidden\" name=\"funktion\" value=\"PORTALVERBUND_POC_SUCHE\"></input>");
  HTMLSeiteArray.push("| Suchbegriff |"); 
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>"); 
  HTMLSeiteArray.push("<input style=\"border-size:2px;border-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + "\" id=\"idsuchtext\" name=\"suchtext\" type=\"text\" size=\"50\"></input>");        
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("| Ort |"); 
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>"); 
  HTMLSeiteArray.push("<input style=\"border-size:2px;border-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + "\" id=\"idort\" name=\"ort\" type=\"text\" size=\"50\"></input>");        
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<button style=\"font-size:16px;font-weight:bold;background-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + ";color:#ffffff;border-color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + "\" type=\"submit\" name=\"mybutton\">Suche testen</button>");
  HTMLSeiteArray.push("</form>");
  HTMLSeiteArray.push("</body>");
  HTMLSeiteArray.push("</html>");

  HTMLSeite = HTMLSeiteArray.join("");
  
  return HTMLSeite;

}

//======================================================================================
// function    : portalverbundPocGetHTMLTitle
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocGetHTMLTitle() {

  var tempHTML;
  var titel;
  var farbe;
  
  titel = portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalTitle"].toString();  
  farbe = portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString();
  
  tempHTML = "<div style=\"background:linear-gradient(to right," + farbe.toString() + ",#ffffff);color:#ffffff;font-size:24px;\">" + titel.toString() + "</div>";
  
  return tempHTML.toString();

}

//======================================================================================
// function    : portalverbundPocHTMLErgebnisseite
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocHTMLErgebnisseite(funktion, portalverbundPocResponseHTTP, inputHTML) {

  var HTMLSeiteArray;
  var HTMLSeite;
 
  HTMLSeiteArray = [];

  HTMLSeiteArray.push("<html>");
  HTMLSeiteArray.push("<head>");
  HTMLSeiteArray.push("</head>");
  HTMLSeiteArray.push("<body style=\"font-family:arial;font-size:14px;color:" + portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocPortalColor"].toString() + ";\">");
  HTMLSeiteArray.push(portalverbundPocGetHTMLTitle());
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<span style=\"font-size:18px\">| Ergebnis |</span>");             
  HTMLSeiteArray.push("<br/>");
  HTMLSeiteArray.push("<br/>");  
  HTMLSeiteArray.push("<br/>");  

  if ( funktion === "PORTALVERBUND_POC_SAMMLERDIENST" ) {

    HTMLSeiteArray.push("Der Sammlerdienst wurde erfolgreich aufgerufen.");

  }

  if ( funktion === "PORTALVERBUND_POC_REGISTRIERUNG_IM_DIENSTEVERZEICHNIS" ) {

    HTMLSeiteArray.push("Die Registrierung im Diensteverzeichnis wurde erfolgreich aufgerufen.");

  }

  if ( funktion === "PORTALVERBUND_POC_SUCHE" ) {
  
    HTMLSeiteArray.push(inputHTML);

  }

  HTMLSeiteArray.push("</body>");
  HTMLSeiteArray.push("</html>");
  
  HTMLSeite = HTMLSeiteArray.join("");

  portalverbundPocResponseHTTP.send(HTMLSeite);

}

//======================================================================================
// function    : portalverbundPocRunHTTPServer
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocRunHTTPServer() {

//--------------------------------------------------------------------------------------
//
//--------------------------------------------------------------------------------------

  portalverbundPocGlobalApplicationData["portalverbundPocExpressApp"] = portalverbundPocModuleExpress();

  portalverbundPocGlobalApplicationData["portalverbundPocExpressApp"].use(portalverbundPocModuleBodyParser.json());
  portalverbundPocGlobalApplicationData["portalverbundPocExpressApp"].use(portalverbundPocModuleBodyParser.urlencoded({ extended: true }));

  portalverbundPocGlobalApplicationData["portalverbundPocExpressApp"].post("/", function(portalverbundPocRequestHTTP, portalverbundPocResponseHTTP) {

    var funktion;
    var funktionsdaten;
    var suchtext;
    var ort;

//    console.log("funktion=" + portalverbundPocModuleLodash.trim(portalverbundPocRequestHTTP.body.funktion.toString()));
//    console.log("funktionsdaten=" + portalverbundPocModuleLodash.trim(portalverbundPocRequestHTTP.body.funktionsdaten.toString()));

    funktion = portalverbundPocModuleLodash.trim(portalverbundPocRequestHTTP.body.funktion.toString());

    if ( funktion === "PORTALVERBUND_POC_SAMMLERDIENST" ) {

      funktionsdaten = portalverbundPocModuleLodash.trim(portalverbundPocRequestHTTP.body.funktionsdaten.toString());

      portalverbundPocSammlerdienst(funktionsdaten); 
      portalverbundPocHTMLErgebnisseite(funktion, portalverbundPocResponseHTTP, "");

    }

    if ( funktion === "PORTALVERBUND_POC_REGISTRIERUNG_IM_DIENSTEVERZEICHNIS" ) {

      funktionsdaten = portalverbundPocModuleLodash.trim(portalverbundPocRequestHTTP.body.funktionsdaten.toString());

      portalverbundPocRegistrierungImDiensteverzeichnis(funktionsdaten);
      portalverbundPocHTMLErgebnisseite(funktion, portalverbundPocResponseHTTP, "");

    }

    if ( funktion === "PORTALVERBUND_POC_SUCHE" ) {

      suchtext = portalverbundPocModuleLodash.trim(portalverbundPocRequestHTTP.body.suchtext.toString());
      ort = portalverbundPocModuleLodash.trim(portalverbundPocRequestHTTP.body.ort.toString());
      
      portalverbundPocSuche(suchtext, ort, funktion, portalverbundPocResponseHTTP);

    }

//    portalverbundPocResponseHTTP.send("Bremen");


  });

  portalverbundPocGlobalApplicationData["portalverbundPocExpressApp"].get("/portalverbund_poc_sammlerdienst", function(portalverbundPocRequestHTTP, portalverbundPocResponseHTTP) {

    portalverbundPocResponseHTTP.send(portalverbundPocGetSammlerdienstHTMLSeite());

  });

  portalverbundPocGlobalApplicationData["portalverbundPocExpressApp"].get("/portalverbund_poc_registrierung_im_diensteverzeichnis", function(portalverbundPocRequestHTTP, portalverbundPocResponseHTTP) {

    portalverbundPocResponseHTTP.send(portalverbundPocGetRegistrierungImDiensteverzeichnisHTMLSeite());

  });

  portalverbundPocGlobalApplicationData["portalverbundPocExpressApp"].get("/portalverbund_poc_suche", function(portalverbundPocRequestHTTP, portalverbundPocResponseHTTP) {

    portalverbundPocResponseHTTP.send(portalverbundPocGetSucheHTMLSeite());

  });

  portalverbundPocGlobalApplicationData["portalverbundPocExpressApp"].listen(portalverbundPocGlobalApplicationData["portalverbundPocConfig"]["portalverbundPocHTTPServerPort"]);

}

//======================================================================================
// function    : portalverbundPocSetPathSeparator
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocSetPathSeparator() {

  var platformUpperCase;

  platformUpperCase = process.platform;
  platformUpperCase = portalverbundPocModuleLodash.toUpper(platformUpperCase);

  portalverbundPocGlobalApplicationData["portalverbundPocPathSeparator"] = "/"
  
  if ( platformUpperCase === "WIN32" ) { 
  
    portalverbundPocGlobalApplicationData["portalverbundPocPathSeparator"] = "\\" 
    
  }

}

//======================================================================================
// function    : portalverbundPocSetWorkDir
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocSetWorkDir() {

  portalverbundPocGlobalApplicationData["portalverbundPocWorkDir"] = __dirname;

}

//======================================================================================
// function    : portalverbundPocReadConfig
// description : 
// input       : 
// output      :  
//======================================================================================

function portalverbundPocReadConfig() {

  var configFile;
  var configFileContents;
  
  configFile = portalverbundPocGlobalApplicationData["portalverbundPocWorkDir"].toString() + portalverbundPocGlobalApplicationData["portalverbundPocPathSeparator"].toString() + "portalverbund_poc_config.json";
  
  configFileContents = portalverbundPocModuleFs.readFileSync(configFile, "utf8");

  portalverbundPocGlobalApplicationData["portalverbundPocConfig"] = JSON.parse(configFileContents.toString());
  
}

//======================================================================================
// Main program
//======================================================================================

var portalverbundPocModuleLodash = require("lodash");
var portalverbundPocModuleExpress = require("express");
var portalverbundPocModuleBodyParser = require("body-parser");
var portalverbundPocModuleXMLParser = require("xml-parser");
var portalverbundPocModuleFs = require("fs");
var portalverbundPocModuleUuid = require("uuid/v1");
var portalverbundPocModuleRequest = require("request");
var portalverbundPocModuleUTF8 = require("utf8");
var portalverbundPocModuleMosca = require("mosca");
var portalverbundPocModuleRedis = require("redis");
var portalverbundPocModuleElasticsearch = require("elasticsearch");
var portalverbundPocModuleMQTT = require("mqtt");
var portalverbundPocModuleChalk = require("chalk");

var portalverbundPocGlobalApplicationData;

portalverbundPocGlobalApplicationData = {};


// console.log(getXMLElementValue("<xzufi:ergebnisLeistung><xzufi:id>99108001001000</xzufi:id></xzufi:ergebnisLeistung>", "<xzufi:id>", 0));
// console.log("d=" + portalverbundPocDatumFormatieren("2017-11-24"));

// portalverbundPocGetRedisKeyValue("kekse");



portalverbundPocSetPathSeparator();
portalverbundPocSetWorkDir();
portalverbundPocReadConfig();
portalverbundPocRunMessageEngine();
portalverbundPocSubscribeMessageEngines();
portalverbundPocRunHTTPServer();

