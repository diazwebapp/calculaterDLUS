const axios = require('axios');
const cheerio = require('cheerio');

function formatearNumero(numero) {
  const numeroFormateado = numero.slice(0, 3)+"-"+numero.slice(3, 5)+"-"+numero.slice(5);
  
  return numeroFormateado;
}

const getLicenseDriver = async (persona,targetState="FL") => {
  let {lastName, dob, gender,middleName,name} = persona
    
    dob = dob.split('/');

    var birthDay = dob[0];
    var birthMonth = dob[1];
    var birthYear = dob[2];

  const url = 'https://www.elfqrin.com/usssndriverlicenseidgen.php?usstt='+targetState+'&fname='+name+'&mname='+middleName+'&lname='+lastName+'&gender='+gender+'&bdyy='+birthYear+'&bdmm='+birthMonth+'&bddd='+birthDay+'&submit=Generate+ID';
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let ssn = $('td:contains("SSN")').next('td').find('strong').text();
    const driverLicense = $('td:contains("Driver License")').next('td').find('strong').text();
    ssn = formatearNumero(ssn)
    return{ driverLicense,ssn}
  } catch (error) {
    if (error.response) {
      console.error('Error de respuesta:', error.response.status);
      // Manejar el error de respuesta HTTP
    } else if (error.request) {
      console.error('Error de conexión:', error.request);
      // Manejar el error de conexión
    } else {
      console.error('Error desconocido:', error.message);
      // Manejar otros errores desconocidos
    }
    return { ssn: '', driverLicense: '' };
  }
};



module.exports = getLicenseDriver;