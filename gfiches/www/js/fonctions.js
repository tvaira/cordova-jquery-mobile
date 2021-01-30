// Focntions diverses
// tvaira@free.fr

function isReady()
{
    if(jqueryReady && cordovaReady)
        main();
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

function initialiserPlateformeIOS()
{
    // Seulement pour iOS
    if(cordova.platformId === 'ios') 
    {
        $("#accueil").on('touchmove', function(evt) { evt.preventDefault(); })
        $("#apropos").on('touchmove', function(evt) { evt.preventDefault(); })
    }
}

// cordova plugin add cordova-sqlite-storage
function supportsSqlitePlugin()
{
  try
  {
    return 'sqlitePlugin' in window && window['sqlitePlugin'] !== null;
  }
  catch (e)
  {
    return false;
  }
}

// cordova plugin add cordova-pdf-generator
function supportsPDFPlugin()
{
  try
  {
    return 'pdf' in window && window['pdf'] !== null;
  }
  catch (e)
  {
    return false;
  }
}

// cordova plugin add cordova-plugin-file
function supportsFilePlugin()
{
  try
  {
    return 'File' in window && window['File'] !== null;
  }
  catch (e)
  {
    return false;
  }
}

function supportsPlugins()
{
    if(!supportsPDFPlugin() || !supportsFilePlugin())
        return false;
   
    if(!supportsSqlitePlugin())
        return false;

    return true;
}

function estConnecte()
{
    var connecte = null;
    if(supportsLocalStorage())
    {   
        connecte = window.localStorage.getItem("connecte");
        if(connecte != null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}

function getUtilisateurConnecte()
{
    var nom = null;
    if(supportsLocalStorage())
    {
        if(estConnecte())
        {
            nom = window.localStorage.getItem("connecte");            
        }        
    }
    
    return nom;
}

function estRememberMe()
{
    var rememberMe = null;
    if(supportsLocalStorage())
    {   
        rememberMe = window.localStorage.getItem("rememberMe");
        if(rememberMe != null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}

function ScaleContentToDevice()
{
    scroll(0, 0);
    var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
    $(".ui-content").height(content);
}
