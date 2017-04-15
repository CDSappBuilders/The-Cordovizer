// a voir mais bonne idée
//TODO: declare curwin style header 
//add button to retoggle the box
$('<div/>', {
     html:'ok',
    'class':'pluginDivChidren notSelect',
    click: ()=>{
          var curwin = nw.Window.get();
          curwin.close();          
    }
}).appendTo('.messBox_text');
                        