/**
 * Created by duanhan on 27/6/17.
 */
var foods0={
    "alcohol":[],
    "juice":[],
    "other":[]
};
function refreshFood(){
for(var i=0,l=foods.length;i<l;i++){
    //console.log(foods[i]["Type"]);
 if(foods[i]["Type"].toUpperCase()=="alcohol".toUpperCase()){
     foods0["alcohol"].push(foods[i]);
 };
    if(foods[i]["Type"].toUpperCase()=="other".toUpperCase()){
        foods0["other"].push(foods[i]);
    };
    if(foods[i]["Type"].toUpperCase()=="juice".toUpperCase()){
        foods0["juice"].push(foods[i]);
    }
};
};
refreshFood();

function removeself(which){
    console.log($(which).parent());
    $(which).parent().remove();

}

function addnewrecipe(){
    var value = $('#recipe').val();
    if(value=="")
    {
        alert("Please input a name!");
        return;
    }
    var value = $('#food-new-recipe').val();
    if(value==null)
    {
        alert("Please select one food at least!");
        return;
    }
    var len = $('#preperation-lists').children().length;
    if(len==0)
    {
        alert("Please add one step in preparation at least!");
        return;
    }
    var recipeTmeplate = recipes["recipes"]["recipe"][0];
    var foodTmp = recipeTmeplate["ingredients"]["ingredient"][0];
    var stepTmp =recipeTmeplate["preparation"]["step"][0];
    recipeTmeplate["title"] = $('#recipe').val();
    recipeTmeplate["ingredients"]["ingredient"] = [];
    recipeTmeplate["preparation"]["step"] = [];
//push foods and step
    for(var i=0,l=len;i<l;i++){
        var dl = $('#preperation-lists').children()[i];
        var step = dl.innerText;
        recipeTmeplate["preparation"]["step"].push(step);
    }
    var foods = $('#new-recipe-food-tr').children();
    for(var i=0,l=foods.length;i<l;i++){
        foodTmp["-food"] = foods[i].children[0].innerText;
        foodTmp["-unit"] = foods[i].children[1].children[0].value;
        foodTmp["-quantity"] = foods[i].children[2].children[0].value;
        recipeTmeplate["ingredients"]["ingredient"].push(foodTmp);
    }


    recipes["recipes"]["recipe"].push(recipeTmeplate);
    refreshcount();
}
function newfood(){
    var value = $('#foodname').val();
    if(value=="")
    {
        alert("Please input a name!");
    }
    var type = $("input[name='radio7']:checked").val();
    var sour = $("input[name='radio5']:checked").val();
    var sweet = $("input[name='radio4']:checked").val();
    var alcohol = $("input[name='radio6']:checked").val();
    var fd= foods[0];
    fd.Name = value;
    fd.Sour = sour;
    fd.Sweet = sweet;
    fd.Alcohol = alcohol;
    fd.Type = type;
    foods.push(fd);
    refreshcount();
    refreshFood();
}
var b_retrieve = false;

function retrieveRecipe(which){

    if(b_retrieve){
        $('#step1').show();
        $('#step2').show();
        $('#step2-').show();
        $('#step3').show();
        $('#retrievecontent').html('');
        b_retrieve =false;
        $('#reBtn').html("retrieve")

    }else{
        if($('#food-mutiselect').val()==null)
        {
            var minlength = 0;
        }else{
            var minlength = $('#food-mutiselect').val().length;
        }

        if($('#minfood').val()!=""){
            var min = $('#minfood').val();
            if(min<minlength){
                alert("limitation set is not correct!");
                return;
            }
            if($('#maxfood').val()!=""){
                var max = $('#maxfood').val();
                if(max<min){
                    alert("limitation set is not correct!");
                    return;
                }

            };
        }


        $('#step1').hide();
        $('#step2').hide();
        $('#step2-').hide();
        $('#step3').hide();

        //var html = getcontent();
       // $('#retrievecontent').html(html);
        var recipelist = recipes["recipes"]["recipe"];
        var recipeSim =[];
        for(var i =0; i<recipelist.length;i++){
            var tmp=underRulesCase(recipelist[i]);
            console.log(i);
            console.log(tmp);
            if(tmp!=null){
                recipeSim.push(tmp);
            }
        }
        recipeSim.sort(down);
        console.log(recipeSim);
        for(var i =0; i<recipeSim.length;i++){
            if(i>3){
                break
            }
            recipeHTML(recipeSim[i],recipeSim[i].similarity);
        }
        b_retrieve =true;
        $('#reBtn').html("back");

    }

}

