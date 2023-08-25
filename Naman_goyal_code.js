const { urlencoded } = require("express");
var expressKuch = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql");
var path = require("path");
const { report } = require("process");
var app = expressKuch();
app.use(expressKuch.static("public"));

app.listen(2009, function () {
  console.log("server started");
});
var dbConfiguration = {
  host: "localhost",
  user: "root",
  password: "",
  database: "project",
};
var refdb = mysql.createConnection(dbConfiguration);
refdb.connect(function (err) {
  if (err) console.log(err);
  else console.log("Connected to Server....");
});
app.get("/signup", function (req, resp) {
  // console.log(req.query);
  var dataAry = [req.query.txtemail, req.query.pwd, req.query.utype, 1];
  refdb.query(
    "insert into users values(?,?,?,?)",
    dataAry,
    function (err, result) {
      if (err) resp.send(err);
      else {
        resp.send("inserted successfully");
        console.log("Saved..");
      }
    }
  );
});
app.get("/chklogin", function (req, resp) {
  var ary = [req.query.txtemail, req.query.txtpass];
  console.log(ary);
  refdb.query(
    "select * from users where email=? and pwd=? and status=1",
    ary,
    function (err, result) {
      if (err) resp.send(err);
      else resp.send(result);
    }
  );
});
app.get("/update", function (req, resp) {
  var ary = [req.query.txtemail, req.query.pwd];
  var ary2 = [req.query.newpwd, req.query.txtemail];
  refdb.query(
    "select * from users where email=? and pwd=?",
    ary,
    function (err, result) {
      if (err) resp.send(err);
      else if (result.length == 1) {
        refdb.query(
          "update users set pwd=? where email=?",
          ary2,
          function (err, result) {
            if (err) {
              resp.send(err);
            } else {
              resp.send("Password updated successfully");
            }
          }
        );
      } else resp.send("Invalid old password");
    }
  );
});
app.use(expressKuch.urlencoded("extended:true"));
app.use(fileuploader());
app.post("/profile-process", function (req, resp) {
  // var pary=[req.body.txtEmail,req.body.txtname,req.body.txtmobile,req.body.txtAddr,req.body.city,req.body.idproof,req.body.time,fname,fname2];
  console.log(req.files.profilePic.name);

  var fname = req.body.txtEmail + "-" + req.files.profilePic.name;
  var des = process.cwd() + "/public/uploads/" + fname;
  req.files.profilePic.mv(des, function (err) {
    if (err) console.log(err);
    else console.log("Badhaiiiiiiii");
  });
  console.log(req.files.idfile.name);

  var fname2 = req.body.txtEmail + "-" + req.files.idfile.name;
  var des = process.cwd() + "/public/uploads/" + fname2;
  req.files.idfile.mv(des, function (err) {
    if (err) console.log(err);
    else console.log("Badhaiiiiiiii");
  });
  var pary = [
    req.body.txtEmail,
    req.body.txtname,
    req.body.txtmobile,
    req.body.txtAddr,
    req.body.city,
    req.body.idproof,
    req.body.time,
    fname,
    fname2,
  ];
  refdb.query(
    "insert into dprofile values(?,?,?,?,?,?,?,?,?)",
    pary,
    function (err, result) {
      if (err) resp.send(err);
      else {
        resp.send("inserted successfully");
        console.log("Saved..");
      }
    }
  );
});
app.get("/getProfileObject", function (req, resp) {
  //0/1 records
  refdb.query(
    "select * from dprofile where email=?",
    [req.query.txtEmail],
    function (err, resultAryOfObjects) {
      if (err) resp.send(err);
      else resp.send(resultAryOfObjects);
    }
  );
});
app.post("/profile-update", function (req, resp) {
  var fname;
  if (req.files != null) {
    fname = req.body.txtEmail + "-" + req.files.profilePic.name;
    var des = process.cwd() + "/public/uploads/" + fname;
    req.files.profilePic.mv(des, function (err) {
      if (err) console.log(err);
      else console.log("Done");
    });
  } else fname = req.body.hdn;
  var fname2;
  if (req.files != null) {
    fname2 = req.body.txtEmail + "-" + req.files.idfile.name;
    var des = process.cwd() + "/public/uploads/" + fname2;
    req.files.idfile.mv(des, function (err) {
      if (err) console.log(err);
      else console.log("Done");
    });
  } else fname2 = req.body.ndn;

  var pary = [
    req.body.txtname,
    req.body.txtmobile,
    req.body.txtAddr,
    req.body.city,
    req.body.idproof,
    req.body.time,
    fname2,
    fname,
    req.body.txtEmail,
  ];
  refdb.query(
    "update dprofile set name=?,mobile=?,address=?,city=?,prooftype=?,timings=?,proofpic=?,profilepic=? where email=?",
    pary,
    function (err, result) {
      if (err) resp.send(err);
      else resp.send("Updated Successfully");
    }
  );
});
