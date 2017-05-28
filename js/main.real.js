(function(){
    function Player() {
        var points = 0;
        var total_points = 0;

        this.getPoints = function () {
            return points;
        };

        this.clickPoint = function () {
            var perk_multiplier = 1;
            for(var i = 0; i<perks.length; i++){
                if(perks[i].isBought()){
                    perk_multiplier *= perks[i].getMultiplier();
                }
            }
            points = points + perk_multiplier;
            total_points = total_points + perk_multiplier;
        };

        this.takePoints = function (points_to_take) {
            points = points - points_to_take;
        };
        this.addPoints = function (points_to_add) {
            points = points + points_to_add;
            total_points = total_points + points_to_add;
        };

        this.loadPoints = function (ld_points) {
            points = parseInt(ld_points);
            return true;
        };

        this.getTotalPoints = function () {
            return total_points;
        };
        this.loadTotalPoints = function (ld_total_points) {
            total_points = parseInt(ld_total_points);
            return true;
        }

    }

    function Auto(new_cost, new_multiplier, new_name, new_pps, new_buy_id, new_icon_img, new_gif_id, new_unlocks_at) {
        var cost = new_cost;
        var multiplier = new_multiplier;
        var player_has = 0;
        var name = new_name;
        var pps = new_pps;
        var buy_id = new_buy_id;
        var icon_img = new_icon_img;
        var gif_id = new_gif_id;
        var unlocks_at = new_unlocks_at;

        this.buy = function () {
            if (default_player.getPoints() >= cost) {
                player_has++;
                default_player.takePoints(cost);
                cost = cost * (1 + multiplier);
                return true;
            } else {
                return false;
            }
        };

        this.loadPlayerHas = function (ld_player_has) {
            player_has = parseInt(ld_player_has);
            return true;
        };
        this.loadCost = function (ld_cost) {
            cost = parseFloat(ld_cost);
            return true;
        };

        this.getName = function () {
            return name;
        };
        this.getCost = function () {
            return cost;
        };
        this.getCount = function () {
            return player_has;
        };
        this.getPps = function () {
            return pps;
        };
        this.getBuyId = function () {
            return buy_id;
        };
        this.getIconImg = function () {
            return icon_img;
        };
        this.getGifId = function () {
            return gif_id;
        };
        this.getProduction = function () {
            return this.getPps() * this.getPlayerHas();
        };
        this.getUnlocksAt = function() {
            return unlocks_at;
        };
        this.getPlayerHas = function () {
            return player_has;
        };

        this.canBuy = function () {
            return default_player.getPoints() >= cost;
        };

        this.setPps = function (new_pps) {
            pps = new_pps;
        };
        this.setName = function (new_name) {
            name = new_name;
        };
    }

    function Menu(new_name, new_selected, new_html_id) {
        var name = new_name;
        var selected = new_selected;
        var html_id = new_html_id;

        this.getName = function () {
            return name;
        };
        this.isSelected = function () {
            return selected;
        };
        this.getHtmlId = function () {
            return html_id;
        };

        this.select = function () {
            if (!this.isSelected()) {
                selected = true;
            }
        };
        this.deselect = function () {
            if (this.isSelected()) {
                selected = false;
            }
        };
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
        };
        this.getHtmlId = function () {
            return html_id;
        };
        this.getName = function () {
            return name;
        };
        this.getCost = function () {
            return cost;
        };
        this.getMultiplier = function () {
            return multiplier;
        };
        this.isBought = function () {
            return player_has;
        };

        this.canBuy = function () {
            return default_player.getTotalPoints() >= this.getUnlocksAt() && default_player.getPoints() >= this.getCost();
        };

        this.isUnlocked = function () {
            return default_player.getTotalPoints() >= this.getUnlocksAt();
        };

        this.buy = function () {
            if (this.canBuy()) {
                player_has = true;
                default_player.takePoints(this.getCost());
                return true;
            } else {
                return false;
            }
        };

        this.loadBought = function(is_bought){
            player_has = is_bought;
        };
    }

    function Upgrade(new_name, new_unlocks_at, new_cost, new_html_id, new_upgrades_id, new_pps, new_auto_name){
        var name = new_name;
        var unlocks_at = new_unlocks_at;
        var cost = new_cost;
        var html_id = new_html_id;
        var is_bought = false;
        var upgrades_id = new_upgrades_id;
        var upgrades_pps = new_pps;
        var upgrades_name = new_auto_name;

        this.getName = function(){
            return name;
        };
        this.getUnlocksAt = function(){
            return unlocks_at;
        };
        this.getCost = function(){
            return cost;
        };
        this.getHtmlId = function(){
            return html_id;
        };
        this.isBought = function(){
            return is_bought;
        };

        this.canBuy = function(){
            return default_player.getTotalPoints() >= this.getUnlocksAt() && default_player.getPoints() >= this.getCost();
        };

        this.isUnlocked = function(){
            return default_player.getTotalPoints() >= this.getUnlocksAt();
        };

        this.buy = function(){
            if (this.canBuy()) {
                is_bought = true;
                default_player.takePoints(this.getCost());
                autos[upgrades_id].setPps(upgrades_pps);
                autos[upgrades_id].setName(upgrades_name);
                return true;
            } else {
                return false;
            }
        };

        this.loadBought = function(new_is_bought){
            is_bought = new_is_bought;
        };
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
        for (var i = 0; i < upgrades.length; i++){
            s_data += "+" + upgrades[i].isBought();
        }

        // player_points+foodcount+foodcost+gondnok+weed+toilet+perks+upgrades
        alert(btoa(s_data.rot13()).rot13());
    }

    function saveDataToCookie() {
        var s_data = Math.round(default_player.getPoints()) + "+" + Math.round(default_player.getTotalPoints());
        for (var i = 0; i < autos.length; i++) {
            s_data += "+" + autos[i].getCount() + "+" + autos[i].getCost();
        }
        for (var i = 0; i < perks.length; i++){
            s_data += "+" + perks[i].isBought();
        }
        for (var i = 0; i < upgrades.length; i++){
            s_data += "+" + upgrades[i].isBought();
        }

        document.cookie = "data=" + btoa(s_data.rot13()).rot13();

        alert("Sikeres!");
    }

//Load functions
    function loadFromCookie() {
        var ld_cookie = document.cookie;
        var ld_data = "";
        var equals = false;
        for (var i = 0; i < ld_cookie.length; i++) {
            if (ld_cookie[i] === ";") {
                break;
            }
            if (equals) {
                ld_data += ld_cookie[i];
            }
            if (ld_cookie[i] === "=") {
                equals = true;
            }
        }
        if (ld_data === "") {
            return;
        }

        ld_data = atob(ld_data.rot13()).rot13();
        var ld_res = ld_data.split('+');

        default_player.loadPoints(ld_res[0]);
        default_player.loadTotalPoints(ld_res[1]);

        for (var i = 0; i < autos.length; i++) {
            autos[i].loadPlayerHas(ld_res[i * 2 + 2]);
            autos[i].loadCost(ld_res[i * 2 + 3]);
        }
        for (var i = 0; i < perks.length; i++){
            perks[i].loadBought(ld_res[i + 2 + autos.length*2] === "true");
        }
        for (var i = 0; i < upgrades.length; i++){
            upgrades[i].loadBought(ld_res[i + 2 + autos.length + upgrades.length*2] === "true");
        }
        alert("Sikeres (text by Koza)");
    }
    function loadFromInput(b64str) {
        var ld_data = atob(b64str.rot13()).rot13();
        var ld_res = ld_data.split('+');

        default_player.loadPoints(ld_res[0]);
        default_player.loadTotalPoints(ld_res[1]);

        for (var i = 0; i < autos.length; i++) {
            autos[i].loadPlayerHas(ld_res[i * 2 + 2]);
            autos[i].loadCost(ld_res[i * 2 + 3]);
        }

        for (var i = 0; i < perks.length; i++){
            perks[i].loadBought(ld_res[i + 2 + autos.length*2] === "true");
        }
    }

//Object array declaration
    var autos = [];
    var menus = [];
    var perks = [];
    var upgrades = [];

//Player object declaration
    var default_player = new Player();

//Loads data to object arrays
    function loadData() {

        //Object data
        var object_data = [
            [15, 120, 1500, 10000, 120000, 1500000, 12500000], // initial cost
            [0.2, 0.2, 0.22, 0.24, 0.26, 0.28, 0.3], // cost increase factor
            ["Narancs", "Gondnok", "Füvezés", "Jegyzet égetés", "Nevelőtanár", "Liftbe hányás", "Kanapé felgyújtása"], // name
            [0.2, 1, 10, 150, 2000, 12500, 500000], // yield
            ["buy_bad_food", "buy_gondnok", "buy_weed", "buy_toilet", "buy_teacher" ,"buy_vomit", "buy_trash"], // buy div id
            ["images/naranca.png", "images/gondnok.png", "images/weed-hi.png", "images/jegyzet.png", "images/filler.png" ,"images/filler.png", "images/filler.png"], // icon path
            ["food_gif", "gondnok_gif", "weed_gif", "toilet_gif", "teacher_gif", "vomit_gif", "trash.png"], // gif tag id
            [0, 100, 1000, 6000, 50000, 1000001, 11875000] // unlocks at total points
        ];

        var menu_data = [
            ["Szarok", true, "autos"],
            ["Perkek", false, "perks"],
            ["Fejlesztések", false, "upgrades"]
        ];

        var perk_data = [
            // unlocks at total points, name, cost, multiplier, id
            [500, "Törött kártya", 750, 4, "broken"],
            [2000, "Lejárt éjszakai kártya", 4000, 4, "night"],
            [10000, "Letiltott kártya", 15000, 5, "blocked"],
            [25000, "Talált kártya", 50000, 10, "found"],
            [100000, "Kakas dolgozói", 150000, 10, "kakas"],
            [500000, "Jakab Zoltán", 750000, 20, "jakab"]
        ];

        var upgrades_data = [
            // name, unlocks_at, cost, html tag id, auto id, new pps for auto
            ["Narancs helyett pomelo", 100, 240, "pomelo", 0, 0.5, "Pomelo"],
            ["Pomelo helyett torta", 1000, 1200, "cake", 0, 2, "Torta"],
            ["Gondnok helyett Cseszter", 5000, 6000, "magdi", 1, 5, "Cseszter"],
            ["Cseszter helyett takkernéni", 10000, 12000, "janitor", 1, 10, "Takkernéni"],
            ["Füvezés helyett pipázás", 10000, 20000, "pipa", 2, 25, "Szobában pipázás"],
            ["Pipázás helyett fallyukasztás", 10000, 30000, "lyuk", 2, 50, "Fallyukasztás"],
            ["Jegyzet helyett könyvek", 10000, 40000, "konyv", 3, 300, "Könyvégetés"],
            ["Nevtanár helyett KB", 10000, 50000, "kb", 4, 4000, "KB felbaszása"],
            ["Lift helyett szemétledobó", 10000, 60000, "trash", 5, 25000, "Szemétledobóba szarás"],
            ["Kanapé helyett lift", 10000, 100000, "lift", 6, 1000000, "Lift felgyújtása"]
        ];

        //Loads data to arrays
        for (var i = 0; i < object_data[0].length; i++) {
            autos[i] = new Auto(object_data[0][i], object_data[1][i], object_data[2][i], object_data[3][i], object_data[4][i], object_data[5][i], object_data[6][i], object_data[7][i]);
        }
        for (var i = 0; i < menu_data.length; i++) {
            menus[i] = new Menu(menu_data[i][0], menu_data[i][1], menu_data[i][2]);
        }
        for (var i = 0; i < perk_data.length; i++) {
            perks[i] = new Perk(perk_data[i][0], perk_data[i][1], perk_data[i][2], perk_data[i][3], perk_data[i][4]);
        }
        for (var i = 0; i < upgrades_data.length; i++){
            upgrades[i] = new Upgrade(upgrades_data[i][0], upgrades_data[i][1], upgrades_data[i][2], upgrades_data[i][3], upgrades_data[i][4], upgrades_data[i][5], upgrades_data[i][6]);
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
            autos.forEach(function (auto) {
                $("#" + auto.getBuyId()).click(function () {
                    auto.buy();
                })
            });

            perks.forEach(function (perk) {
                $('#' + perk.getHtmlId()).click(function () {
                    perk.buy();
                })
            });

            upgrades.forEach(function (upgrade) {
                $('#' + upgrade.getHtmlId()).click(function () {
                    upgrade.buy();
                })
            });
        }
        //Menu selector checkers
        {
            menus.forEach(function(menu) {
                $('#' + menu.getHtmlId() + "_button").click(function() {
                    if(menu.isSelected() === false) {
                        menus.forEach(function(menu2){
                            if(menu2.getName() !== menu.getName()) {
                                menu2.deselect();
                            } else {
                                menu.select();
                            }
                        });
                    }
                });
            });
        }

        setInterval(function () {
            var points_to_add = 0;

            for (var i = 0; i < autos.length; i++) {
                var selector = "#" + autos[i].getBuyId();
                if (autos[i].canBuy()) {
                    $(selector).css("background", "rgba(0,0,0,0.3)");
                    $(selector).css("color", "rgba(0,0,0,1)");
                } else {
                    $(selector).css("background", "rgba(0,0,0,0.1)");
                    $(selector).css("color", "rgba(0,0,0,0.5)");
                }
                if(default_player.getTotalPoints()>=autos[i].getUnlocksAt()) {
                    $(selector).html("<img src=" + autos[i].getIconImg() + " height='20' width='20'> " + autos[i].getName() + " - " + Math.round(autos[i].getCost()));
                }else{
                    $(selector).html("<img src='images/filler.png' height='20' width='20'> ??? - ???");
                }
                if (autos[i].getCount() !== 0) {
                    $("#" + autos[i].getGifId()).css('display', 'block');
                } else {
                    $("#" + autos[i].getGifId()).css('display', 'none');
                }
                points_to_add = points_to_add + autos[i].getProduction();
                $(selector + "_count").html(autos[i].getCount());
            }
            for (var i = 0; i < perks.length; i++){
                var selector = "#" + perks[i].getHtmlId();
                if(perks[i].isBought()){
                    $(selector).css("background","rgba(0,0,0,0.7");
                    $(selector).css("color","rgba(255,255,255,1");
                }else if(perks[i].canBuy()){
                    $(selector).css("background","rgba(0,0,0,0.3");
                    $(selector).css("color","rgba(0,0,0,1");
                }else{
                    $(selector).css("background", "rgba(0,0,0,0.1)");
                    $(selector).css("color", "rgba(0,0,0,0.5)");
                }
                if(perks[i].canBuy()){
                    $('#' + perks[i].getHtmlId()).html(perks[i].getName() + " - " + perks[i].getCost());
                }else if(perks[i].isUnlocked()){
                    $('#' + perks[i].getHtmlId()).html(perks[i].getName() + " - ???");
                }else{
                    $('#' + perks[i].getHtmlId()).html("??? - ???");
                }
            }

            for (var i = 0; i < menus.length; i++) {
                if (menus[i].isSelected()) {
                    $('#' + menus[i].getHtmlId() + "_button").addClass("selected");
                    $('#' + menus[i].getHtmlId()).css("display", "block");
                } else {
                    $('#' + menus[i].getHtmlId() + "_button").removeClass("selected");
                    $('#' + menus[i].getHtmlId()).css("display", "none");
                }
            }
            for(var i = 0; i<upgrades.length; i++){
                var selector = "#" + upgrades[i].getHtmlId();
                if(upgrades[i].isBought()){
                    $(selector).css("background","rgba(0,0,0,0.7");
                    $(selector).css("color","rgba(255,255,255,1");
                }else if(upgrades[i].canBuy()){
                    $(selector).css("background","rgba(0,0,0,0.3");
                    $(selector).css("color","rgba(0,0,0,1");
                }else{
                    $(selector).css("background", "rgba(0,0,0,0.1)");
                    $(selector).css("color", "rgba(0,0,0,0.5)");
                }
                if(upgrades[i].canBuy()){
                    $(selector).css("display","block");
                    $(selector).html(upgrades[i].getName() + " - " + upgrades[i].getCost());
                }else{
                    $(selector).css("display","none");
                }
                if(upgrades[i].isBought()) {
                    $(selector).css("display","none");
                }
            }

            $('#points').html(Math.round(default_player.getPoints()));

            $('#persecond').html(Math.round(points_to_add));

            default_player.addPoints(points_to_add / 30);
        }, 10);
    });
}).call();
