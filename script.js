//Constantes
const cargabatch = "CARGABATCH";
const cargainit = "CARGAINIT";
const isEmpty = "NO HAY VALOR EN EL CAMPO"
const isTest = "_D";
const validNull = "";
const CMIT = "MKYOP_CMIT_DELTA";
const MEIT = "MKYOP_MEIT_DELTA";
const MITR = "MKYOP_MITR_DELTA";
const RSCE = "MKYOP_RSCE_DELTA";
const capabilityLength = 12;
const gfValidationPriorityNumber = 0;
//Variables 
let contenido = [];
let fechaArchivo;
let especificarArchivos = document.getElementById("flexSwitchCheckChecked");

//Saber que archivos se requieren en especifico
const archivosSeleccionados = async ()=>{
  let archivos = [];
  for(let i=0; i<=3; i++){
    if(document.getElementById(`flexCheck_${i}`).checked){
      archivos.push(`flexCheck_${i}`);
    }
  }
  console.log("Obtener checks: "+archivos)
  return archivos;
}

//Logica para leer el archivo generador
const excelInput = document.getElementById("xlxs");
excelInput.addEventListener('read', async function(contenido){
  
  contenido = await readXlsxFile(excelInput.files[0]);
  let checks = await archivosSeleccionados();
  contenido = verifyArray(contenido);
  fechaArchivo = extractDate(document.getElementById('uploadDate'));
  forTest = verifyCheck(document.getElementById('checkTestBox'))
  console.log(contenido);

  let meit = mapMEIT(contenido);
  let mitr = mapMITR(contenido);
  let rsce = mapRSCE(contenido);
  let cmit = mapCMIT(alertArray(contenido));

  //Descargar los archivos
  var enlace = document.createElement("a");
  if(especificarArchivos){
    for(let h=0; h<checks.length; h++){
      switch(checks[h]){
        case 'flexCheck_0':
          downloadFileMapped(meit, MEIT, fechaArchivo, forTest);
        break;
        case 'flexCheck_1':
          downloadFileMapped(rsce, RSCE, fechaArchivo, forTest);
        break;
        case 'flexCheck_2':
          downloadFileMapped(cmit, CMIT, fechaArchivo, forTest);
        break;
        case 'flexCheck_3':
          downloadFileMapped(mitr, MITR, fechaArchivo, forTest);
        break;
        default: console.error("No se encontraron elementos a descargar")
      }
    }
  }else{
    //Descarga todos
    downloadFileMapped(cmit, CMIT, fechaArchivo, forTest);
    downloadFileMapped(meit, MEIT, fechaArchivo, forTest);
    downloadFileMapped(mitr, MITR, fechaArchivo, forTest);
    downloadFileMapped(rsce, RSCE, fechaArchivo, forTest);
  }

  function downloadFileMapped(tabla, nomenclatura, fecha, isForTest){
    enlace.setAttribute("href", "data:text/plain;charset=utf-8,"+ tabla.replace(/,/g, "\n"));
    enlace.setAttribute("download", `${nomenclatura}_${fecha}${isForTest ? isTest:""}.txt`);
    enlace.style.display = "none";
    document.body.appendChild(enlace);
    enlace.click();
  };
});

//Crear los archivos.
const crearArchivos = document.getElementById("btnCrear");
crearArchivos.addEventListener(
  'click', 
  ()=>{excelInput.dispatchEvent(new CustomEvent('read', archivosSeleccionados));}
);

