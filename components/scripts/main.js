/* =============================
This file contains all custom 'home brewed' scripts.
    ============================= */

// NAV Menu Drop Downs
var navMenu = document.querySelector('.nav-menu');

navMenu.addEventListener('click', dropMenu , false);

function dropMenu(e) {
    //console.log(e);

    //check for children
    if(e.target.classList.contains('menu') && e.target.children.length !== 0) {
        
        //spin icon
        e.target.children[0].classList.toggle('spin');

        //show menu
        e.target.children[1].classList.toggle('show-menu');
    }
    
    //check for icon click
    if (e.target.classList.contains('menu-icon')) {

        //spin icon
        e.target.classList.toggle('spin');

        //show menu
        e.target.nextElementSibling.classList.toggle('show-menu');
    }

    e.stopPropagation();
};

window.addEventListener('mouseup', hideMenu , false);

function hideMenu(e) {
    //console.log(e);

    var menu = document.querySelectorAll('.menu');

    for(var i = 0; i < menu.length; i++){
        if(e.target !== menu[i] && e.target !== menu[i].children[0]) {
            if(menu[i].children.length !== 0){
                menu[i].children[0].classList.remove('spin');
                menu[i].children[1].classList.remove('show-menu');
                //console.log(menu[i]);
            } 
        }
    }
    e.stopPropagation();
}


// Mobile NAV Menu
var roundButton = document.querySelector('#roundButton');
roundButton.addEventListener("click", showMenu, false);

var flyoutMenu = document.querySelector('#nav-menu');
// navMenu.addEventListener("click", hideMenu, false);

function showMenu(e) {
    flyoutMenu.classList.toggle("show");
    e.stopPropagation();
}





