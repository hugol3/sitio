$(function(){
    //Se crean constantes de los Id de las etiquetas del html
    const d = document;
    $form = d.getElementById("buscar");
    $loader = d.querySelector(".loader");
    $error = d.querySelector(".error");
    $img = d.querySelector(".conteiner-img");
    $info = d.querySelector(".conteiner-txt");
    $cont = d.querySelector(".cont");
    $artist = d.querySelector(".artist");

    var header = d.querySelector(".header");
    var headroom = new Headroom(header);
	headroom.init();

   var ancho = $(window).width(), menu = $("#enlaces"),
   btnmenu = $("#btn-menu"),
   icono = $("#btn-menu .icono");

   if(ancho < 806) //Se coloca el tamaño, si es menor muesta el icono fa-bars
   {
        menu.hide();
        icono.addClass("fa-bars");
   }

   //Se coloca en evento para hacer click cambie los estilos del menu y del icono 
   btnmenu.on('click',function(e){
        menu.slideToggle();
        icono.toggleClass('fa-bars');
        icono.toggleClass('fa-times');
   });

   //se toma en cuenta un tamaña y si se pasa del tamaño definido
   $(window).on('resize', function(){
    if($(this).width()>806)
    {
        menu.show();//muestra el menu
        icono.addClass('fa-times'); //Cambia icono de barra por una cruz
        icono.removeClass('fa-bars');//Quita el icono de barras		
    }
    else
    {
        menu.hide(); //oculta el menu	
        icono.addClass('fa-bars');//Cambia el icono de cruz por el icono de barras
        icono.removeClass('fa-times');//Remueve el icono de cruz 	
    }
});

   $form.addEventListener('submit', async e=>{
        e.preventDefault();
        //Para evitar errores en el envio de informacion se coloca un try catch
        try
        {
            $loader.style.display ="block";//Cambia estilo al id loader
            $cont.style.display ="block";//Cambia estilo al id cont
            //Se crea la variable artist que va a contener lo del formulario
            let artist = e.target.artist.value.toLowerCase()//Transforma el contenido del formulario en minusculas,
            $artistTemplate = "",
            artistAPI = `https://theaudiodb.com/api/v1/json/1/search.php?s=${artist}`//La url del API con el nombre del artista,
            artistFetch = fetch(artistAPI)//Hacemos una consulta al API,
            [artistRes] = await Promise.all([artistFetch])//Muestra todo el contenido de la consulta,
            artistData = await artistRes.json();//los transforma en un JSON
            //Verificamos si el json no esta vacio
            if(artistData.artist === null)
            {
                $artistTemplate =`<h2>No existe el Artista <strong>${artist}</strong> </h2>`
            }
            else
            {
                let artist = artistData.artists[0];//Obtenemos la informacion del JSON
                //Creamos variables para obtener cada objeto del JSON obtenido y agregamos html para mostralo
                $artistImg = ` <img class="img" src="${artist.strArtistThumb}" alt="${artist.strArtits}">
                                <p class="born">${artist.intBornYear || artist.intFormedYear} - ${artist.intDiedYear || "Presente"} </p>`;

                $artistInfo = ` <p class="nombre"> <strong>${artist.strArtist}</strong> </p> 
                                <p class="info">${artist.strBiographyES}" </p>`;
            }
            $loader.style.display ="none";
            $img.innerHTML = $artistImg;//Inserta el html en la etiqueta que tiene el Id img 
            $info.innerHTML = $artistInfo;//Inserta el html en la etiqueta que tiene el Id info
        }
        catch(err)
        {
            console.log(err);//Montramos el error en consola
            let message = err.statusText || "Ocurrio un Error";//Creamos la variable para mostrar en un html un mensaje de error
            $loader.style.display ="none";//Agregamos un estilo al Id loader
            $error.innerHTML = `<p>Error ${err.status}: ${message}</p>`;//Insertamos html para mostrar el mensaje de error
        }
   });
});    