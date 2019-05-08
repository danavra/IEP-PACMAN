var users = [{'a':{'password':'a', 'first_name':'a', 'last_name':'a', 'email':'a@a.com', 'birthday':'01-01-1990'}}];
var displayed_div = ['welcome', 'welcome'];
var logged_in_user = undefined;
// Get the modal
var modal = document.getElementById('aboutModal');
// When the user clicks anywhere outside of the modal or esc, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal_display(false);
    }
}
window.addEventListener("keydown", function (e) {
    if (modal.style.display == "block" && e.code == "Escape"){
        modal_display(false);
    }
}, false);

register_set_selections();

function modal_display(display){
    if (display){
        modal.style.display = "block";
    }
    else {
        modal.style.display = "none";
    }
}

function register_set_selections(){
    var days_select = document.getElementById("date_day");
    var month_select = document.getElementById("date_month");
    var year_select = document.getElementById("date_year");

    //set Days 1-31. Date validation will be at register request
    for (var day=1; day<=31; day++){
        var option = document.createElement("option");
        option.text = day>9 ? ""+day  : "0"+day;
        option.value = option.text;
        days_select.add(option);
    }

    //set Months 1-12
    for (var month=1; month<=12; month++){
        var option = document.createElement("option");
        option.text = month<10 ? "0"+month  : ""+month;
        option.value = option.text;
        month_select.add(option);
    }

    //set years 1900-2019
    for (var year=1900; year<2020; year++){
        var option = document.createElement("option");
        option.text = ""+year;
        option.value = option.text;
        year_select.add(option);
    }
}

function switch_display(id_to_display){
    if(logged_in_user !== undefined && (id_to_display=='register' || id_to_display=='login')){
        id_to_display = 'alreadyLogged';
    }
    if (displayed_div[1] == "pacmangame"){
        //TODO:
        // End Game
        terminateGame();
        // Switch
    }
    document.getElementById(displayed_div[1]).style.display = "none";
    document.getElementById(id_to_display).style.display = "block";
    if (displayed_div[1] != id_to_display){
        if (displayed_div[0] != displayed_div[1]){
            displayed_div[0] = displayed_div[1];
        }
        displayed_div[1] = id_to_display;
    }
}

function cancel_registration(){
    switch_display(displayed_div[0]);
}

function already_logged() {
    document.getElementById("logged_already").innerHTML = "You're already logged in as " + logged_in_user;
    switch_display("alreadyLogged");
}

function login(){
    if (logged_in_user === undefined){
        var username = $('#login_username').val();
        var psw = $('#login_password').val();
        try {
            users.forEach(function (dict_user){
                if(dict_user[username] !== undefined && dict_user[username]['password'] == psw){
                    throw true;
                }
            });
        }
        catch (bool) {
            document.getElementById("nav-login").innerHTML = "Logout";
            document.getElementById("nav-login").href = "javascript: logout()";
            document.getElementById("nav-register").href = "javascript: already_logged()";
            document.getElementById("hello_user").innerHTML = "Hi " + username;
            document.getElementById("logged_username").style.display = "block";
            document.getElementById("pls-login").style.display = "none";
            switch_display('welcome');
            logged_in_user = username;
            document.getElementById("nav-play").style.display = "block";
            document.getElementById("nav-play").href = "javascript: playGame()";
            document.getElementById("wlc-login").style.display = "none";
            document.getElementById("wlc-register").style.display = "none";
            document.getElementById("wlc-play").style.display = "block";
            return;
        }
        alert("Username or Password is not valid")
    }
}

function playGame(){
    switch_display("pacmangame");
    openSettings();
}