function down(a,b){
    return b.similarity-a.similarity
}

function underRulesCase(recipe){
    var sour = $("input[name='radio2']:checked").val();
    var sweet = $("input[name='radio1']:checked").val();
    var alcohol = $("input[name='radio3']:checked").val();
    var like = $('#food-mutiselect').val();
    var dislike = $('#food-mutiselect-dislike').val();
    var min = $('#minfood').val();
    var max = $('#maxfood').val();
    var ingredient = recipe.ingredients.ingredient;
    if(min!=""){
      if(ingredient.length<parseInt(min)){
            return null
      }
    }
    if(max!=""){
        if(ingredient.length>parseInt(max)){
            return null
        }
    }
    var b_sourT = false;
    var b_sweetT = false;
    var b_strong = false;

    for(var i=0;i<ingredient.length;i++){
        if(dislike!=null){
            for(var j=0;j<dislike.length;j++){
                if(dislike[j]==ingredient[i]["-food"]){
                    return null;
                }
            }
        }
        var tmp = getfoodByname(ingredient[i]["-food"]);
        if(tmp==null){
            console.log(ingredient[i]["-food"]);
            continue;
        }


        if(tmp.Sweet=="T"){
            b_sweetT = true;
        }
        if(tmp.Sour=="T"){
            b_sourT = true;
        }
        if(alcohol=="N"){
            if(tmp.Type=="alcohol"){
                return null;
            }
        }
        if(tmp.Alcohol=="S"){
            b_strong = true;
        }


    }
    if(sweet=='T'&&!b_sweetT){
        return null;
    }
    if(sweet=='F'&&b_sweetT){
        return null;
    }
    if(sour=='T'&&!b_sourT){
        return null;
    }
    if(sour=='F'&&b_sourT){
        return null;
    }
    if(alcohol=='T'&&!b_strong){
        return null;
    }
    if(alcohol=='F'&&b_strong){
        return null;
    }
    var similarity = 1;
    //adaption
    var flag = false;
    if(like!=null){
        similarity = 0;

        for(var j=0;j<like.length;j++){
            var adp =true;
            for(var i=0;i<ingredient.length;i++)
            {
                if(like[j]==ingredient[i]["-food"]){
                    similarity+=1;
                    adp=false;
                    break;
                }
            }
            if(adp){

                flag = true;
                for(var i=0;i<ingredient.length;i++)
                {
                    tmp = getfoodByname(like[j]);
                    tmp0 = getfoodByname(ingredient[i]["-food"]);
                    if(tmp==null||tmp0==null){
                       continue;
                        console.log(ingredient[i]["-food"]);
                        console.log(like[j]);
                    }
                    if(tmp.Type==tmp0.Type){
                        similarity+=0.5;
                        recipe.ingredients.ingredient[i]["-food"]=ingredient[i]["-food"]+'(<strong class="am-text-danger">'+like[j]+'</strong>)';
                        break;
                    }
                }
            }

        }
        if(flag){
            recipe.title +='(adaption)';
        }
        recipe.similarity = similarity/ingredient.length;
        recipe.similarity =  recipe.similarity.toFixed(2);

        return recipe;
    }else{
        recipe.similarity = 1;
        return recipe;
    }

}

