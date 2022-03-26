const express = require("express");
const bodyparser = require("body-parser");
const { application } = require("express");
const ejs = require("ejs");
const app = express();
const indexjs = require(__dirname + "/views/index.js");
const mongoose = require("mongoose");

var schema = mongoose.Schema;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//mongoose connection to the new todolistdb database
mongoose.connect("mongodb+srv://arpitnakrani:test123@firstcluster0.ws29e.mongodb.net/todolistdb");
const listschema = new schema({
  name: String,
});
const listitem = mongoose.model("listitem", listschema);

//default item to be added..
const item1 = new listitem({ name: "Welcome to your list!" });
const item2 = new listitem({ name: "hit the + button to add a item." });
const item3 = new listitem({ name: "check the box to delete a item." });
const defaultitem = [item1, item2, item3];

const customcollectionschema = new schema({
  name: String,
  items: [listschema],
});

const customlists = mongoose.model("customlists", customcollectionschema);

//date logic-----------------------------------------------------------------------------
const currdayname = indexjs.currdayname;
//-----------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  listitem.find({}, (err, data) => {
    if (err) console.log("error");
    else if (data.length == 0) {
      listitem.insertMany(defaultitem, (err) => {
        if (err) console.log("data not added");
        else console.log("added succesfully");
      });
    }
    res.render("list.ejs", { elistname: "Today", enewitems: data });
  });
});
//---------------------------------------------------------------
//for customlist
app.get("/:typeoflist", (req, res) => {
  const customlistname = req.params.typeoflist;

  customlists.findOne({name : customlistname}, (err, found) => {
    if (!err) {
      if (!found) {
        const cl1 = new customlists({
          name: customlistname,
          items: defaultitem
        });
        cl1.save();
        res.redirect("/" + customlistname);
      }
      else
      res.render("list.ejs", {elistname: found.name,enewitems: found.items});
    }
     else console.log("eroor");
  });
});
//-------------------------------------------------------
app.post("/", (req, res) => {

var postlist = req.body.btn;

      let newmember = req.body.listmember;
      const item = new listitem({
      name: newmember,
       });

       if(postlist == "today")
       {
        item.save();
        res.redirect("/");
       }
       else
       {
            customlists.findOne({name : postlist} , (err,foundlist)=>{
              if(!err)
              {
                foundlist.items.push(item);
                foundlist.save();
                res.redirect("/" + postlist);
              }
              else
              console.log("error at findingone");
            });
       }
});
//-------------------------------------------------------------
app.post("/delete", (req, res) => {
  console.log(req.body.checkbox);
  var checkedbox_id = req.body.checkbox;
  const listname = req.body.listname;

  if(listname === "today"){
          listitem.deleteOne({ _id: checkedbox_id }, (err) => {
              if (err) console.log(err);
              else console.log("deleted succesfully");
          });
            res.redirect("/");
    }
  else{
        customlists.findOneAndUpdate({name : listname} , {$pull : {items :{_id : checkedbox_id}}} , (err,foundone)=>
        {
              if(!err)
              {
                  console.log("succesfully pulled one listmember from items");
              }
              else
              console.log("error!");

              res.redirect("/" + listname);

        });
      }
});
//----------------------------------------------------------------------------

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.listen("8000", () => {
  console.log("listning on the port 8000");
});