function logout() {
    logged_in_user = undefined;
    document.getElementById("nav-login").innerHTML = "Login";
    document.getElementById("nav-login").href = "javascript: switch_display('login')";
    document.getElementById("nav-register").href = "javascript: switch_display('register')";
    document.getElementById("logged_username").style.display = "none";
    document.getElementById("nav-play").style.display = "none";
    document.getElementById("nav-play").href = "";
    document.getElementById("pls-login").style.display = "block";
    document.getElementById("wlc-login").style.display = "block";
    document.getElementById("wlc-register").style.display = "block";
    document.getElementById("wlc-play").style.display = "none";
    switch_display("welcome");
}

function contains_letters(s){
    let ans = /[a-zA-Z]/.test(s);
    return ans;
}

function contains_numbers(s) {
    let ans = /\d/.test(s);
    return ans;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateDate(day, month, year){
    if (month == 2){
        if (2016%4 == year%4){
            return day < 30;
        }
        return day < 29;

    }
    if (month == 4 || month == 6 || month == 9 || month == 11){
        return day < 31;
    }
    return day<32;
}

function register(){
    if (logged_in_user === undefined){
        let fields = {};
        fields['username'] = $("#register_username").val();
        fields['password'] = $("#register_password").val();
        fields['fname'] = $("#register_fname").val();
        fields['lname'] = $("#register_lname").val();
        fields['email'] = $("#register_email").val();
        fields['date_day'] = $("#date_day option:selected").val();
        fields['date_month'] = $("#date_month option:selected").val();
        fields['date_year'] = $("#date_year option:selected").val();
        let keys = Object.keys(fields);
        keys.forEach(function (key) {
            if(fields[key] == "" || fields[key] === undefined){
                alert(key + " is undefined")
                return;
            }
        });
        if (fields['password'].length < 8){
            alert("Password is too short!");
            return;
        }
        if(!contains_letters(fields['password']) || !contains_numbers(fields['password'])){
            alert("Password must contain characters and numbers");
            return;
        }
        if(contains_numbers(fields['fname']) || !contains_letters(fields['fname'])){
            alert("First name cannot contain numbers");
            return;
        }
        if(contains_numbers(fields['lname']) || !contains_letters(fields['lname'])){
            alert("Last name cannot contain numbers");
            return;
        }
        if(!validateEmail(fields['email'])){
            alert("Email field is not valid!")
            return;
        }
        if(!validateDate(fields['date_day'], fields['date_month'], fields['date_year'])){
            alert("Date of Birth is Illegal");
            return;
        }
        let isExists = false;
        users.forEach(function (user_dict) {
            let usr = user_dict[fields['username']];
            if (usr !== undefined){
                isExists = true;
            }
        });
        if (isExists){
            alert("Username belongs to someone else :(");
            return;
        }
        let newUser = {};
        let bday = fields['date_day']+'-'+fields['date_month']+'-'+fields['date_year'];
        newUser[fields['username']] = {'password': fields['password'], 'first_name': fields['fname'], 'last_name':fields['lname'], 'email':fields['email'], 'birthday':bday};
        users.push(newUser);
        document.getElementById("nav-login").innerHTML = "Logout";
        document.getElementById("nav-login").href = "javascript: logout()";
        document.getElementById("nav-register").href = "javascript; already_logged()";
        document.getElementById("hello_user").innerHTML = "Hi " + fields['username'];
        document.getElementById("logged_username").style.display = "block";
        document.getElementById("nav-play").style.display = "block";
        document.getElementById("nav-play").href = "javascript: playGame()";
        document.getElementById("pls-login").style.display = "none";
        document.getElementById("wlc-login").style.display = "none";
        document.getElementById("wlc-register").style.display = "none";
        document.getElementById("wlc-play").style.display = "block";
        logged_in_user = fields['username'];
        switch_display('welcome');
    }
    else {
        already_logged();
    }
}

function createUser(username, password, fname, lname, email, day, month, year) {
    let ans = {};
    let birthday = day + '-'+month+'-'+year;
    ans[username] = {'password': password, 'first_name':fname, 'last_name':lname, 'email':email, 'birthday':birthday};
    return ans;
}

