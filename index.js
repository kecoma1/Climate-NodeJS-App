require('dotenv').config()

const { 
    leerInput,
    inquirerMenu,
    pausa,
    listarLugares
} = require('./helpers/inquirer');
const Busquedas = require('./models/busqueda');

const main = async() => {

    let opt = 0;
    const busquedas = new Busquedas();


    do {

        opt = await inquirerMenu();

        switch( opt ) {

            case 1:
                // Mensaje
                const termino = await leerInput('Ciudad: ');
                
                // Buscamos las localizaciones
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccionamos el lugar
                const id = await listarLugares(lugares);
                if ( id === '0' ) continue;
                const lugarSel = lugares.find( e => e.id === id );
                

                // Guardar en la base de datos
                busquedas.addHistorial( lugarSel.nombre )

                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Descripción:', clima.desc);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);

            break;

            case 2:
                busquedas.historialCapitalizado.forEach( ( lugar, i ) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar }` );
                });
            break;
        }        

        if ( opt != 0 ) await pausa();

    } while ( opt !== 0 );
}

main();