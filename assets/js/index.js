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
                                op += '<div class="col-lg-6">' +
                                    '<div class="member d-flex align-items-start">' +
                                    `<div><img class="sp_img" src="https://app-rs-backend.herokuapp.com/pictures/${user.profilePicture}" style="height:64px;width:64px" alt=""></div>` +
                                    '<div class="member-info">' +
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
                                    '</div>'
                            }).catch(function (error) {
                                console.log(error)
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
                                `<div><img class="sp_img" src="http://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}" alt=""></div>` +
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
            backendApi.get(`/phdStudentsLabs/`)
                .then(function (response) {
                    var content = '';
                    response.data.students.forEach((doctor) => {
                        content +='<div class="testimonial-wrap">' +
                            '<div class="testimonial-item">' +
                            `<div><img class="testimonial-img" src="http://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}"  alt=""></div>` +
                            '<div class="member-info">' +
                            `<h4>Prof. ${doctor.firstName} ${doctor.lastName}</h4>` +
                            `<span></span>` +
                            `<h6>${user.roles}</h6>` +
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

                   
                    carousel.html(content);

                    //reinitialize the carousel (call here your method in which you've set specific carousel properties)
                    carousel.owlCarousel();
                })
                .catch(function (error) {
                    console.log(error)
                })


            //publications
            backendApi.get('/followed-users', { params: { "laboratory_abbreviation": "LTI" } })
                .then(function (response) {

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
                    })

                    var keys = pubData.keys();
                    var mainOp='';
                    var i =1;
                    Array.from(keys).forEach((key) => {
                        var pubs = pubData.get(key);
                        var op = `<li data-aos="fade-up" data-aos-delay="300">
                        <i class="bx bx-help-circle icon-help"></i> <a data-toggle="collapse" href="#faq-list-${i}"
                            class="collapsed">${key}<i class="bx bx-chevron-down icon-show"></i><i
                                class="bx bx-chevron-up icon-close"></i></a>
                        <div id="faq-list-${i}" class="collapse" data-parent=".faq-list">
                            <p >
                            `;
                        pubs.forEach((publications) => {

                            op += `<i style="margin-bottom:15px;" class="bx bx-cube-alt"> ${publications.authors.join(', ')}, et al. "${publications.title}"
                            ${publications.source}.
                        </i>`
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



        })
})
