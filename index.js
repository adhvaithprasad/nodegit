var admin = require("firebase-admin");
const { exec } = require('child_process');
var serviceAccount = require("./tribble-66bad-firebase-adminsdk-5tfkm-314c455c50.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tribble-66bad-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "gs://tribble-66bad.appspot.com"
});
var Git = require("nodegit");
const { getDatabase } = require('firebase-admin/database');

const db = getDatabase();
var ref = db.ref('/');

let type = 'http';

process.argv.slice(2).forEach((arg) => {
  switch (arg) {
    case 'https':
    case '--https':
      type = 'https';
      break;
  }
});

const fs = require('fs');
const path = require('path');

const glob = require("glob");
var getDirectories = function (src, callback) {
  glob(src + '/**/*', callback);
};
const Server = require('node-git-server');

const port = process.env.PORT || 7005;

const repos = new Server(path.normalize(path.resolve(__dirname, 'tmp')), {
  autoCreate: true,
  authenticate: ({ type, repo, user, headers }, next) => {
    if (type == 'push') {
      user((username, password) => {
        if (username === '42' && password === '42') {
          next();
        } else {
          next('wrong password');
        }
      });
    } else {
      next();
    }
  }
});

repos.on('push', (push) => {


  push.accept();
  var m = push.repo;

console.log(push)

  var clone_link = "https://g.adhvaithprasad.repl.co/"+push.repo;
Git.Clone(clone_link , "./repos")
.then(function recursive(){

var folder = "./repos";

getDirectories(folder, function (err, res) {
  if (err) {
    console.log('Error', err);
  } else {

    res.forEach(element =>{

    function isDir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

var mnk= isDir(element);
if (mnk === true ){
  // falsy
 
}
else{

  function replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}
  var kElement = replaceAll(element,"./repos",push.repo)
  var mElement = replaceAll(kElement,".","--dot--");
  var filepath = fs.readFileSync(element);
  var filevalue = filepath.toString()
  ref.child("storage").child(mElement).set({
    value: filevalue
  });

}
     
    })

  }
});

})
.then(function info(){
 var commit = push.commit;
  var username = push.username;
  var repo = push.repo;
  var branch = push.branch;
ref.child("repo-info").child(repo).set({
user:username,
commit:commit,
branch:branch
});



})



.catch(err => {
    console.error(err);
  });




});



repos.on('fetch', (fetch) => {
  fetch.accept();
});

repos.listen(port, {
  type,
  key: fs.readFileSync(path.resolve(__dirname, 'privatekey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'certificate.pem'))
}, (error) => {
  if (error) return console.error(`failed to start git-server because of error ${error}`);

});