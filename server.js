var express = require('express');

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.fetch = function(id){
    console.log(typeof id, id);
    var item = '';
    for (var i = 0; i < this.items.length; i++){
        if (id == this.items[i].id){
            item = this.items[i];
            i = this.items.length;
        }
    }
    if (!item){
      item = 'not found'
    }
    return item;
};

Storage.prototype.deleteItem = function(id){
  var item = '';
  for (var i = 0; i < this.items.length; i++){
    if (id == this.items[i].id){
      item = this.items.splice(i, 1);
      i = this.items.length;
    }
  }
  if (!item){
    item = 'not found'
  }
  return item;
}

Storage.prototype.update = function(obj){
  var item = '';
  // Databases are fast; index, faster lookup algorithms, etc.
  for (var i = 0; i < this.items.length; i++){
    if (obj.id == this.items[i].id){
      this.items[i].name = obj.name
      item = this.items[i];
    }
  }
  if (!item){
    this.items.push(obj);
    item = this.fetch(obj.id)
  }
  return item;
}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.get("/items/:id", function(req, res){
   console.log(req.params.id)
   console.log(storage.items)
   var id = req.params.id
   var item = storage.fetch(req.params.id);
   if (item == 'not found'){
        res.status(400).json({message: item, statusCode: 13});
   }
   else {
       res.status(200).json(item)
   }
});

app.get('/items', function(req, res) {
    res.json(storage.items);
});


app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res){
    var id = req.params.id
    console.log(id)
    var item = storage.deleteItem(id)
    if (item == 'not found'){
        // return res.sendStatus(400)
        res.status(400).json({message: item, statusCode: 13});
    }
    else {
        res.status(201).json(item)
    }
   
})

app.put('/items/:id', jsonParser, function(req, res, body){
    console.log(req.body);
    var obj = req.body;
    var item = storage.update(obj)
    if (!item){
        return res.sendStatus(404)
    }
    else {
        res.status(201).json(item)
    }
})

app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;