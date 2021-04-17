$(document).ready(function () {
    //instance d'authentification 
    const backendApiNoAuth = axios.create({
        baseURL: "http://app-rs-backend.herokuapp.com/auth",
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
                baseURL: "http://app-rs-backend.herokuapp.com/api",
                timeout: 80000,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user.token,
                },
            });

            //recuperation des utilisateurs du laboratoire
            backendApi.get(`/labUsers/${user.laboratoriesHeaded[0]._id}`)
                .then(function (response) {
                    var images = $('#images');
                    var op = "";
                    response.data.forEach((user)=>{
                        
                        //s'il possede une image de profile
                        if(user.profilePicture!=null || user.profilePicture!=undefined){
                            op+= `<img src="http://app-rs-backend.herokuapp.com/pictures/${user.profilePicture}" style="height:64px;width:64px"/>`
                        }else{
                            op+= `<img src="https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}" style="height:64px;width:64px"/>`
                        }
                    })
                    images.html(op)
                    
                }).catch(function (error) {
                    console.log(error)
                })


        })
        .catch(function (error) {
            console.log(error)
        })
})
