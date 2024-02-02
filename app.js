const db = require('./db/connection');
const axios = require('axios');

const createClient = () => {
    axios.get('https://randomuser.me/api/')
        .then((response) => {
            const { name } = response.data.results[0];
            const sql = `INSERT INTO clients (name,last_name, created_at) VALUES ('${name.first}','${name.last}', '2024-02-01 19:07:41')`;
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log('Cliente creado!');
                /*const sql = `INSERT INTO logs (description, time_stamp) VALUES ('Cliente creado', NOW())`;
                db.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log('Log creado!');
                });*/
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

// INSERT INTO `vet`.`pets`
// (`id`,
// `name`,
// `type`,
// `breed`,
// `owner_id`,
// `created_at`)
// VALUES
// (<{id: }>,
// <{name: }>,
// <{type: }>,
// <{breed: }>,
// <{owner_id: }>,
// <{created_at: CURRENT_TIMESTAMP}>);

const tipoMasco = ['Perro', 'Gato'];	
const razaPerro = ['Labrador', 'Pastor Alemán', 'Bulldog', 'Beagle', 'Pitbull', 'Chihuahua'];
const razaGato = ['Siamés', 'Persa', 'Bengala', 'Ragdoll', 'Sphynx ', 'Maine Coon'];


const getAllOwners = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM clients';
        db.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

const getRandomOwner = async () => {
    const owners = await getAllOwners();
    return owners[Math.floor(Math.random() * owners.length)].id;
}

const getRandomType = () => {
    return tipoMasco[Math.floor(Math.random() * tipoMasco.length)];
}

const getRandomBreed = (type) => {
    switch (type) {
        case 'Perro':
            return razaPerro[Math.floor(Math.random() * razaPerro.length)];
        case 'Gato':
            return razaGato[Math.floor(Math.random() * razaGato.length)];
        default:
            return 'N/A';
    }
}

const createRandomPet = async () => {
    try {
        const owner_id = await getRandomOwner();
        const type = getRandomType();
        const breed = getRandomBreed(type);
        const response = await axios.get('https://randomuser.me/api/');
        const { name } = response.data.results[0];
        const sql = `INSERT INTO pets (name, type, breed, owner_id, created_at) VALUES ('${name.first}', '${type}', '${breed}', ${owner_id}, '2024-02-01 19:07:41')`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log('Mascota creada!');
        });
    } catch (error) {
        console.log(error);
    }
}

setInterval(createRandomPet, 5000);