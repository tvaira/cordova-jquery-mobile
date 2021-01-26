// Fonctions de navigation pour changer de page
function navnext( next ) {
    $( ":mobile-pagecontainer" ).pagecontainer( "change", next, {
        transition: "slide"
    });
}
function navprev( prev ) {
    $( ":mobile-pagecontainer" ).pagecontainer( "change", prev, {
        transition: "slide",
        reverse: true
    });
}

$( document ).one( "pagecreate", "#accueil", function() {
    // Gestion des évènements swipeleft/swiperight
    // swipeleft = page suivante
    $( document ).on( "swipeleft", ".ui-page", function( event ) {
        // récupère le nom de la page suivante
        var next = $( this ).jqmData( "next" );
        // change de page
        if ( next ) {
            navnext( next );
        }
    });
    // swiperight = page précédente
    $( document ).on( "swiperight", ".ui-page", function( event ) {
        // récupère le nom de la page précèdente
        var prev = $( this ).jqmData( "prev" );
        // change de page
        if (prev) {
            navprev( prev );
        }
    });
    // Même principe pour des clics
    $( document ).on( "click", ".next", function() {
        var next = $( ".ui-page-active" ).jqmData( "next" );
        if ( next ) {
            navnext( next );
        }
    });
    $( document ).on( "click", ".prev", function() {
        var prev = $( ".ui-page-active" ).jqmData( "prev" );
        if ( prev ) {
            navprev( prev );
        }
    });
});
