const http = require('http');
const url = require('url');
const fs = require('fs');

const mime = {
    'html': 'text/html',
    'css': 'text/css',
    'jpg': 'image/jpg',
    'ico': 'image/x-icon',
    'mp3': 'audio/mpeg3, mp3',
    'mp4': 'video/mp4'
};

const servidor = http.createServer((pedido, respuesta) => {
    const objetourl = url.parse(pedido.url);
    let camino = 'web1' + objetourl.pathname;
    if (camino == 'web1/')
        camino = 'web1/index.html';
    encaminar(pedido, respuesta, camino);

    function encaminar(pedido, respuesta, camino) {
        console.log(camino);
        switch (camino) {
            case 'web1/cargar': {
                grabarComentarios(pedido, respuesta);
                break;
            }
            case 'web1/leercomentarios': {
                leerComentarios(respuesta);
                break;
            }
            default: {
                fs.stat(camino, error => {
                    if (!error) {
                        fs.readFile(camino, (error, contenido) => {
                            if (error) {
                                respuesta.writeHead(500, { 'Content-Type': 'text/html' });
                                respuesta.write('error interno, no reconoce ruta');
                                respuesta.end();
                            } else {
                                const vec = camino.split('.');
                                const extension = vec[vec.length - 1];
                                const mimearchivo = mime[extension];
                                respuesta.writeHead(200, { 'Content-Type': mimearchivo });
                                respuesta.write(contenido);
                                respuesta.end();
                            }
                        });
                    } else {

                        respuesta.writeHead(404, { 'Content-Type': 'text/html' });
                        respuesta.write('<!doctype html><html><head></head><body><h1>Recurso Inexistente</h1></body></html>');
                        respuesta.end();


                    }
                
                });
            }}}
            });


function grabarComentarios(pedido, respuesta) {
    let info = '';
    pedido.on('data', datosparciales => {
        info += datosparciales;
    });
    pedido.on('end', () => {
        const formulario = querystring.parse(info);
        respuesta.writeHead(200, { 'Content-Type': 'text/html' });
        const pagina =
            `<!doctype html><html><head></head><body>
     Nombre de usuario:${formulario['nombre']}<br>
    Email:${formulario['email']}<br>
    Comentarios:${formulario['comentarios']}<hr>
    <a href="pagina3.html">Retornar</a>
    </body></html>`;
        respuesta.end(pagina);
        grabarEnArchivo(formulario);
    });
}
function grabarEnArchivo(formulario) {
    const datos = `Nombre de usuario:${formulario['nombre']}<br>
                Email:${formulario['email']}<br>
                Comentarios:${formulario['comentarios']}<br><hr>`;
    fs.appendFile('web1/visitas.txt', datos, error => {
        if (error)
            console.log(error);
    });
}

function leerComentarios(respuesta) {
    fs.readFile('web/visitas.txt', (error, datos) => {
        respuesta.writeHead(200, { 'Content-Type': 'text/html' });
        respuesta.write('<!doctype html><html><head></head><body>');
        respuesta.write(datos);
        respuesta.write(' </body></html>');
        respuesta.end();
    });

}




servidor.listen(8888);
console.log('servidor web iniciado');
