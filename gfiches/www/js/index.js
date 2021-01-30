// Application gfiches
// tvaira@free.fr

// tag pour logcat : [gfiches] -> $ adb logcat | grep "\[gfiches\]"
// tag pour logcat : [gfiches] -> $ adb logcat | grep -iE "\[gfiches\]|error"

var jqueryReady = false;
var cordovaReady = false;

document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('pause', onPause, false);
document.addEventListener('resume', onResume, false);

function onDeviceReady() {
    // Cordova est initialisé
    console.log('[gfiches] Démarrage Cordova v' + cordova.version + ' pour ' + cordova.platformId);

    cordovaReady = true;
    //document.getElementById('deviceready').classList.add('ready');
    isReady();
}

$(document).on("mobileinit", function (event, ui)
{
    // jQuery Mobile est initialisé
    console.log('[gfiches] Démarrage jQuery Mobile');
    
    jqueryReady = true;
    $.mobile.defaultPageTransition = "slide";
    isReady();
});

function main()
{
    console.log('[gfiches] Main start');

    initialiserPlateformeIOS();

    initialiserBaseDeDonnees();

    //console.log('[gfiches] Main done');
}

// Instancie les objets principaux
accueil = new Accueil();
utilisateurs = new Utilisateurs();
fiches = new Fiches();
enregistrementFiche = new EnregistrementFiche();
enregistrementUtilisateur = new EnregistrementUtilisateur();
connexionUtilisateur = new ConnexionUtilisateur();

console.log('[gfiches] Main step 3');

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
