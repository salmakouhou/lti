$(document).ready(function () {
    //instance d'authentification 
    const backendApiNoAuth = axios.create({
        baseURL: "https://app-rs-backend.herokuapp.com/auth",
        timeout: 80000,
        headers: { "Content-Type": "application/json" },
    });

    //s'authentifier avec le Chef Labo LTI à changer (hejjaji pour labsip)
    backendApiNoAuth.post(`/login`, { email: 'hassan.ouahmane@gmail.com', password: 'hassan.ouahmane' })
        .then(function (response) {
            const user = response.data
            localStorage.setItem("user", JSON.stringify(response.data))

            //instance de l'api apres l'authentification
            const backendApi = axios.create({
                baseURL: "https://app-rs-backend.herokuapp.com/api",
                timeout: 80000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user.token,
                },
            });

            //recuperation des utilisateurs du laboratoire
            backendApi.get(`/labUsers/${user.laboratoriesHeaded[0]._id}`)
                .then(function (response) {
                    var chercheurs = $('#chercheursInfo');
                    var op = "";
                    response.data.forEach((user) => {

                        //s'il possede une image de profile
                        if ((user.profilePicture != null || user.profilePicture != undefined)) {
                            backendApi.get(`https://app-rs-backend.herokuapp.com/pictures/${user.profilePicture}`).then(function (response) {
                                op +='<div class="col-lg-6">' +
                                    '<div class="member d-flex align-items-start">' +
                                    `<div><img class="sp_img" src="https://app-rs-backend.herokuapp.com/pictures/${user.profilePicture}" style="height:64px;width:64px" alt=""></div>` +
                                    '<div class="member-info">' +
                                    `<h4>Prof. ${user.firstName} ${user.lastName}</h4>` +
                                    `<span></span>` +
                                    '<p>chercheur</p>' +
                                    '<div class="social">' +
                                    '<a href=""><i class="ri-twitter-fill"></i></a>' +
                                    '<a href=""><i class="ri-facebook-fill"></i></a>' +
                                    '<a href=""><i class="ri-instagram-fill"></i></a>' +
                                    '<a href=""> <i class="ri-linkedin-box-fill"></i></a>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'
                            }).catch(function (error) {
                                console.log(error)
                                op+='<div class="col-lg-6">'+
                                '<div class="member d-flex align-items-start">'+
                                    `<div><img class="sp_img" src="https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}" style="height:64px;width:64px" alt=""></div>`+
                                    '<div class="member-info">'+
                                        `<h4>Prof. ${user.firstName} ${user.lastName}</h4>`+
                                        `<span></span>`+
                                        '<p>Chercheur</p>'+
                                        '<div class="social">'+
                                            '<a href=""><i class="ri-twitter-fill"></i></a>'+
                                            '<a href=""><i class="ri-facebook-fill"></i></a>'+
                                            '<a href=""><i class="ri-instagram-fill"></i></a>'+
                                           '<a href=""> <i class="ri-linkedin-box-fill"></i></a>'+
                                        '</div>'+
                                    '</div>'+
                                    '</div>'+
                                '</div>'+ 
                                '</div>'
                            })

                        } else {
                            op +='<div class="col-lg-6">' +
                                '<div class="member d-flex align-items-start">' +
                                `<div><img class="sp_img" src="https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}" alt=""></div>` +
                                '<div class="member-info">' +
                                `<h4>Prof. ${user.firstName} ${user.lastName}</h4>` +
                                `<span></span>` +
                                '<p>chercheur</p>' +
                                '<div class="social">' +
                                '<a href=""><i class="ri-twitter-fill"></i></a>' +
                                '<a href=""><i class="ri-facebook-fill"></i></a>' +
                                '<a href=""><i class="ri-instagram-fill"></i></a>' +
                                '<a href=""> <i class="ri-linkedin-box-fill"></i></a>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                        }
                    })
                    chercheurs.html(op)

                }).catch(function (error) {
                    console.log(error)
                })


        })
        .catch(function (error) {
            console.log(error)
        })



})
