var config = {
  apiKey: "AIzaSyD2Wnowm8wVdau0Y3jc1955oPBSD70Bed8",
  authDomain: "oxopubgm.firebaseapp.com",
  databaseURL: "https://oxopubgm.firebaseio.com",
  projectId: "oxopubgm",
  storageBucket: "oxopubgm.appspot.com",
  messagingSenderId: "403185558244"
};
firebase.initializeApp(config);

//create firebase database reference
var dbRef = firebase.database();
var membersRef = dbRef.ref('members');

function validate(ign, name, hpno) {
  var result = true;
  if (!ign) {
    result = false;
  }
  if (!name) {
    result = false;
  }
  if (!hpno) {
    result = false;
  }

  return result
}

function clearForms() {
  $("#txtIgn").val("");
  $("#txtHpNo").val("");
  $("#txtName").val("");
}

$(document).ready(function () {
  $("#btnEditInfo").click(function () {
    alert('amaa...blm bulih bussku.inform di wsap group ja dlu');
  });

  $("#btnAdd").click(function (e) {
    e.preventDefault();
    $("#addModal").show();

  });

  $("#tabs").tabs();

  $("#btnSave").click(function (e) {
    e.preventDefault();
    var validateOK = validate($("#txtIgn").val(), $("#txtHpNo").val(), $("#txtName").val())
    if (validateOK) {
      e.preventDefault();
      var data = {
        ign: $("#txtIgn").val().replace(/<[^>]*>/ig, ""),
        hpno: $("#txtHpNo").val().replace(/<[^>]*>/ig, ""),
        name: $("#txtName").val().replace(/<[^>]*>/ig, ""),
        role: $("#slctRole").val(),
      }

      membersRef.push({
        ign: data.ign,
        hpno: data.hpno,
        name: data.name,
        role: data.role,
        fbid: "",
        fblink: ""
      }, function (err) {
        if (err) {
          alert('amaaa...sorry busku, ada mashalah database skit..')
        } else {
          alert('nicee..suda diadd bussku..');
          clearForms();
          $("#addModal").hide();
        }
      });

    } else {
      alert('Kasi lengkap anjir!');
    }
  })

  $("#btnCancel").click(function (e) {
    e.preventDefault();
    clearForms();
    $("#addModal").hide();
  });
});