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
  data["content"]=[];
  data["categories"]=[];
  $.each(obj, function( key, categories ) {
    cat_name=categories["name"];
    data.categories.push(cat_name)
    console.log(cat_name);
    $("#menu").append("<li><button onclick=\"displayArticles(['"+cat_name+"']);\">"+cat_name+"</button></li>");
    loadDoc("https://api.github.com/repos/AlxndrPsclt/jasone/contents/articles/"+cat_name, getContentFromCategory, cat_name);
  });
  $("#menu").prepend("<li><button onclick='displayArticles("+JSON.stringify(data.categories)+");'>everything</button></li>");
}


function displayArticle(article){
  $("#articles").append("<article id='"+article.name+"'>"+article.html+"</article>");
}

function displayArticles(categories) {
  console.log("Check de ou ça en est");
  console.log(categories);
  $("#articles").empty();
  for (id_article in data["content"]) {
    article=data.content[id_article];
    console.log(article);
    if (categories.includes(article.category)) {
      console.log("Ok, part of the category");
      displayArticle(article);
    }
  }
  display=categories;
}



function loadArticle(xhttp, article_infos) {
  var converter = new showdown.Converter(),
    text      = xhttp.responseText,
    html      = converter.makeHtml(text);
  article={"name":article_infos["article_name"], "category":article_infos.cat_name, "html":html}
  data["content"].push(article)
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

var display="everything"

$( document ).ready(function() {
  loadDoc('https://api.github.com/repos/AlxndrPsclt/jasone/contents/articles', getArticlesList);
  console.log( "ready!" );
  /*loadDoc('articles/000.md', myFunction);*/
});
