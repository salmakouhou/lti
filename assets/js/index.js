$(document).ready(function () {
    
    //function bindSupervisor(supervisors){
       // if (supervisors === "5f40f52e95de870017abef2a") return "Kartit Ali";
       // if (supervisors === "5f40f52e95de870017abef22 ") return "Ouahmane Hassan";
       // if (supervisors === "5f3d39fdc685e0001744004d") return "Hassan OUAHMANE";
       // if (supervisors === "5f3d39fdc685e00017440055 ") return "Ali KARTIT";
    //}
    
   // function convertSupervisor(supervisor){
        //console.log("HHHHHHHHHHHHHHHHHHHHHHH");
     //   return supervisor.map(function(supervisors){ return bindSupervisor(supervisors) ;});
   // }
    
    /////////////////////////////////////////////
     function bindRole(role){
        if (role === "RESEARCHER") return "Chercheur";
        if (role === "CED_HEAD") return "Chef de CED";
        if (role === "TEAM_HEAD") return "Chef d'équipe";
        if (role === "VICE_CED_HEAD") return "Vice Président Chargé de la Recherche Scientifique";
    }
    
    function convertRoles(roles){
        //console.log("HHHHHHHHHHHHHHHHHHHHHHH");
        return roles.map(function(role){ return bindRole(role) ;});
    }
    /////////////////////////////////////////////////
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
            
            //backendApi.get(`/followed-users`, { params: { "laboratory_abbreviation": user.laboratoriesHeaded[0].abbreviation } })
            backendApi.get(`/labUsers/5f40f53095de870017abef56`)
                .then(function (response) {
                    console.log(response);
                    var chercheurs = $('#chercheursInfo');
                    var op = "";
                    //var chercheursCount = $('#chercheursCount');
                    //var nbr = ""+response.data.length;
                   // chercheursCount.html(nbr);
                    response.data.forEach((user) => {
                        user.roles = convertRoles(user.roles);
                        //console.log(convertRoles(user.roles));
                        //s'il possede une image de profile
                        if ((user.profilePicture != null || user.profilePicture != undefined)) {
                           
                            backendApi.get(`https://app-rs-backend.herokuapp.com/pictures/${user.profilePicture}`).then(function (response) {
                           
                                op += '<div class="col-lg-6">' +
                                    '<div class="member d-flex align-items-start">' +
                                    `<div><img class="sp_img" src="https://app-rs-backend.herokuapp.com/pictures/${user.profilePicture}" style="height:64px;width:64px" alt=""></div>` +
                                    '<div class="member-info">' +
                                    `<h6>${convertRoles(user.roles)}</h6>` +
                                    `<span></span>` +
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
                             // console.log(error)
                                 
                                
                                op += '<div class="col-lg-6">' +
                                    '<div class="member d-flex align-items-start">' +
                                    `<div><img class="sp_img" src="http://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}" style="height:64px;width:64px" alt=""></div>` +
                                    '<div class="member-info">' +
                                    `<h4>Prof. ${user.firstName} ${user.lastName}</h4>` +
                                    `<h6>${user.roles}</h6>` +
                                    `<span></span>` +
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
                            })

                        } else {
                            op += '<div class="col-lg-6">' +
                                '<div class="member d-flex align-items-start">' +
                                `<div><img class="sp_img" src="https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}" alt=""></div>` +
                                '<div class="member-info">' +
                                `<h4>Prof. ${user.firstName} ${user.lastName}</h4>` +
                                `<h6>${user.roles}</h6>` +
                                `<span></span>` +
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


            //doctorants
            backendApi.get(`/phdStudentsLabs`)
                .then(function (response) {
                    console.log(response);
                    var content = '';
                    
                    response.data.students.forEach((phdStudent) => {
                        console.log(phdStudent)
                        var coSupervisor ;
                        if(phdStudent.coSupervisor==null){
                            coSupervisor="none"
                        }else{
                            coSupervisor=phdStudent.coSupervisor.firstName.concat(" "+phdStudent.coSupervisor.lastName)
                        }
                        content +='<div class="testimonial-wrap">' +
                            '<div class="testimonial-item">' +
                            `<div><img class="testimonial-img" src="https://ui-avatars.com/api/?name=${phdStudent.firstName}+${phdStudent.lastName}"  alt=""></div>` +
                            '<div class="member-info">' +
                            `<h3>${phdStudent.firstName} ${phdStudent.lastName}</h3>` +
                            `<span></span>` +
                            `<h6><strong>Directeur de thèse :</strong>${phdStudent.supervisor.firstName.concat(" "+phdStudent.supervisor.lastName)}</h6>` +
                            `<h6><strong>Co-Directeur de thèse : </strong> ${coSupervisor}</h6>` +
                            `<h6><strong>Intitulé de la thèse : </strong> ${phdStudent.thesisTitle}</h6>` +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                    })
                    var carousel = $('#phdStudentsInfo');
                    carousel.trigger('destroy.owl.carousel'); 
                    carousel.find('.owl-stage-outer').children().unwrap();
                    carousel.removeClass("owl-center owl-loaded owl-text-select-on");
                    var phdStudentsCount = $('#phdStudentsCount');
                    var nbrr = ""+response.data.length;
                    phdStudentsCount.html(nbrr);
                   
                    carousel.html(content);

                    //reinitialize the carousel (call here your method in which you've set specific carousel properties)
                    carousel.owlCarousel({
                        items: 2,
                        loop: true,
                        margin: 10,
                        autoplay: true,
                        autoplayTimeout: 3000,
                        autoplayHoverPause: true
                    });
                })
                .catch(function (error) {
                    console.log(error)
                })


            //publications
            backendApi.get('/followed-users', { params: { "laboratory_abbreviation": "LTI" } })
                .then(function (response) {
                
                var chercheursCount = $('#chercheursCount');
                    var nbr = ""+response.data.length;
                    chercheursCount.html(nbr);

                    var pubs = new Map()
                    response.data.forEach((data) => {
                        data.publications.forEach((pub) => {
                            pubs.set(pub.title.toLowerCase(), pub)
                        })
                    })
                    pubs = Array.from(pubs).map((pub) => { return pub[1] })

                    var pubData = new Map();
                    pubs.forEach((pub) => {
                        var temp = new Array();
                        temp.push(pub)
                        if (pubData.get(pub.year)) {
                            pubData.set(pub.year, pubData.get(pub.year).concat(temp))
                        } else {
                            pubData.set(pub.year, temp)
                        }
                       // if ($publications.source != NULL){
                        //    var{ $publications.source} 
                         
                            
                    })

                    var keys = pubData.keys();
                    var mainOp='';
                    var i =1;
                    Array.from(keys).sort().reverse().forEach((key) => {
                        var pubs = pubData.get(key);
                        var op = `<li data-aos="fade-up" data-aos-delay="300">
                        <i class="bx bx-help-circle icon-help"></i> <a data-toggle="collapse" href="#faq-list-${i}"
                            class="collapsed">${key}<i class="bx bx-chevron-down icon-show"></i><i
                                class="bx bx-chevron-up icon-close"></i></a>
                        <div id="faq-list-${i}" class="collapse" data-parent=".faq-list">
                            <p >
                            `;
                        pubs.forEach((publications) => {
                            
                             if ((publications.source != null || publications.source != undefined)) {

                            op += `<i style="margin-bottom:15px;" class="bx bx-cube-alt"> ${publications.authors.join(', ')}, "${publications.title}"
                            , ${publications.source}.
                        </i>`
                             }else {
                             
                            op += `<i style="margin-bottom:15px;" class="bx bx-cube-alt"> ${publications.authors.join(', ')}, "${publications.title}"
                            
                        </i>`
                                 
                             }
                        })
                        op += `</p>
                        </div>
                    </li>`
                    mainOp+=op;
                    i=i+1;
                    })

                    $("#pubs").html(mainOp)

                })
                .catch(function (error) {
                    console.log(error)
                })

                ///////////////////////////////////////////
                
                // count teams
                backendApi.get('/teams/', { params: { "laboratory_id": "5f40f53095de870017abef56" } })
                .then(function (response) {
                console.log(response);
                var teamsCount = $('#teamsCount');
                    var nbr = ""+response.data.length;
                    teamsCount.html(nbr);

                 
               
                }).catch(function (error) {
                    console.log(error)
                })

                //
                backendApi.get('/phdStudents/', { params: { "laboratory_id": "5f40f53095de870017abef56" } })
                .then(function (response) {
                console.log(response);
                var phdStudentsCount = $('#phdStudentsCount');
                    var nbr = ""+response.data.length;
                    phdStudentsCount.html(nbr);

                 
               
                }).catch(function (error) {
                    console.log(error)
                })



        })
})