function getfoodByname(name){
    var food =null;
    for(var i=0;i<foods.length;i++){
        if(foods[i].Name.toLowerCase() == name.toLowerCase()){
            food = foods[i];
            return food;
        }

    }
    return food;
}
function recipeHTML(recipe,sim){
    var title ='recipe of <strong class="am-text-warning">'+ recipe.title+'</strong>(Similarity:'+sim+')';
    var ingredient = recipe.ingredients.ingredient;
    var preparation = recipe.preparation.step;
    var html = "";
    for(var i=0;i<ingredient.length;i++){
        html+='<tr > <td>'+ingredient[i]["-food"]+'</td> <td> '+ingredient[i]["-unit"]+'</td> <td> '+ingredient[i]["-quantity"]+'</td> </tr>';
    }
    var html0="";
    console.log(preparation);
    for(var i=0;i<preparation.length;i++){
        html0+='<li class="am-g">'+preparation[i]+'</li>';
    }
    if(!Array.isArray(preparation)){
      //  html0=JSON.stringify(preparation);
        html0 = preparation;
    }
    var toppart='<div class="am-u-md-12"> <div class="am-panel am-panel-default"> ' +
        '<div class="am-panel-hd am-cf" >'+title+'</div> <div class="am-panel-bd am-collapse am-in" > ' +
        '<div class="am-g"> <div class="am-u-md-6"> <table class="am-table am-table-bordered " >' +
        ' <thead> <tr> <th>food</th> <th>unit</th> <th>quantity</th> </tr> </thead> <tbody >';
    toppart=toppart+html+'</tbody> </table></div> <div class="am-u-md-6"><div data-am-widget="list_news" class="am-list-news am-list-news-default" >' +
        ' <div class="am-list-news-hd am-cf"> <a class=""> <h2>preparation</h2> ' +
        '</a> </div> <div class="am-list-news-bd"> <ul class="am-list" >';
    toppart=toppart+html0+'</div> </div> </div> </div> </div></div> </div>';
    $('#retrievecontent').append(toppart);

}

function retrieve(){
    refreshcount();
    $('#retrieve').show();
    $('#addfood').hide();
    $('#adrecipe').hide();

}


function addrecipe(){
    refreshcount();
    $('#adrecipe').show();
    $('#addfood').hide();
    $('#retrieve').hide();

}


function addfood(){
    refreshcount();
    $('#addfood').show();
    $('#retrieve').hide();
    $('#adrecipe').hide();
}
function refreshcount(){
    $('#recipetitle').html("Add a new recipe(total "+recipes.recipes.recipe.length+" recipes)");
    $('#foodTitle').html("Add a new food(total "+foods.length+" foods)");
    generateAllfoodsSelect();

}
function generatefoodsSelect(){
    var sour = $("input[name='radio2']:checked").val();
    var sweet = $("input[name='radio1']:checked").val();
    var alcohol = $("input[name='radio3']:checked").val();
    var html = '';
    for(var i=0,l=foods0["alcohol"].length;i<l;i++){
        if(foods0["alcohol"][i]['Alcohol']==alcohol){
            html+='<option value="'+foods0["alcohol"][i]["Name"]+'">'+foods0["alcohol"][i]["Name"]+'</option>';
        }
        if(alcohol=="I"){
            html+='<option value="'+foods0["alcohol"][i]["Name"]+'">'+foods0["alcohol"][i]["Name"]+'</option>';
        }

    }
    $('#like-select-alcohol').html(html);
    $('#dislike-select-alcohol').html(html);
    var html = '';
    for(var i=0,l=foods0["juice"].length;i<l;i++){
        if(foods0["juice"][i]['Sweet']==sweet&&foods0["juice"][i]['Sour']==sour) {
            html += '<option value="' + foods0["juice"][i]["Name"] + '">' + foods0["juice"][i]["Name"] + '</option>';
        }
        if(sour=="I"&&sweet=="I"){
            html += '<option value="' + foods0["juice"][i]["Name"] + '">' + foods0["juice"][i]["Name"] + '</option>';
        }
        if(sweet=="I"&&foods0["juice"][i]['Sour']==sour) {
            html += '<option value="' + foods0["juice"][i]["Name"] + '">' + foods0["juice"][i]["Name"] + '</option>';
        }
        if(foods0["juice"][i]['Sweet']==sweet&&sour=="I") {
            html += '<option value="' + foods0["juice"][i]["Name"] + '">' + foods0["juice"][i]["Name"] + '</option>';
        }
    }
    $('#like-select-juice').html(html);
    $('#dislike-select-juice').html(html);

    var html = '';
    for(var i=0,l=foods0["other"].length;i<l;i++){
        if(foods0["other"][i]['Sweet']==sweet&&foods0["other"][i]['Sour']==sour) {
            html += '<option value="' + foods0["other"][i]["Name"] + '">' + foods0["other"][i]["Name"] + '</option>';
        }
        if(sour=="I"&&sweet=="I") {
            html += '<option value="' + foods0["other"][i]["Name"] + '">' + foods0["other"][i]["Name"] + '</option>';
        }
        if(sweet=="I"&&foods0["other"][i]['Sour']==sour) {
            html += '<option value="' + foods0["other"][i]["Name"] + '">' + foods0["other"][i]["Name"] + '</option>';
        }
        if(foods0["other"][i]['Sweet']==sweet&&sour=="I") {
            html += '<option value="' + foods0["other"][i]["Name"] + '">' + foods0["other"][i]["Name"] + '</option>';
        }
    }
    $('#like-select-other').html(html);
    $('#dislike-select-other').html(html);
}
function generateAllfoodsSelect(){
    var html = '';
    for(var i=0,l=foods0["alcohol"].length;i<l;i++){
        html+='<option value="'+foods0["alcohol"][i]["Name"]+'">'+foods0["alcohol"][i]["Name"]+'</option>';
    }
    $('#add-recipe-select-alcohol').html(html);
    var html = '';
    for(var i=0,l=foods0["juice"].length;i<l;i++){
        html+='<option value="'+foods0["juice"][i]["Name"]+'">'+foods0["juice"][i]["Name"]+'</option>';
    }
    $('#add-recipe-select-juice').html(html);

    var html = '';
    for(var i=0,l=foods0["other"].length;i<l;i++){
        html+='<option value="'+foods0["other"][i]["Name"]+'">'+foods0["other"][i]["Name"]+'</option>';
    }
    $('#add-recipe-select-other').html(html);
}

