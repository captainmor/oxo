var config = {
  apiKey: "AIzaSyD2Wnowm8wVdau0Y3jc1955oPBSD70Bed8",
  authDomain: "oxopubgm.firebaseapp.com",
  databaseURL: "https://oxopubgm.firebaseio.com",
  projectId: "oxopubgm",
  storageBucket: "oxopubgm.appspot.com",
  messagingSenderId: "403185558244"
};
firebase.initializeApp(config);
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var users = [];

//create firebase database reference
var dbRef = firebase.database();
var membersRef = dbRef.ref('members');
var logRef = dbRef.ref('logs');

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

function getUiConfig() {
  return {
    'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccess': function (user, credential, redirectUrl) {
        handleSignedInUser(user);
        // Do not redirect.
        return false;
      }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
      // The Provider you need for your app. We need the Phone Auth
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        defaultCountry: 'MY',
        recaptchaParameters: {
          //size: getRecaptchaMode()
          type: 'image',
          size: 'invisible',
          badge: 'bottomleft'
        }
      }
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com'
  };
}

function handleSignedInUser(user) {
  //check display name
  if (user != null) {
    if (user.displayName) {
      showSignedInUser();
      $("#verifyPhoneModal").hide();
    } else {
      $("#firebaseui-container").hide();
      $("#updateDisplayName").show();
      $("#btnUpdateDispName").show();
    }
  }
}

function showSignedInUser() {
  var user = firebase.auth().currentUser;
  $("#displayName").text(user.displayName);
  $("#signedInSection").show();
}

function handleSignedOutUser() {
  $("#verifyPhoneModal").show();
  ui.start('#firebaseui-container', getUiConfig());
}

function signOut() {
  firebase.auth().signOut();
  $("#signedInSection").hide();
}

function load() {
  var membersRef = firebase.database().ref("members");
  membersRef.on("child_added", function (data, prevChildkey) {
    var member = data.val();
    //append table
    users.push(member);
    var no = "<td>" + (users.length) + "</td>";
    var ign = "<td>" + member.ign + "</td>";
    var hpNo = "<td>" + member.hpno + "</td>";
    var name = "<td>" + member.name + "</td>";
    var role = "<td>" + member.role + "</td>";

    var markup = "<tr>" + no + ign + hpNo + name + role + "</tr>";
    console.log(member);
    $("#memberListTable tbody").append(markup);
  });
}

function setLog(user, act, dtime) {
  var data = {
    user: user.displayName,
    userHpNo: user.phoneNumber,
    activity: act,
    dateTime: dtime,
  }

  logRef.push({
    user: data.user,
    userHpNo: data.userHpNo,
    activity: data.activity,
    dateTime: data.dateTime
  }, function (err) {
    if (err) {
      alert('amaaa...sorry busku, ada mashalah database skit..')
    } else {
      alert('nicee..suda diadd bussku..');
      clearForms();
      $("#addModal").hide();
    }
  });
}

$(document).ready(function () {

  //load data
  load();

  $("#btnLogOut").click(function () {
    signOut();
  });

  $("#btnUpdateDispName").click(function () {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: $("#txtDisplayName").val()
    }).then(function () {
      showSignedInUser();
      $("#verifyPhoneModal").hide();
    }).catch(function (error) {
      alert(error);
    });
  });

  $("#btnEditInfo").click(function () {
    var user = firebase.auth().currentUser;
    if (user) {
      handleSignedInUser(user)
    } else {
      handleSignedOutUser();
    }
  });
});

$("#btnAdd").click(function (e) {
  e.preventDefault();
  var user = firebase.auth().currentUser;
  if (user) {
    handleSignedInUser(user);
    $("#addModal").show();
  } else {
    handleSignedOutUser();
    $("#addModal").show();
  }

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
        var usr = firebase.auth().currentUser;
        var now = new Date();
        setLog(usr, 'added new member', now.toString());
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

$("#btnClose").click(function (e) {
  e.preventDefault();
  $("#verifyPhoneModal").hide();
});