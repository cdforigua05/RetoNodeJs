const http = require('http');
const axios = require('axios');
const fs = require('fs');

async function getProveedoresfromServer(){
    const resp = await axios.get("https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json");
    return resp.data
}

async function getClientesfromServer(){
    const resp = await axios.get("https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json");
    return resp.data
}

async function json2html(json,tipo){
    try{
        const data = fs.readFileSync("tableSketch.html", {encoding:"utf8"});
        var newPage = data.substring(0, data.indexOf("<h2"))+"\n";
        newPage += "<h2 align='center'> Lista de " + tipo +"</h2> \n";
        const topSection = data.substring(data.indexOf("<table"), data.indexOf("<tbody"));
        const lastSection = data.substring(data.indexOf("</tbody>")-1);
        var id = tipo==="proveedores"?"idproveedor":"idCliente";
        var nombre = tipo==="proveedores"?"nombrecompania":"NombreCompania";
        var contacto = tipo === "proveedores"?"nombrecontacto":"NombreContacto";
        
        newPage+=topSection+"\n <tbody> \n";
        newPage.replace("###", "Lista de"+tipo)
        for (let index = 0; index<json.length;index++){
            var fila = "<tr> \n";
            let idx = json[index][id];
            fila += "<th scope="+"row>"+idx+"</th> \n";
            let nombrex = json[index][nombre];
            fila += "<td>"+nombrex+"</td> \n";
            let contactox = json[index][contacto];
            fila += "<td>"+contactox+"</td> \n";
            fila += "</tr> \n";
            newPage += fila; 
        }
        newPage+= lastSection
        return newPage
    }catch(err){
        console.log(err)
    }
}

http.createServer(async function(req, res){
    console.log("req", req.url);
    res.writeHead("200",{'Content-Type': 'text/html'});
    if (req.url == "/api/proveedores"){
        const json = await getProveedoresfromServer();
        var rta = await json2html(json,"proveedores");
    }
    else if (req.url == "/api/clientes"){
        const json = await getClientesfromServer();
        var rta = await json2html(json, "cliente");
    }
    console.log()
    res.end(rta)
    
}).listen(8081)