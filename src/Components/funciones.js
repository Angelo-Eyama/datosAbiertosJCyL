/**
 * Función que recibe una URL base, el total de registros y el límite de registros por solicitud.
 * Genera un array de URLs con el offset correspondiente para solicitar todos los registros.
 */

export function generarUrls(baseUrl, totalRegistros, limite) {
    const urls = [];
    const numeroSolicitudes = Math.ceil(totalRegistros / limite); // Calcula cuántas solicitudes son necesarias

    for (let i = 0; i < numeroSolicitudes; i++) {
        const offset = i * limite;
        const urlConOffset = `${baseUrl}&offset=${offset}`;
        urls.push(urlConOffset); // Agrega la URL con el offset correspondiente
    }

    return urls;
}

/**
 * Funcion que recibe un array de urls y solicita los datos de cada una de ellas (que seran jsons)
 * junta las respuestas en un unico array de objetos y los devuelve
 */
export async function getDatos(urls) {
    let resultados = [];
    for (let url of urls) {
        try {
            let respuesta = await fetch(url);
            if (!respuesta.ok) {
                console.error(`Error en la solicitud a ${url}: ${respuesta.statusText}`);
                continue;
            }
            let json = await respuesta.json();
            delete json.total_count;
            resultados.push(...json.results); // Combina los resultados en un solo array
        } catch (error) {
            console.error(`Error al procesar la solicitud a ${url}:`, error);
        }
    }
    return resultados;
}