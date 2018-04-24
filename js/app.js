
// INICIA EL EFECTO DEL TITULO
$(document).ready(function () {

		setInterval(function(){
	
			$("h1").switchClass(".main-titulo", "blanco", 2000);
			$("h1").switchClass("blanco", ".main-titulo", 2000);
		
		}, 2000);
	
})


// INICIALIZA LAS VARIABLES Y ARRAYS
var misfilas=0; 
var miscolumnas=0;
var nuevas=0;
var contarcolumnas=["","","","","","",""];
var contarfilas=["","","","","","",""];
var maximo=0;
var matriz=0;

var intervalo=0;
var borrardulces=0;
var newdulces=0;
var tiempo=0;

var i=0;
var contador=0;

var espera=0;
var puntos=0;
var movimientos=0;

var minutos=2;
var segundos=0;


// FUNCIONES PARA EL EVENTO CLICK DEL BOTON REINICIO
$(".btn-reinicio").click(function(){
  i=0;
  puntos=0;
  movimientos=0;
  $(".panel-score").css("width","25%");
  $(".panel-tablero").show();
  $(".time").show();

  $("#score-text").html("0")
  $("#movimientos-text").html("0")
  $(this).html("REINICIAR")
  clearInterval(intervalo);
  clearInterval(borrardulces);
  clearInterval(newdulces);
  clearInterval(tiempo);
  minutos=2;
  segundos=0;
  limpiartodo()
  intervalo=setInterval(function(){acomodar()},500)
  tiempo=setInterval(function(){timer()},1000)
})



//FUNCION PARA AGREGAR LOS DULCES EN EL TABLERO AL INICIO
function acomodar()
{
  i=i+1
  var numero=0;
  var imagen=0;

  $(".elemento").draggable({ disabled: true });
  if(i<8)
  {
    for(var j=1;j<8;j++)
    {
      if($(".col-"+j).children("img:nth-child("+i+")").html()==null)
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
      }
    }
  }
  if(i==8)
  {
    clearInterval(intervalo);
    borrardulces=setInterval(function(){limpiarhover()},150)
  }
}


// LIMPIAR LA FILA DE MAS DE TRES DULCES 
function limpiarhover()
{
  matriz=0;
  misfilas=filas()  
  miscolumnas=columnas()

  for(var j=1;j<8;j++)
  {
      matriz=matriz+$(".col-"+j).children().length;
  }

  //SI NO HAY 3 DULCES, AGREGA MAS DULCES AL TABLERO
  if(misfilas==0 && miscolumnas==0 && matriz!=49)
  {
      clearInterval(borrardulces);
      nuevas=0;
      newdulces=setInterval(function()
      {
        dulcesnuevos()
      },500)
  }
  if(misfilas==1 || miscolumnas==1)
  {
    $(".elemento").draggable({ disabled: true });
    $("div[class^='col']").css("justify-content","flex-end")
    $(".activo").hide("pulsate",1000,function(){
      var puntostmp=$(".activo").length;
      $(".activo").remove("img")
      puntos=puntos+puntostmp;
      $("#score-text").html(puntos)
    })
  }

  if(misfilas==0 && miscolumnas==0 && matriz==49)
  {
    $(".elemento").draggable({
      disabled: false,
      containment: ".panel-tablero",
      revert: true,
      revertDuration: 0,
      snap: ".elemento",
      snapMode: "inner",
      snapTolerance: 40,
      start: function(event, ui){
        movimientos=movimientos+1;
        $("#movimientos-text").html(movimientos)
      }
    });
  }

  //BUSQUEDAS DE NUEVOS DULCES
  $(".elemento").droppable({
    drop: function (event, ui) {
      var dropped = ui.draggable;
      var droppedOn = this;
      espera=0;
      do{
        espera=dropped.swap($(droppedOn));
      }while(espera==0)
      misfilas=filas()
      miscolumnas=columnas()
      if(misfilas==0 && miscolumnas==0)
      {
        dropped.swap($(droppedOn));
      }
      if(misfilas==1 || miscolumnas==1)
      {
        clearInterval(newdulces);
        clearInterval(borrardulces);
        borrardulces=setInterval(function(){limpiarhover()},150)
      }
    },
  });
}

// FUNCION PARA CAMBIAR LA POSICION DE LOS DULCES
jQuery.fn.swap = function(b)
{
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};


//ANIMACION DEL MARCADOR
function callback()
{
    $( ".panel-score" ).animate({width:'100%'},4000);
}

// BORRA LOS DULCES DEL TABLERO
function limpiartodo()
{
  for(var j=1;j<8;j++)
  {
    $(".col-"+j).children("img").detach();
  }
}



//FUNCION PARA AGREGAR NUEVOS DULCES
function dulcesnuevos()
{
  $(".elemento").draggable({ disabled: true });
  //alert("pase")
  $("div[class^='col']").css("justify-content","flex-start")
  for(var j=1;j<8;j++)
  {
      contarcolumnas[j-1]=$(".col-"+j).children().length;
  }
  if(nuevas==0)
  {
    for(var j=0;j<7;j++)
    {
      contarfilas[j]=(7-contarcolumnas[j]);
    }
    maximo=Math.max.apply(null,contarfilas);
    contador=maximo;
  }
  if(maximo!=0)
  {
    if(nuevas==1)
    {
      for(var j=1;j<8;j++)
      {
        if(contador>(maximo-contarfilas[j-1]))
        {
          $(".col-"+j).children("img:nth-child("+(contarfilas[j-1])+")").remove("img")
        }
      }
    }
    if(nuevas==0)
    {
      nuevas=1;
      for(var k=1;k<8;k++)
      {
        for(var j=0;j<(contarfilas[k-1]-1);j++)
        {
            $(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>")
        }
      }
    }
    for(var j=1;j<8;j++)
    {
      if(contador>(maximo-contarfilas[j-1]))
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>")
      }
    }
  }
  if(contador==1)
  {
      clearInterval(newdulces);
      borrardulces=setInterval(function(){limpiarhover()},150)
  }
  contador=contador-1;
}


//FUNCION PARA BUSCAR DULCES POR FILA
function filas()
{
  var bh=0;
  for(var j=1;j<8;j++)
  {
    for(var k=1;k<6;k++)
    {
      var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src")
      var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src")
      var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src")
      if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null))
      {
          $(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          bh=1;
      }
    }
  }
  return bh;
}

//FUNCION PARA BUSCAR DULCES POR COLUMNA
function columnas()
{
  var bv=0;
  for(var l=1;l<6;l++)
  {
    for(var k=1;k<8;k++)
    {
      var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src")
      var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src")
      var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src")
      if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null))
      {
          $(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo")
          bv=1;
      }
    }
  }
  return bv;
}


//FUNCION PARA EL CRONOMETRO
function timer()
{
  if(segundos!=0)
  {
    segundos=segundos-1;
  }
  if(segundos==0)
  {
    if(minutos==0)
    {
      clearInterval(borrardulces);
      clearInterval(newdulces);
      clearInterval(intervalo);
      clearInterval(tiempo);
      $( ".panel-tablero" ).hide("drop","slow",callback);
      $( ".time" ).hide();
    }
    segundos=59;
    minutos=minutos-1;
  }
  $("#timer").html("0"+minutos+":"+segundos)
}



