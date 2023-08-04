
const processText = require('../persons_modules/name');
const { createPerson } = require('../persons_modules/persons-methods');
const getNumeroLicencia = require('../persons_modules/scrap')

async function regenerate_person_data(texto, targetState = "FL") {
    texto = texto.toUpperCase();
    const lines = texto.split('\n');
    const persons =[]
    for (let line of lines){
        
        let {personData,newLine} = processText(line)
      
        personData.nota= ""
        personData.status= "nueva",
        personData.fechaRegistro = new Date().getTime()
        personData = parseLine(newLine,personData)
        const { ssn, driverLicense } = await getNumeroLicencia(personData, targetState);
        personData.dl = driverLicense;
        personData.ssn == '' ? personData.alternative = ssn : null
        personData = createPerson(personData);
        persons.push(personData)
    }
    
   return persons
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
    person.middleName = fullName[2] && isNaN(fullName[2]) ? fullName[2].trim()  : ""
    person.addres = remainingText.trim();
    person.state = person.addres? person.addres.slice(-2) : ""
    return person
    
}


module.exports = regenerate_person_data