$(function() {
    refreshcount();
    generatefoodsSelect();
    $('input:radio[name="radio1"]').change( function(){
       console.log("change1");
        generatefoodsSelect();
    });
    $('input:radio[name="radio2"]').change( function(){
        console.log("change2");
        generatefoodsSelect();
    });
    $('input:radio[name="radio3"]').change( function(){
        console.log("change3");
        generatefoodsSelect();
    });
    var $selected = $('#class-selected');
    $('#food-mutiselect').on('checkedOverflow.selected.amui', function() {
        alert('you can not select more then' + this.getAttribute('maxchecked') + 'items');
    });

    $('#food-mutiselect').on('change', function() {
        //$('#js-selected-info').html([
        //    '选中项：<strong class="am-text-danger">',
        //    [$(this).find('option').eq(this.selectedIndex).text()],
        //    '</strong> 值：<strong class="am-text-warning">',
        //    $(this).val(),
        //    '</strong>'
        //].join(''));
        if($(this).val()!=null){
            var minlength = $(this).val().length;
            $('#minfood').val(minlength);
        }

    });


    $('#add-step').on('click',function(){
        console.log($('#preperation').val());
        var tmp = $('#preperation').val();
        var html = '<li class="am-g">' + tmp +
            '<span class="am-icon-times" onclick="removeself(this)"></span></li>';
        $('#preperation').val("");
        $('#preperation-lists').append(html);
    });
    $('#food-new-recipe').on('change', function() {
        $('#recipe-food-list').html([
            '<strong class="am-text-danger">my food-lists：</strong><strong class="am-text-warning">',
            $(this).val(),
            '</strong>'
        ].join(''));
        //console.log($(this).val());
        var strs=$(this).val();
        var html='';
        if(strs!=null)
        {
        for(var i=0,l=strs.length;i<l;i++){
            html+='  <tr ><td>'+strs[i]+'</td> <td> <input type="text" class="" placeholder="input unit"></td> ' +
                '<td><input type="text" class="" placeholder="input quantity"></td> </tr >';
        }
            $('#new-recipe-food-tr').html(html);
        }


    });
    $selected.on('change', function() {
        $('#js-selected-info').html([
            '选中项：<strong class="am-text-danger">',
            [$(this).find('option').eq(this.selectedIndex).text()],
            '</strong> 值：<strong class="am-text-warning">',
            $(this).val(),
            '</strong>'
        ].join(''));

    });

    generateAllfoodsSelect();
    var recipeTitle = recipes["recipes"]["recipe"][0]["title"];
    var foodName = foods[0]["Name"];

});