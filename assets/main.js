    var day_mills = 24 * 60 * 60 * 1000;

    var count_day_tom, month, date, id, i, day, today_id = "";
    var today = "";
    var day_list = "";
    var time_str = "";
    var service_str = "";
    var day_selected = false;
    var time_selected = false;
    var service_selected = false;
    var portfolio_init = false;
    var image_url = "";
    var portfolio_images = false;


    var promo_img_load = {
      'haircuts': [],
      'coloring': []
    };



    var img_number;

    var glink = "https://drive.google.com/uc?export=view&id=";
    var pinterest_link = "https://www.pinterest.ru/alexgunyaeva/";



    var desc_haircut = "<ol class='service-desc-list'>";
    desc_haircut += "<li>Стрижка занимает около одного часа времени в зависимости от длинны и густоты ваших волос.</li>";
    desc_haircut += "<li>В услугу входит мойка головы профессиональными средствами, стрижка и укладка феном.</li>";
    desc_haircut += "<li>Оплатить можно после оказания услуги наличными или банковским переводом по номеру телефона.</li>";
    desc_haircut += "<li>Если длина ваших волос составляет более 50 сантиметров, то к цене прибавляется 100 рублей</li>";
    desc_haircut += "</ol>"

    var desc_coloring = "<ol class='service-desc-list'>";
    desc_coloring += "<li>Окрашивание занимает примерно 5-6 часов в зависимости от длины и густоты волос.</li>";
    desc_coloring += "<li>В услугу входит также тонирование волос и укладка.</li>";
    desc_coloring += "</ol>";



    const firebaseConfig = {
        apiKey: "AIzaSyC5Ecip6uMigV9Af2J9MC7bJR4SAZ5EDdg",
        authDomain: "katu-group-us-32dfa.firebaseapp.com",
        databaseURL: "https://katu-group-us-32dfa-default-rtdb.firebaseio.com",
        projectId: "katu-group-us-32dfa",
        storageBucket: "katu-group-us-32dfa.appspot.com",
        messagingSenderId: "763552046460",
        appId: "1:763552046460:web:216b3722b8e77582a4d8f9"
    };
    firebase.initializeApp(firebaseConfig);



    //стартуем с загрузки первой стрижки
    document.getElementById("haircut_menu").classList.add("visible");
    service_load(document.getElementById("haircut_0"));



    //построить календарь записи
    var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    if (document.documentElement.scrollWidth <= 1200) months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    today = new Date();

    if (today.getDay() != 0) count_day_tom = today.getDay() - 1;
    else count_day_tom = 6;

    month = today.getMonth() + 1;
    date = ('0' + today.getDate()).slice(-2);
    today_id = date + "." + month + "." + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes();

    for (i = 0; i < count_day_tom; i++) {
        if (i == 0) {
            day = new Date();
            day = new Date(day.getTime() - count_day_tom * day_mills);
        } else day = new Date(day.getTime() + day_mills);

        day_list += "<div class='last-day'>" + day.getDate() + " " + months[day.getMonth()] + "</div>"
    }

    day_list += "<div class='today'>" + today.getDate() + " " + months[today.getMonth()] + "</div>";

    for (i = 0; i < 14; i++) {
        if (i == 0) day = new Date(today.getTime() + day_mills);
        else day = new Date(day.getTime() + day_mills);

        month = ("0" + (day.getMonth() + 1)).slice(-2);
        date = ('0' + day.getDate()).slice(-2);

        id = today.getFullYear() + "-" + month + "-" + date;

        day_list += "<div class='select-day' id='" + id + "' onclick = select_day(this);>" + day.getDate() + " " + months[day.getMonth()] + "</div>"
    }

    //document.getElementsByClassName("day-calendar")[0].innerHTML = day_list;
    document.getElementById("today_year").innerHTML = today.getFullYear();




    //build and select time
    // если без класса select-item, значит уже занято
    time_arr = ['10:00', '11:00', '11:30', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    for (i = 0; i < time_arr.length; i++) {
        if (i == 3 || i == 6 || i == 9) time_str += "</div>";
        if (i == 0 || i == 3 || i == 6 || i == 9) time_str += "<div class='time-column'>";
        time_str += "<div class='select-item' onclick = select_time(this);>" + time_arr[i] + "</div>";
    }
    // document.getElementsByClassName("time-grid")[0].innerHTML = time_str;


    //прорисовка управление кнопками услуг
    service_arr = ['Стрижка', 'Окрашивание', 'Стрижка + окрашивание'];

    for (i = 0; i < service_arr.length; i++) {
        service_str += "<div class='service-item' id='booking_service_" + i + "' onclick='select_service(this);'>" + service_arr[i] + "</div>";
    }
    //document.getElementsByClassName("service-grid")[0].innerHTML = service_str;



    var app = new Vue({
        el: '#vue_container',
        data: {
            name: "",
            name2: "",
            price: "",
            description: "",
            image_links: "",
            image_desc: "",
            portfolio_links: "",
            gallery_link: "",
            showModal: false,
            showImage: false,
            latest_work_image: "",
            latest_work_desc: "",
            service_desc: ""

        },
        mounted() {
            //загрузить фото последней работы на главную
            count_images = 4;
            
            random_images = Math.floor(Math.random() * (count_images - 1) + 1);
            this.latest_work_image = "./assets/img/main_pages_img/"+random_images+".jpg";
            this.latest_work_desc = "Ещё";
        }
    });


    Vue.component("modal", {
        template: "#modal-template",
        day_list: day_list,
        time_str: time_str,
        service_str: service_str
    });

    Vue.component("modal2", {
        template: "#modal-template-image",
        image_url: ""
    });



    //оптимизация блока пинтереста  
    function pinterest_optimize(el_id) {
                
        if (document.getElementById(el_id).children[0].children.length > 1) {
            document.getElementById(el_id).children[0].style.width = "100%";
            document.getElementById(el_id).children[0].style.maxWidth = "100%";
            document.getElementById(el_id).children[0].style.border = "none";
            document.getElementById(el_id).children[0].children[0].remove();
            document.getElementById(el_id).children[0].children[1].remove();
            document.getElementById(el_id).children[0].children[0].style.height = "100%";
            document.getElementById(el_id).children[0].children[0].style.padding = "0px";
            document.getElementById(el_id).children[0].style.cursor = "default"

            document.getElementById(el_id).children[0].children[0].children[0].setAttribute("data-pin-href", "");

            for (i = 0; i < document.getElementById(el_id).children[0].children[0].children[0].children.length; i++) {
                el = document.getElementById(el_id).children[0].children[0].children[0].children[i];
                for (j = 0; j < el.children.length; j++) {
                    el.children[j].setAttribute("data-pin-href", "");
                }
            }
        }

    }


    function importScript(uri, el_id) {
        
        document.getElementById(el_id).style.opacity = 0;
        
        if (document.getElementById("pinterest_script").children[0]) {
            document.getElementById("pinterest_script").children[0].remove();
        }

        let script = document.createElement('script');
        script.src = uri;
        script.type = 'text/javascript';

        document.getElementById("pinterest_script").appendChild(script);
        
        setTimeout(function() {
            pinterest_optimize(el_id);
            document.getElementById(el_id).style.opacity = 1;
        }, 1500)
        
    }




    //подгрузить контент при нажатии кнопки типа портфолио
    function photo_load(el) {
        
        list = el.parentNode.parentNode.parentNode;
        for (i = 0; i < list.children.length; i++) {
            list.children[i].children[0].classList.remove("selected");
        }
        el.parentNode.classList.add("selected");

        id = el.id.substr(-1);
        
        if(id == 1) portfolioGet();
        else{
            if(id == 2) gallery_link = "https://ru.pinterest.com/alexgunyaeva/my-coloring";
            if(id == 3) gallery_link = "https://ru.pinterest.com/alexgunyaeva/my-haircuts";

            document.getElementById('portfolio_images').innerHTML = "<a data-pin-do='embedBoard' data-pin-lang='ru' data-pin-board-width='900' data-pin-scale-width='160' href=" + gallery_link + "></a>"
            importScript('https://assets.pinterest.com/js/pinit_main.js', "portfolio_images");
        }
        

    }

    //подгрузить контент при нажатии на меню выбора стрижек или окрашиваний
    function service_load(el) {

        service_id = el.id.substr(-1);

        document.getElementsByClassName("spinner")[0].classList.add("visible");
        document.getElementById("promo_img").classList.remove("visible")
        document.getElementById("haircut_block").classList.add("visible");

        if (el.id[0] == "h") {
            type = "haircuts";
            type_text = "Стрижка";
            type_text2 = "стрижки";
            service_desc = desc_haircut;
        } else {
            type = "colorings";
            type_text = "Окрашивание";
            type_text2 = "окрашивания";
            service_desc = desc_coloring;
        }


        var ref = firebase.database().ref(type + "/" + service_id);
        ref.on("value", function (snapshot) {

            app.service_desc = service_desc;

            app.name = type_text + " «" + snapshot.val().name + "»";
            app.name2 = type_text2 + " «" + snapshot.val().name + "»";

            app.description = snapshot.val().description;
            app.price = snapshot.val().price;

            gallery_link = pinterest_link + "" + snapshot.val().gallery_link;
            app.pinterest_block = "<a data-pin-do='embedBoard' data-pin-lang='ru' data-pin-board-width='900' data-pin-scale-width='160' href=" + gallery_link + "></a>";

            img_obj = snapshot.val().haircuts_img_links;
            
            app.image_links = glink + "" + img_obj[0].img_id;
            app.image_desc = img_obj[0].img_desc;
            img_number = 0;

            if (el) {
                list = el.parentNode.parentNode.parentNode;
                for (i = 0; i < list.children.length; i++) {
                    list.children[i].children[0].classList.remove("selected");
                }
                el.parentNode.classList.add("selected");
            }


            views_arr = promo_img_load[type];
            
            if(views_arr.includes(service_id)){
                document.getElementsByClassName("spinner")[0].classList.remove("visible");
                document.getElementById("promo_img").classList.add("visible");
            }
            else{
                document.getElementById("promo_img").onload = function () {
                    document.getElementsByClassName("spinner")[0].classList.remove("visible");
                    document.getElementById("promo_img").classList.add("visible");
                    promo_img_load[type].push(service_id);
                } 
            }

            importScript('https://assets.pinterest.com/js/pinit_main.js', 'pinterest_block');

        }, function (error) {
            console.log("Error: " + error.code);
        });
        
        

    }



    function img_next() {
        document.getElementsByClassName("spinner")[0].classList.add("visible");
        document.getElementById("promo_img").classList.remove("visible")

        img_number++;
        if (img_number >= img_obj.length) img_number = 0;

        app.image_links = glink + "" + img_obj[img_number].img_id;
        app.image_desc = img_obj[img_number].img_desc;

        document.getElementById("promo_img").onload = function () {
            document.getElementsByClassName("spinner")[0].classList.remove("visible");
            document.getElementById("promo_img").classList.add("visible");
        }
    }


    function select_day(el) {
        clean_booking();
        if (el.classList.contains('selected')) {
            document.getElementsByClassName("day-booking")[0].classList.remove("visible");
            el.classList.remove("selected");

        } else {
            document.getElementsByClassName("day-booking")[0].classList.add("visible");
            document.getElementById("title_booking").innerHTML = el.innerHTML;

            list = document.getElementsByClassName("day-calendar")[0];
            for (i = 0; i < list.children.length; i++) {
                list.children[i].classList.remove("selected");
            }
            day_selected = el.id;
            el.classList.add("selected");
        }
    }



    //показать или скрыть подробности стрижки
    function hide_desc() {
        if (document.getElementById("hide_desc_block").classList.contains('visible')) {
            document.getElementById("hide_desc_block").classList.remove("visible");

        } else {
            document.getElementById("hide_desc_block").classList.add("visible");
        }
    }


    //показать или скрыть контакты
    function hide_contacts() {
        if (document.getElementById("contacts_mobile").classList.contains('visible')) {
            document.getElementById("contacts_mobile").classList.remove("visible");

        } else {
            document.getElementById("contacts_mobile").classList.add("visible");
        }
    }





    function select_time(el) {
        if (el.classList.contains('selected')) {
            el.classList.remove("selected");
            time_selected = false;
        } else {
            list = document.getElementsByClassName("time-grid")[0].children;
            for (i = 0; i < list.length; i++) {
                for (j = 0; j < list[i].children.length; j++) {
                    list[i].children[j].classList.remove("selected");
                }
            }
            time_selected = el.innerHTML;
            el.classList.add("selected");
        }

    }









    function select_service(el) {
        if (el.classList.contains('selected')) {
            el.classList.remove("selected");
            service_selected_id = false;
        } else {
            list = document.getElementsByClassName("service-grid")[0];
            for (i = 0; i < list.children.length; i++) {
                list.children[i].classList.remove("selected");
            }
            service_selected_id = el.id;
            el.classList.add("selected");
        }
    }


    //вывести сообщение, получилось ли записаться
    function booking_alert(message_flag) {
        var msg = "";
        if (message_flag == 1) msg = "<span class='color-red'>! Ошибочка вышла <br> Видимо что-то не указали</span>";
        if (message_flag == 2) msg = "<span class='color-green'>Всё получилось! <br> Скоро мы с вами свяжемся для бронирования времени</span>";
        document.getElementsByClassName("alert-block")[0].innerHTML = msg;
    }


    //кнопка записаться
    function booking_btn() {

        const key = '4f85636c8edde801a835f98ca175c6f5';
        const token = 'da261b2b32be785c075a8c8a873dfd82a96505a8c61d63bea8491059a1c02585';
        const idBoard = "61b9c4022d3ef56f16d09839";
        const idList = "61b9c4d2be131640ebabb946";
        let idMembers = ["62167c7c21b29e1ebbb1a263"];
        const API_URL_TRELLO = 'https://api.trello.com/1/cards?key=' + key + '&token=' + token


        if (day_selected && time_selected && service_selected_id && document.getElementById("booking-name").value != '' && document.getElementById("booking-phone").value != '') {

            time_trello = (time_selected.substr(0, 2) - 3) + ":" + time_selected.substr(3, 5);
            datetime = day_selected + "T" + time_trello + ":00.000Z";

            if (service_selected_id == "booking_service_0") idLabels = "61b9c4028166f38753dd037e";
            if (service_selected_id == "booking_service_1") idLabels = "61b9c4028166f38753dd037f";
            if (service_selected_id == "booking_service_2") idLabels = "61b9c4028166f38753dd0381";


            let ApiTrello = axios.create({
                baseURL: API_URL_TRELLO,
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Accept-Language': 'ru-RU,ru;q=0.5',
                    'Content-Type': 'application/json'
                }
            })

            let data = {
                "name": document.getElementById("booking-name").value,
                "desc": document.getElementById("booking-phone").value,
                "due": datetime,
                "idBoard": idBoard,
                "idList": idList,
                "idMembers": idMembers,
                "idLabels": idLabels
            }

            new Promise((resolve, reject) => {
                ApiTrello.post('', data)
                    .then(response => {
                        this.dialogFormVisible = false
                        resolve(response)
                    })
                    .catch(error => {
                        console.log(error)
                        reject(error)
                    })
            })


            clean_booking();
            booking_alert(2);

        } else booking_alert(1);


        //запись в firebase

        //                    var messagesRef = firebase.database().ref('orders');
        //        
        //                    var newMessageRef = messagesRef.push();
        //                    newMessageRef.set({
        //                        name: document.getElementById("booking-name").value,
        //                        phone: document.getElementById("booking-phone").value,
        //                        service: service_selected,
        //                        datetime: day_selected + "T" + time_selected + ":00+03:00",
        //                        boking: today_id
        //                    });

    };




    //очистить всё, чтобы ло выбрано
    function clean_booking() {
        var day_selected = false;
        var time_selected = false;
        var service_selected = false;

        //снятие выделителя в ремени
        list = document.getElementsByClassName("time-grid")[0].children;
        for (i = 0; i < list.length; i++) {
            for (j = 0; j < list[i].children.length; j++) {
                list[i].children[j].classList.remove("selected");
            }
        }

        //снятие выделитиля услуги
        list = document.getElementsByClassName("service-grid")[0];
        for (i = 0; i < list.children.length; i++) {
            list.children[i].classList.remove("selected");
        }

        document.getElementById("booking-name").value = "";
        document.getElementById("booking-phone").value = "";
    }




    //нажатие кнопки Стрижки
    function haircuts_load(el) {
        document.getElementById("portfolio_block").classList.remove("visible");
        document.getElementById("haircut_block").classList.add("visible");

        document.getElementById("coloring_menu").classList.remove("visible");
        document.getElementById("haircut_menu").classList.add("visible");

        list = document.getElementById("haircut_menu").children[0].children[0].children[0];
        for (i = 0; i < list.children.length; i++) {
            list.children[i].children[0].classList.remove("selected");
        }
        list.children[0].children[0].classList.add("selected");
        
        
        document.getElementById("service_nav").insertBefore(el, el.parentNode.children[0]);
        service_load(el);

    }

    //нажатие кнопки Окрашивания
    function coloring_load(el) {
        document.getElementById("portfolio_block").classList.remove("visible");
        document.getElementById("haircut_block").classList.add("visible");

        document.getElementById("haircut_menu").classList.remove("visible");
        document.getElementById("coloring_menu").classList.add("visible");

        list = document.getElementById("coloring_menu").children[0].children[0].children[0];
        for (i = 0; i < list.children.length; i++) {
            list.children[i].children[0].classList.remove("selected");
        }
        list.children[0].children[0].classList.add("selected");
        
        
        document.getElementById("service_nav").insertBefore(el, el.parentNode.children[0]);
        service_load(el);
        
    }

    //нажатие кнопки фото работ
    function portfolio_load() {
        document.getElementById("haircut_block").classList.remove("visible");
        document.getElementById("portfolio_block").classList.add("visible");

        el = document.getElementById("nav_portfolio_item");
        document.getElementById("service_nav").insertBefore(el, el.parentNode.children[0]);

        coloring_tab = document.getElementById("portfolio_2");
        photo_load(coloring_tab);
        
        
    }


    //маска для телефона
    //    window.addEventListener("DOMContentLoaded", function() {
    //        function setCursorPosition(pos, elem) {
    //            elem.focus();
    //            if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
    //            else if (elem.createTextRange) {
    //                var range = elem.createTextRange();
    //                range.collapse(true);
    //                range.moveEnd("character", pos);
    //                range.moveStart("character", pos);
    //                range.select()
    //            }
    //        }
    //
    //        function mask(event) {
    //            var matrix = "+7 (___) ___ ____",
    //                i = 0,
    //                def = matrix.replace(/\D/g, ""),
    //                val = this.value.replace(/\D/g, "");
    //            if (def.length >= val.length) val = def;
    //            this.value = matrix.replace(/./g, function(a) {
    //                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
    //            });
    //            if (event.type == "blur") {
    //                if (this.value.length == 2) this.value = ""
    //            } else setCursorPosition(this.value.length, this)
    //        };
    //        var input = document.querySelector("#booking-phone");
    //        input.addEventListener("input", mask, false);
    //        input.addEventListener("focus", mask, false);
    //        input.addEventListener("blur", mask, false);
    //    })
