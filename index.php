<?php
$version = "a0.2_1"
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="css/main.css"/>
    <title>Büntipont gyűjtő</title>
    <meta name="description" content="Egy weboldal ahol büntipontokat lehet gyűjteni külömböző módszerek kihasználásával :)" />
</head>

<body>
<h1>Büntipont gyűjtő fepoltal</h1>
<h3><?= $version; ?></h3>

<button id="sv_cookie">Mentés cookie-ba</button>
<button id="ld_cookie">Betöltés cookie-bülndmfmnemrnnenebybewbxbhdbdbnxndm,x vdmsm d nm x c c d x cd
    ndknrhennendbdsbbedv
</button>
<br>
<button id="sv_button">Mentés</button>
<input type="text" id="ld_data" placeholder="Kód">
<button id="ld_button">Betölt</button>
<div class="card" id="card"></div>
<div class="points" id="points"></div>
<div class="persecond" id="persecond"></div>
<div class="images" id="images">
    <img id="weed_gif" src="images/weed.gif">
    <img id="food_gif" src="images/dob.gif">
    <img id="toilet_gif" src="images/wceget.gif">
</div>
<div class="sidebar">
    <div class="buttons">
        <div class="button" id="autos_button"></div>
        <div class="button" id="perks_button"></div>
    </div>
    <div id="autos">
        <div class="item_count" id="buy_bad_food_count"></div>
        <div class="buy_item" id="buy_bad_food"></div>

        <div class="item_count" id="buy_gondnok_count"></div>
        <div class="buy_item" id="buy_gondnok"></div>

        <div class="item_count" id="buy_weed_count"></div>
        <div class="buy_item" id="buy_weed"></div>

        <div class="item_count" id="buy_toilet_count"></div>
        <div class="buy_item" id="buy_toilet"></div>

        <div class="item_count" id="buy_teacher_count"></div>
        <div class="buy_item" id="buy_teacher"></div>
    </div>
    <div id="perks">
        <div class="perk" id="broken"></div>
        <div class="perk" id="night"></div>
        <div class="perk" id="blocked"></div>
        <div class="perk" id="found"></div>
        <div class="perk" id="kakas"></div>
        <div class="perk" id="jakab"></div>
    </div>
</div>
<div class="footer">
    Írta: Burgess Benedek<br>
    Design: Turnyánszki Tamás
</div>
</body>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/main.js"></script>
</html>
