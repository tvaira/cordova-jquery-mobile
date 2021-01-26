// Application gfiches
// tvaira@free.fr

// tag pour logcat : [gfiches] -> $ adb logcat | grep "\[gfiches\]"

document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('pause', onPause, false);
document.addEventListener('resume', onResume, false);

function onDeviceReady() {
    // Cordova est initialisé
    console.log('[gfiches] Démarrage Cordova v' + cordova.version + ' pour ' + cordova.platformId);
    
    initialiserBaseDeDonnees();
    
    document.getElementById('deviceready').classList.add('ready');
}

function onPause()
{
    if(cordova.platformId === 'android') 
    {
        console.log('[gfiches] onPause()');
    }    
}

function onResume()
{
    if(cordova.platformId === 'android') 
    {
        console.log('[gfiches] onResume()');
    }    
}

$(document).on("mobileinit", function (event, ui)
{
    // jQuery Mobile est initialisé
    console.log('[gfiches] Démarrage jQuery Mobile');
    
    $.mobile.defaultPageTransition = "slide";
});

// Instancie les objets principaux
accueil = new Accueil();
utilisateurs = new Utilisateurs();
fiches = new Fiches();
enregistrementFiche = new EnregistrementFiche();
enregistrementUtilisateur = new EnregistrementUtilisateur();
connexionUtilisateur = new ConnexionUtilisateur();

// Gestion des pages
$(document).on("pagecontainerbeforeshow", function (event, ui) {
    if (typeof ui.toPage == "object")
    {
        switch (ui.toPage.attr("id"))
        {
            case "accueil":
                console.log('[gfiches] Page accueil');
                accueil.initialiserPage();
                break;
            case "utilisateurs":
                console.log('[gfiches] Page utilisateurs');
                utilisateurs.lister();
                break;
            case "fiches":
                console.log('[gfiches] Page fiches');
                fiches.lister();
                break;
            case "page-enregistrement-fiche":
                console.log('[gfiches] Page enregistrement fiche');
                enregistrementFiche.initialiserFormulaire();
                break;
            case "page-enregistrement-utilisateur":
                console.log('[gfiches] Page enregistrement utilisateur');
                enregistrementUtilisateur.initialiserFormulaire();
                break;
            case "page-connexion-utilisateur":
                console.log('[gfiches] Page connexion utilisateur');
                connexionUtilisateur.initialiserFormulaire();
                break;
        }
    }
});

// Seulement pour iOS
if(cordova.platformId === 'ios') 
{
    $("#accueil").on('touchmove', function(evt) { evt.preventDefault(); })
    $("#apropos").on('touchmove', function(evt) { evt.preventDefault(); })
}