//Limpia valores nulos
function verifyArray(recived){
  let arr = recived;
  for(let i=1; i<arr.length; i++){
    if(arr[i] === null){
      arr[i] = validNull;
    }
    for(let j=0; j<arr[i].length; j++){
      if(arr[i][j] === null){
        arr[i][j] = validNull;
      }
    }
  }
  return arr;
}
//------Mapeo de datos a los layouts------
//Mapeo del archivo CMIT
function mapCMIT(data){
  //Crear un registro por cada capability encontrado
  let datos = data;
  let arrMapped = [];
  let arrUsable = [];
  //Mapea el string a retornar
  for(let i=1; i<datos.length; i++){
    let [,,,,CAPABILITY,,,,,,,,] = datos[i];
    let [,,ID,,,,,,,,,,] = datos[i];
    arrUsable.push(CAPABILITY);
    arrUsable.push(ID);
    arrUsable.push(cargabatch);
    arrMapped.push(arrUsable.join('|'));
    arrUsable = [];
  };
  return arrMapped.toString();
}
//Mapeo del archivo MEIT
function mapMEIT(data){
  let datos = data;
  let arrMapped = [];
  let arrUsable = [];
  //Mapea el string a retornar
  for(let i=1; i<datos.length; i++){
    let [,,GF_MENU_ITEM_ID,,,,,,,,,,,,,] = datos[i];
    let [APP,,,,,,,,,,,,,,,] = datos[i];
    let [,,,,,,,GF_MENU_ITEM_NAME,,,,,,,,] = datos[i];
    let [,GF_MENU_ITEM_ORDER_NUMBER,,,,,,,,,,,,,,] = datos[i];
    let [,,,,,,,,,,,,gfVisibleIndType,,,] = datos[i];
    let [,,,,,,,,,,,,,GF_START_DATE,,] = datos[i];
    let [,,,,,,,,,,,,,,GF_END_DATE,] = datos[i];
    let [,,,,,,,,,,,GF_MENU_ITEM_CLSFN_TYPE_NAME,,,,] = datos[i];
    let [,,,,,,,,,,,,,,,GF_GET_CUSTOMER_SEGMENT_ID] = datos[i];
    let [,,,GF_MENU_ITEM_PARENT_ID,,,,,,,,,,,,] = datos[i];
    
    arrUsable.push(GF_MENU_ITEM_ID);
    arrUsable.push(APP);
    arrUsable.push(GF_MENU_ITEM_NAME);
    arrUsable.push(GF_MENU_ITEM_ORDER_NUMBER);
    arrUsable.push(validateIsOn(gfVisibleIndType));
    arrUsable.push(GF_START_DATE);
    arrUsable.push(GF_END_DATE);
    arrUsable.push(GF_MENU_ITEM_CLSFN_TYPE_NAME);
    arrUsable.push(GF_GET_CUSTOMER_SEGMENT_ID);
    arrUsable.push(GF_MENU_ITEM_PARENT_ID);
    arrUsable.push(cargabatch);
    arrMapped.push(arrUsable.join('|'));
    arrUsable = [];
  };
  return arrMapped.toString();
}
//Mapeo del archivo MITR
function mapMITR(data){
  let datos = data;
  let arrMapped = [];
  let arrUsable = [];
  //Mapea el string a retornar
  for(let i=1; i<datos.length; i++){
    let [,,GF_MENU_ITEM_ID,,,,,,,,,,,,,,GF_VALIDATION_ID] = datos[i];
    arrUsable.push(GF_MENU_ITEM_ID);
    arrUsable.push(duplicateId(GF_MENU_ITEM_ID));
    arrUsable.push(GF_VALIDATION_ID);
    arrUsable.push(gfValidationPriorityNumber);
    arrUsable.push(cargabatch);
    arrMapped.push(arrUsable.join('|'));
    arrUsable = [];
  };
  return arrMapped.toString();
}
//Mapeo del archivo RSCE
function mapRSCE(data){
  let datos = data;
  let arrMapped = [];
  let arrUsable = [];
  //Mapea el string a retornar
  for(let i=1; i<datos.length; i++){
    let [,,GF_MENU_ITEM_ID,,,GF_URL_EXECUTION_DESC,HOST,,GF_IMAGE_URL_DESC,GF_IMAGE_DESC,GF_RES_INT_ACTION_NAME,,,,,,] = datos[i];

    arrUsable.push(duplicateId(GF_MENU_ITEM_ID));
    arrUsable.push("");
    arrUsable.push(GF_URL_EXECUTION_DESC);
    arrUsable.push(HOST);
    arrUsable.push(HOST);
    arrUsable.push(GF_RES_INT_ACTION_NAME);
    arrUsable.push(GF_IMAGE_URL_DESC);
    arrUsable.push(GF_IMAGE_DESC);
    arrUsable.push(cargabatch);
    arrMapped.push(arrUsable.join('|'));
    arrUsable = [];
  };
  return arrMapped.toString();
}

//Revisa si tiene varios CAP
function lookForCaps(capabilities){
  if(capabilities.length>12 && capabilities!==isEmpty){
    return true;
  }else{
    return false;
  }
}
//Crear un registro por cada CAP
function verifCaps(arrayVerified){
  let arr = arrayVerified;
  let elementsToDelete = [];
  for(let i=1; i<arr.length; i++){
    for(let j=0; j<arr[i].length; j++){
      if(j === 4 && arr[i][j] != undefined){
        if(lookForCaps(arr[i][j])){
          console.log("Se detectaron multiples capabilities: \n"+arr[i][4]);

          let newArr = [arr[i][j]];
          let count = 0;
          newArr = Object.values(newArr);
          newArr[0] = newArr[0].split("\n").join(",");
          for(let c of newArr[0]){
            if(c == ","){
              count++;
            }
          }
          //mapear cada elemento en un nuevo arreglo
          for(let z=0; z<((newArr[0].length-count)/capabilityLength); z++){
            let cloneArr = arr[i].slice();
            let divider = newArr[0].split(',');
            cloneArr[4] = divider[z];
            arr.push(cloneArr);
          }
          elementsToDelete.push(arr[i]);
        }
      }
    }
  }
  elementsToDelete.forEach((elemento)=>{
    arr.forEach((registro)=>{
      if(elemento == registro){
        arr.splice(arr.indexOf(registro), 1);
      }
    });
  });
  return arr;
}
//Obtener ID's separados por guiones
function duplicateId(id){
  let duplicateId = `${id}-${id}`;
  return duplicateId
}
//Valida si la opción es visible
function validateIsOn(estado){ 
  let estatus;
  estado===true ? estatus = 1: estatus = 0;
  return estatus;
}
//Reemplazar espacios con alertamiento
function alertArray(recived){
  let arr = recived;
  for(let i=1; i<arr.length; i++){
    if(arr[i] == validNull){
      arr[i] = isEmpty;
    }
    for(let j=0; j<arr[i].length; j++){
      if(arr[i][j] == validNull){
        arr[i][j] = isEmpty;
      }
    }
  }
  return verifCaps(arr);
}
//Obtener valor de inputs
function extractDate(element) {
  let dateFormatted = element.value.split("-");
  let newDate = [];
  let [AAAA,MM,DD] = dateFormatted;

  newDate.push(AAAA.substr(2, 3));
  newDate.push(MM);
  newDate.push(DD);
  newDate = newDate.join('');
  return newDate.toString();
}
//Valida si el archivo es para test
function verifyCheck(element){
  if(element.checked == true){
    return true;
  }else{
    return false;
  }
}