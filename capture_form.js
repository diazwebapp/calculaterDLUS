
const { createPerson } = require('./persons-methods');
const getNumeroLicencia = require('./scrap')

async function regenerate_person_data(texto, targetState = "FL") {
    texto = texto.toUpperCase();
    // Divide el texto en líneas
    const lines = texto.split('\n');
    // Crea un arreglo vacío para almacenar los resultados
    const result = [];
    // Recorre cada línea del texto
    for (let line of lines) {
        console.log(line)
        let person = {};
        let genderMatch = line.match(/^(MR\.|MS\.|MRS\.)/);
        if (genderMatch) {
            line = line.replace(genderMatch[0], '');
            if (genderMatch[0] === 'MR.') {
                person.gender = 'M';
            } else if (genderMatch[0] === 'MS.' || genderMatch[0] === 'MRS.') {
                person.gender = 'F';
            }
        }
        let birthDateMatch = line.match(/\d{2}\/\d{2}\/\d{4}/);
        if (birthDateMatch) {
            person.birthDate = birthDateMatch[0];
            line = line.replace(birthDateMatch[0], '');
        }
        let ssnMatch = line.match(/\d{3}-\d{2}-\d{4}|\d{9}/);
        if (ssnMatch) {
            person.ssn = ssnMatch[0];
            line = line.replace(ssnMatch[0], '');
        }
        let zipCodeMatch = line.match(/\d{5}$/);
        if (zipCodeMatch) {
            person.zipCode = zipCodeMatch[0];
            line = line.replace(zipCodeMatch[0], '');
        } else {
            person.zipCode = '';
        }
        if (Object.keys(person).length == 4) {
            person = parseLine(line,person)
            result.push(person);
        }
        

    }
    

// Crea un objeto con los datos de la persona
            /* const persona = {
                name,
                lastName,
                middleName,
                ssn: ssnD,
                state,
                zipCode,
                dob,
                gender,
                nota: "",
                status: "nueva",
                fechaRegistro: new Date().getTime(),
            }

            // Obtiene el número de licencia y número de seguro social remoto usando la función getNumeroLicencia
            const { ssn, driverLicense } = await getNumeroLicencia(persona, targetState);
            persona.dl = driverLicense;
            persona.ssn == '' ? persona.alternative = ssn : null

            let newPerson = createPerson(persona);
            if (newPerson) {

                result.push(newPerson);
            } */
            console.log(result)
    return result;
}

function parseLine(text,person) {
    text = text.trim().replace(/\s+/g, ' ')
    let parts = text.split(" ");
    let fullName = "";
    let remainingText = "";
    
    for (let i = 0; i < parts.length; i++) {
        if (i < 3 || (i === 3 && isNaN(parts[i]))) {
            fullName += parts[i] + " ";
        } else {
            remainingText += parts[i] + " ";
        }
    }
    
    
    fullName = fullName.split(" ")

    person.name = fullName[0].trim()  ,
    person.lastName = fullName[1].trim() 
    person.middleName = fullName[2] ? fullName[2].trim() : ""
    person.addres = remainingText.trim();
    person.state = person.addres? person.addres.slice(-2) : ""
    return person
    
}


module.exports = regenerate_person_data