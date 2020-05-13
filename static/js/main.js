function loadDoc(url, cFunction, cArgs) {
  var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      cFunction(this, cArgs);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function getArticlesList(xhttp) {
  var text = xhttp.responseText;
  console.log(text);
  console.log(data);
  const obj = JSON.parse(text);
  data["content"]={"Everything":[]}
  data["categories"]=[];
  $.each(obj, function( key, categories ) {
    cat_name=categories["name"];
    data["content"][cat_name]=[];
    data.categories.push(cat_name)
    console.log(cat_name);
    $("#menu").append("<li><a href=# target='_blank'>"+cat_name+"</a></li>");
    loadDoc("https://api.github.com/repos/AlxndrPsclt/jasone/contents/articles/"+cat_name, getContentFromCategory, cat_name);
  })
}

function displayArticles(category) {
    data["content"][category].forEach(displayArticle)
}

function displayArticle(article){
  $("#articles").append("<article id='"+article.name+"'>"+article.html+"</article>");
}

function displayArticlesFromCategories(categories){
  categories.forEach(displayArticles);
}


function loadArticle(xhttp, article_infos) {
  var converter = new showdown.Converter(),
    text      = xhttp.responseText,
    html      = converter.makeHtml(text);
  article={"name":article_infos["article_name"], "html":html}
  data["content"][article_infos["cat_name"]].push(article)
  displayArticle(article)
}

function getContentFromCategory(xhttp, cat_name) {
  var text = xhttp.responseText;
  const obj = JSON.parse(text);
  console.log("Get article names");
  $.each(obj, function( key, article ) {
    article_url=article["download_url"]
    article_name=article["name"]
    console.log(article_url);
    loadDoc(article_url, loadArticle, {"cat_name": cat_name, "article_name": article_name});
  })
}

var data={ "title":"Jasone's blog"};

var display="Everything"

$( document ).ready(function() {
  loadDoc('https://api.github.com/repos/AlxndrPsclt/jasone/contents/articles', getArticlesList);
  console.log( "ready!" );
  /*loadDoc('articles/000.md', myFunction);*/
});
