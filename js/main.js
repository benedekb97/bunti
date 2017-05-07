(function(){
function Player() {
    var points = 0;
    var total_points = 0;
    this.getPoints = function () {
        return points;
    }
    this.clickPoint = function () {
        var perk_multiplier = 1;
        for(var i = 0; i<perks.length; i++){
            if(perks[i].isBought() == true){
                perk_multiplier *= perks[i].getMultiplier();
            }
        }
        points = points + perk_multiplier;
        total_points = total_points + perk_multiplier;
    }
    this.takePoints = function (points_to_take) {
        points = points - points_to_take;
    }
    this.addPoints = function (points_to_add) {
        points = points + points_to_add;
        total_points = total_points + points_to_add;
    }
    this.loadPoints = function (ld_points) {
        points = parseInt(ld_points);
        return true;
    }
    this.getTotalPoints = function () {
        return total_points;
    }
    this.loadTotalPoints = function (ld_total_points) {
        total_points = parseInt(ld_total_points);
        return true;
    }

}

function Auto(new_cost, new_multiplier, new_name, new_pps, new_buy_id, new_icon_img, new_gif_id) {
    var cost = new_cost;
    var multiplier = new_multiplier;
    var player_has = 0;
    var name = new_name;
    var pps = new_pps;
    var buy_id = new_buy_id;
    var icon_img = new_icon_img;
    var gif_id = new_gif_id;

    this.buy = function () {
        if (default_player.getPoints() >= cost) {
            player_has++;
            default_player.takePoints(cost);
            cost = cost * (1 + multiplier);
            return true;
        } else {
            return false;
        }
    }

    this.loadPlayerHas = function (ld_player_has) {
        player_has = parseInt(ld_player_has);
        return true;
    }
    this.loadCost = function (ld_cost) {
        cost = parseFloat(ld_cost);
        return true;
    }

    this.getName = function () {
        return name;
    }
    this.getCost = function () {
        return cost;
    }
    this.getCount = function () {
        return player_has;
    }
    this.getPps = function () {
        return pps;
    }
    this.getBuyId = function () {
        return buy_id;
    }
    this.getIconImg = function () {
        return icon_img;
    }
    this.getGifId = function () {
        return gif_id;
    }
    this.getProduction = function () {
        return pps * player_has;
    }

    this.canBuy = function () {
        if (default_player.getPoints() >= cost) {
            return true;
        } else {
            return false;
        }
    }
}

function Menu(new_name, new_selected, new_html_id) {
    var name = new_name;
    var selected = new_selected;
    var html_id = new_html_id;

    this.getName = function () {
        return name;
    }
    this.isSelected = function () {
        return selected;
    }
    this.getHtmlId = function () {
        return html_id;
    }
    this.select = function () {
        if (this.isSelected() == false) {
            selected = true;
        }
    }
    this.deselect = function () {
        if (this.isSelected() == true) {
            selected = false;
        }
    }
}

function Perk(new_unlocks_at, new_name, new_cost, new_multiplier, new_html_id) {
    var unlocks_at = new_unlocks_at;
    var name = new_name;
    var cost = new_cost;
    var multiplier = new_multiplier;
    var player_has = false;
    var html_id = new_html_id;
    this.getUnlocksAt = function () {
        return unlocks_at;
    }
    this.getHtmlId = function () {
        return html_id;
    }
    this.getName = function () {
        return name;
    }
    this.getCost = function () {
        return cost;
    }
    this.getMultiplier = function () {
        return multiplier;
    }
    this.isBought = function () {
        return player_has;
    }
    this.canBuy = function () {
        if (default_player.getTotalPoints() >= this.getUnlocksAt() && default_player.getPoints() >= this.getCost()) {
            return true;
        } else {
            return false;
        }
    }
    this.isUnlocked = function () {
        if(default_player.getTotalPoints() >= this.getUnlocksAt()){
            return true;
        }else{
            return false;
        }
    }
    this.buy = function () {
        if (this.canBuy() == true) {
            player_has = true;
            default_player.takePoints(this.getCost());
            return true;
        } else {
            return false;
        }
    }
    this.loadBought = function(is_bought){
        player_has = is_bought;
    }
}

//Save functions
function saveData() {
    var s_data = Math.round(default_player.getPoints()) + "+" + Math.round(default_player.getTotalPoints());
    for (var i = 0; i < autos.length; i++) {
        s_data += "+" + autos[i].getCount() + "+" + autos[i].getCost();
    }
    for (var i = 0; i < perks.length; i++){
        s_data += "+" + perks[i].isBought();
    }
    // player_points+foodcount+foodcost+gondnok+weed+toilet
    alert(btoa(s_data));
}
function saveDataToCookie() {
    var s_data = Math.round(default_player.getPoints()) + "+" + Math.round(default_player.getTotalPoints());
    for (var i = 0; i < autos.length; i++) {
        s_data += "+" + autos[i].getCount() + "+" + autos[i].getCost();
    }
    for (var i = 0; i < perks.length; i++){
        s_data += "+" + perks[i].isBought();
    }
    document.cookie = "data=" + btoa(s_data);
    alert("Sikeres!");
}

//Load functions
function loadFromCookie() {
    var ld_cookie = document.cookie;
    var ld_data = "";
    var equals = false;
    for (var i = 0; i < ld_cookie.length; i++) {
        if (ld_cookie[i] == ";") {
            break;
        }
        if (equals) {
            ld_data += ld_cookie[i];
        }
        if (ld_cookie[i] == "=") {
            equals = true;
        }
    }
    if (ld_data == "") {
        return;
    }

    ld_data = atob(ld_data);
    var ld_res = ld_data.split('+');
    default_player.loadPoints(ld_res[0]);
    default_player.loadTotalPoints(ld_res[1]);
    for (var i = 0; i < autos.length; i++) {
        autos[i].loadPlayerHas(ld_res[i * 2 + 2]);
        autos[i].loadCost(ld_res[i * 2 + 3]);
    }
    for (var i = 0; i < perks.length; i++){
        perks[i].loadBought(ld_res[i + 2 + autos.length*2] == "true");
    }
    alert("Sikeres (text by Koza)");
}
function loadFromInput(b64str) {
    var ld_data = atob(b64str);
    var ld_res = ld_data.split('+');
    default_player.loadPoints(ld_res[0]);
    default_player.loadTotalPoints(ld_res[1]);
    for (var i = 0; i < autos.length; i++) {
        autos[i].loadPlayerHas(ld_res[i * 2 + 2]);
        autos[i].loadCost(ld_res[i * 2 + 3]);
    }
    for (var i = 0; i < perks.length; i++){
        perks[i].loadBought(ld_res[i + 2 + autos.length*2] == "true");
    }
}

//Object array declaration
var autos = [];
var menus = [];
var perks = [];

//Player object declaration
var default_player = new Player();

//Loads data to object arrays
function loadData() {

    //Object data
    var object_data = [
        [15, 120, 1500, 10000, 120000],
        [0.2, 0.2, 0.22, 0.24, 0.26],
        ["Narancs", "Gondnok", "Füvezés", "Jegyzet égetés", "Nevelőtanár"],
        [0.2, 1, 10, 150, 2000],
        ["buy_bad_food", "buy_gondnok", "buy_weed", "buy_toilet", "buy_teacher"],
        ["images/naranca.png", "images/gondnok.png", "images/weed-hi.png", "images/jegyzet.png", "images/filler.png"],
        ["food_gif", "gondnok_gif", "weed_gif", "toilet_gif", "teacher_gif"],
    ];
    var menu_data = [
        ["Szarok", true, "autos"],
        ["Perkek", false, "perks"]
    ];
    var perk_data = [
        [500, "Törött kártya", 750, 4, "broken"],
        [2000, "Lejárt éjszakai kártya", 4000, 4, "night"],
        [10000, "Letiltott kártya", 15000, 5, "blocked"],
        [25000, "Talált kártya", 50000, 10, "found"],
        [100000, "Kakas dolgozói", 150000, 10, "kakas"],
        [500000, "Jakab Zoltán", 750000, 20, "jakab"]
    ];

    //Loads data to arrays
    for (var i = 0; i < object_data[0].length; i++) {
        autos[i] = new Auto(object_data[0][i], object_data[1][i], object_data[2][i], object_data[3][i], object_data[4][i], object_data[5][i], object_data[6][i]);
    }
    for (var i = 0; i < menu_data.length; i++) {
        menus[i] = new Menu(menu_data[i][0], menu_data[i][1], menu_data[i][2]);
    }
    for (var i = 0; i < perk_data.length; i++) {
        perks[i] = new Perk(perk_data[i][0], perk_data[i][1], perk_data[i][2], perk_data[i][3], perk_data[i][4]);
    }
}


$(document).ready(function () {
    // Loads all data to object arrays
    loadData();

    //Loads menu text into HTML
    for (var i = 0; i < menus.length; i++) {
        $('#' + menus[i].getHtmlId() + "_button").html(menus[i].getName());
    }

    //Load and set buttons click chckers
    {
        $('#ld_button').click(function () {
            if ($('#ld_data').val() != "") {
                loadFromInput($('#ld_data').val());
            }
        });
        $('#sv_button').click(function () {
            saveData();
        })

        $('#ld_cookie').click(function () {
            loadFromCookie();
        })
        $('#sv_cookie').click(function () {
            saveDataToCookie();
        })
    }

    // Card click checker
    {
        $('#card').click(function () {
            default_player.clickPoint();
        });
    }

    //Buy button click checkers
    {
        $('#buy_bad_food').click(function () {
            autos[0].buy();
        });

        $('#buy_gondnok').click(function () {
            autos[1].buy();
        });

        $('#buy_weed').click(function () {
            autos[2].buy();
        });

        $('#buy_toilet').click(function () {
            autos[3].buy();
        });

        $('#buy_teacher').click(function () {
            autos[4].buy();
        });

        $('#broken').click(function(){
            if(perks[0].isBought()==false){
                perks[0].buy();
            }
        })

        $('#night').click(function(){
            if(perks[1].isBought()==false){
                perks[1].buy();
            }
        })

        $('#blocked').click(function(){
            if(perks[2].isBought()==false){
                perks[2].buy();
            }
        })

        $('#found').click(function(){
            if(perks[3].isBought()==false){
                perks[3].buy();
            }
        })

        $('#kakas').click(function(){
            if(perks[4].isBought()==false){
                perks[4].buy();
            }
        })

        $('#jakab').click(function(){
            if(perks[5].isBought()==false){
                perks[5].buy();
            }
        })
    }

    //Menu selector checkers
    {
        $('#autos_button').click(function () {
            if (menus[0].isSelected() == false) {
                menus[1].deselect();
                menus[0].select();
            }
        });

        $('#perks_button').click(function () {
            if (menus[1].isSelected() == false) {
                menus[0].deselect();
                menus[1].select();
            }
        });
    }

    setInterval(function () {
        var points_to_add = 0;

        for (var i = 0; i < autos.length; i++) {
            var selector = "#" + autos[i].getBuyId();
            if (autos[i].canBuy() == true) {
                $(selector).css("background", "rgba(0,0,0,0.3)");
                $(selector).css("color", "rgba(0,0,0,1)");
            } else {
                $(selector).css("background", "rgba(0,0,0,0.1)");
                $(selector).css("color", "rgba(0,0,0,0.5)");
            }
            $(selector).html("<img src=" + autos[i].getIconImg() + " height='20' width='20'> " + autos[i].getName() + " - " + Math.round(autos[i].getCost()));
            if (autos[i].getCount() != 0) {
                $("#" + autos[i].getGifId()).css('display', 'block');
            } else {
                $("#" + autos[i].getGifId()).css('display', 'none');
            }
            points_to_add = points_to_add + autos[i].getProduction();
            $(selector + "_count").html(autos[i].getCount());
        }
        for (var i = 0; i < perks.length; i++){
            var selector = "#" + perks[i].getHtmlId();
            if(perks[i].isBought() == true){
                $(selector).css("background","rgba(0,0,0,0.7");
                $(selector).css("color","rgba(255,255,255,1");
            }else if(perks[i].canBuy() == true){
                $(selector).css("background","rgba(0,0,0,0.3");
                $(selector).css("color","rgba(0,0,0,1");
            }else{
                $(selector).css("background", "rgba(0,0,0,0.1)");
                $(selector).css("color", "rgba(0,0,0,0.5)");
            }
        }
        for (var i = 0; i < perks.length; i++){
            if(perks[i].canBuy() == true){
                $('#' + perks[i].getHtmlId()).html(perks[i].getName() + " - " + perks[i].getCost());
            }else if(perks[i].isUnlocked() == true){
                $('#' + perks[i].getHtmlId()).html(perks[i].getName() + " - ???");
            }else{
                $('#' + perks[i].getHtmlId()).html("??? - ???");
            }
        }
        for (var i = 0; i < menus.length; i++) {
            if (menus[i].isSelected() == true) {
                $('#' + menus[i].getHtmlId() + "_button").addClass("selected");
                $('#' + menus[i].getHtmlId()).css("display", "block");
            } else {
                $('#' + menus[i].getHtmlId() + "_button").removeClass("selected");
                $('#' + menus[i].getHtmlId()).css("display", "none");
            }
        }

        $('#points').html(Math.round(default_player.getPoints()));
        $('#persecond').html(Math.round(points_to_add));

        default_player.addPoints(points_to_add / 30);
    }, 10);
});
}).call();
