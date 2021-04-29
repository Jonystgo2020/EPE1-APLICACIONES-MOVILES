const http=require('http');
const url=require('url');
const fs=require('fs');

const mime={
	'html':'text/html',
	'css': 'text/css',
	'jpg':'image/jpg',
	'ico':'image/x-icon',
	'mp3':'audio/mpeg3, mp3',
	'mp4':'video/mp4'
  };

const servidor=http.createServer((pedido,respuesta)=>{
    const objetourl=url.parse(pedido.url);
    let camino='web1'+objetourl.pathname;
    if(camino=='web1/')   
    camino='web1/index.html';
    fs.stat(camino,error=>{
        if(!error){
            fs.readFile(camino,(error,contenido)=>{
     if (error){
    respuesta.writeHead (500,{'Content-Type':'text/html'});
    respuesta.write('error interno, no reconoce ruta');
    respuesta.end();
    }else{
        const vec=camino.split('.');
        const extension=vec[vec.length-1];
        const mimearchivo=mime[extension];        
    respuesta.writeHead (200,{'Content-Type':mimearchivo});
    respuesta.write(contenido);
    respuesta.end();
}
});
}else{
    respuesta.writeHead (404,{'Content-Type':'text/html'});
    respuesta.write('<!doctype html><html><head></head><body><h1>Recurso Inexistente</h1></body></html>');
    respuesta.end();
        }
    });
});
servidor.listen(8888);
console.log('servidor web iniciado');
