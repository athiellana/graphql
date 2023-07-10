// Récupérer les informations de connexion depuis le stockage local
const username = localStorage.getItem('username');
const email = localStorage.getItem('email');

const password = localStorage.getItem('password');


// Afficher le nom d'utilisateur ou l'adresse e-mail dans la page
document.getElementById('username').textContent = username || email;


var logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", function () {
  // Supprimez les informations de connexion stockées dans les cookies ou le stockage local
  // Redirigez l'utilisateur vers la page de connexion
  window.location.href = "index.html";
});

var graphbtn = document.getElementById("btn-graph");

graphbtn.addEventListener("click", function () {
  // Supprimez les informations de connexion stockées dans les cookies ou le stockage local
  // Redirigez l'utilisateur vers la page de connexion
  window.location.href = "graph.html";
});


// ----------------------------------

const url = 'https://zone01normandie.org/api/auth/signin';

// Les informations d'identification doivent être encodées en base64 avec btoa()
const info = username + ':' + password;
const credentials = btoa(info);

// Envoi de la requête POST pour obtenir un JWT
fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + credentials,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({}),
})
  .then(response => response.json())
  .then(data => {
    // Extraire le JWT de la réponse
    const jwt = data;

    // Vérifier la validité du JWT en extractant le payload et en le décodant
    //const payload = jwt.split('.')[1];
    //const decodepayload = atob(payload)
    //   console.log(decodepayload)

    //console.log(jwt)

    //- -----------------------------------------------------------


    // Send API REQUEST
    // Définissez les options de la requête
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}` // Ajouter le JWT dans l'en-tête d'autorisation
      },
      body: JSON.stringify({
        query: `
        {
          user{
                    auditRatio
                    firstName
                    lastName
                    campus
                    email
                    attrs
                    xps {
                      event {
                        id
                      }
                      amount
                      path
                      
                    }
                  }
          xp_total: transaction_aggregate(where: {type: {_eq: "xp"}, eventId: {_eq: 32}}) {
              aggregate {
                sum {
                  amount
                }
              }
            }
          }
        `
      })
    };
    
    //variable pour stocker la réponse JSON
    let dt;
    
    // Envoyez la requête à l'API
    fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', requestOptions)
      .then(response => response.json())
      .then(json => {
        dt = json;
        processData(dt);
      })
      .catch(error => console.log(error));
    
    function processData(data) {
      // Récupération des informations
      var name = data.data.user[0].firstName;
      var lastName = data.data.user[0].lastName;
      var campus = data.data.user[0].campus;
      var email = data.data.user[0].email;
    
      var xps = data.data.user[0].xps;
    
      // Calcul du montant total des XP
      let totalAmount = 0;
    
      for (let i = 0; i < xps.length; i++) {
        let amount = xps[i].amount;
        totalAmount += amount;
      }
    
      document.getElementById('xp').textContent = data.data.xp_total.aggregate.sum.amount;
    
      var tel = data.data.user[0].attrs.Phone;
      var addresse = data.data.user[0].attrs.addressStreet;
      var city = data.data.user[0].attrs.addressCity;
    
      var ratio = data.data.user[0].auditRatio;
    
      var lienimage = data.data.user[0].attrs.image;
    
      var image = document.createElement("img");
      image.setAttribute("src", lienimage);
    
      var lienimage = data.data.user[0].attrs.image;
    
      var image = document.createElement("img");
      image.setAttribute("src", lienimage);
      image.classList.add("responsive-img");
      image.style.border = "4px solid white";
    
      // Ajouter l'image à l'élément parent
      var header = document.querySelector("header");
      var user_info = header.querySelector(".banner");
      user_info.insertBefore(image, user_info.firstChild);
    
      // Print info
      document.getElementById('lastname').textContent = lastName;
      document.getElementById('name').textContent = name;
      document.getElementById('campus').textContent = campus;
      document.getElementById('email').textContent = email;
      document.getElementById('tel').textContent = tel;
      document.getElementById('addresse').textContent = addresse;
      document.getElementById('city').textContent = city;
    
      ratio = parseFloat(ratio.toFixed(1));
      document.getElementById('ratio').textContent = ratio;
    }
    



    //- -----------------------------------------------------------

  })


  .catch(error => console.error(error));

