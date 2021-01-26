// Gestion de la page Accueil
// tvaira@free.fr

Accueil = function ()
{
    this.connecte = "connecte";
    this.rememberMe = "rememberMe";
    this.$pageAccueil = null;
    this.$messageAccueil = null;
    this.$affichageConnexion = null;
    this.$affichageUtilisateur = null;
    this.$boutonDeconnecter = null;
};

Accueil.prototype.init = function ()
{
    this.$pageAccueil = $("#accueil");
    this.$messageAccueil = $("#message-accueil", this.$pageAccueil);
    this.$affichageConnexion = $("#affichage-connexion", this.$pageAccueil);
    this.$affichageUtilisateur = $("#affichage-utilisateur", this.$pageAccueil);
    this.$boutonDeconnecter = $("#bouton-deconnecter", this.$pageAccueil);
};

Accueil.prototype.afficherBienvenue = function (utilisateur)
{
    if(utilisateur != null)
    {
        this.$messageAccueil.html("Bienvenue " + utilisateur);                    
        this.$affichageConnexion.hide();
        this.$affichageUtilisateur.show();
    }
    else
    {
        this.$messageAccueil.html("Bienvenue !");
        this.$affichageConnexion.show();
        this.$affichageUtilisateur.hide();
    }
};

Accueil.prototype.initialiserPage = function ()
{
    console.log('[gfiches] Page accueil : initialiserPage');
    if(supportsLocalStorage())
    {        
        var rememberMe = window.localStorage.getItem(this.rememberMe);
        if(rememberMe != null)
        {
            if(rememberMe)
            {
                var utilisateur = window.localStorage.getItem(this.connecte);
                this.afficherBienvenue(utilisateur);
            }
            else
            {
                this.afficherBienvenue(null);
            }
        }
        else
        {
            this.afficherBienvenue(null);
        }
    }
    else
    {
        this.afficherBienvenue(null);
    }
    console.log('[gfiches] Page accueil : initialiserPage -> ' + this.$messageAccueil.html());
};

Accueil.prototype.seDeconnecter = function ()
{
    console.log('[gfiches] Page accueil : seDeconnecter');
    if(supportsLocalStorage())
    {
        // Efface les traces
        window.localStorage.removeItem(this.connecte);
        window.localStorage.setItem(this.rememberMe, false);

        // Recharge la page accueil
        $(":mobile-pagecontainer").pagecontainer("change", "index.html#accueil",
        {
            reload: false,
            allowSamePageTransition: true,
            transition: "none"
        });
    }
};

// Création de la page accueil
$(document).delegate("#accueil", "pagebeforecreate", function()
{
    accueil.init();

    // Active le bouton "Se déconnecter"
    accueil.$boutonDeconnecter.off("tap").on("tap", function ()
    {
        accueil.seDeconnecter();
    });
});
