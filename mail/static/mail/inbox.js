document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archived'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#send_email').addEventListener('click', function(event) {send_email(); event.preventDefault();});
  //document.querySelector('#email').addEventListener('click', view_email);
  

  // By default, load the inbox
  load_mailbox('inbox');
});

function view_email(id) {
  document.querySelector('#get-email-view').value = '';

  fetch('/emails/'+`${id}`, { 
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })


  fetch('/emails/'+`${id}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);

    var element = document.getElementById("get-email-view");
    element.innerHTML = "";

    var mainContainer = document.getElementById("get-email-view");
      var div = document.createElement("div");
      div.setAttribute("id", "email");
      div.setAttribute("id_of_email", email.id);
      var p1 = document.createElement("p");
      p1.innerHTML = 'From: ' + email.sender;
      mainContainer.appendChild(p1);
      //div.innerHTML += ' '

      var p2 = document.createElement("p");
      p2.innerHTML = 'To: ' + email.recipients;
      mainContainer.appendChild(p2);

      var p3 = document.createElement("p");
      p3.innerHTML = 'Subject: ' + email.subject;
      mainContainer.appendChild(p3);

      var p4 = document.createElement("p");
      p4.innerHTML = 'Timestamp: ' + email.timestamp;
      mainContainer.appendChild(p4);

var reply_button = document.createElement("button");
reply_button.innerHTML = "Reply";
reply_button.setAttribute("class", "btn btn-sm btn-outline-primary")
reply_button.addEventListener('click', function(){reply_email(email)});
mainContainer.appendChild(reply_button);

var archive_button = document.createElement("button");
if (email.archived == false){
archive_button.innerHTML = "Archive";
}
else if (email.archived == true){
  archive_button.innerHTML = "Unarchive";
}

archive_button.setAttribute("class", "btn btn-sm btn-outline-primary")
archive_button.addEventListener('click', function(){archive_email(email)});
mainContainer.appendChild(archive_button);

      var hr = document.createElement("hr");
      mainContainer.appendChild(hr);

      var content = document.createElement("p");
      content.innerHTML = email.body;
      mainContainer.appendChild(content);


      mainContainer.appendChild(div);


  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#get-email-view').style.display = 'block';
  console.log(id)
})
}

function archive_email(email){
  console.log(email.id)

if (email.archived == false){

  fetch('/emails/'+`${email.id}`, { 
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  .then(result => {
    load_mailbox('inbox');
    })

}
else if (email.archived == true){
  fetch('/emails/'+`${email.id}`, { 
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  .then(result => {
  load_mailbox('inbox');
  })
}


}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#get-email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function reply_email(email){
   // Show compose view and hide other views
   document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#compose-view').style.display = 'block';
   document.querySelector('#get-email-view').style.display = 'none';
 
   // Clear out composition fields
   document.querySelector('#compose-recipients').value = email.sender;

   if(email.subject.substring(0,3) == 'Re:'){
    document.querySelector('#compose-subject').value = 'Re: ' + email.subject.substring(4);
   }
   else{
   document.querySelector('#compose-subject').value = 'Re: ' + email.subject;
   }
   document.querySelector('#compose-body').value = 'On ' + email.timestamp + " " + email.sender + " wrote: " + email.body;
}

function send_email() {


  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value,
        read: false
    })
  })
  //.then(response => response.json())
  .then(result => {
      // Print result
      load_mailbox('sent');
      //console.log(result);
  })
  
}

function load_mailbox(mailbox) {
  console.log(mailbox)
if (mailbox == 'inbox'){

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#get-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
    //appendData(data);
      // Print emails
      console.log(emails);    

      var mainContainer = document.getElementById("emails-view");
      for (var i = 0; i < emails.length; i++) {
        if(emails[i].archived == false){
        var div = document.createElement("div");
        div.setAttribute("id", "email");
        div.setAttribute("id_of_email", emails[i].id);
        div.addEventListener('click', function(){view_email(this.getAttribute('id_of_email'))});
        div.style.border = '1px black solid';
        div.style.padding = '5px';
        div.style.marginBottom = '5px';
        if(emails[i].read == true){
          div.style.backgroundColor = 'lightgray'
        }
        else if(emails[i].read == false){
          div.style.backgroundColor = 'white'
        }

        div.innerHTML = emails[i].sender;
        div.innerHTML += ' '
        div.innerHTML += emails[i].subject;
        div.innerHTML += ' '
        div.innerHTML += emails[i].timestamp;
      
        mainContainer.appendChild(div);
      }
    }
  })
  .catch(function (err) {
    console.log(err);
  });

}

else if (mailbox == 'archived'){

  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#get-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  console.log("asd")

  fetch('/emails/archive')
.then(response => response.json())
.then(emails => {
    // Print emails
    console.log(emails);
    var mainContainer = document.getElementById("emails-view");
    for (var i = 0; i < emails.length; i++) {
      if(emails[i].archived == true){
      var div = document.createElement("div");
      div.setAttribute("id", "email");
      div.setAttribute("id_of_email", emails[i].id);
      div.addEventListener('click', function(){view_email(this.getAttribute('id_of_email'))});
      div.style.border = '1px black solid';
      div.style.padding = '5px';
      div.style.marginBottom = '5px';
      if(emails[i].read == true){
        div.style.backgroundColor = 'lightgray'
      }
      else if(emails[i].read == false){
        div.style.backgroundColor = 'white'
      }
      
      div.innerHTML = emails[i].sender;
      div.innerHTML += ' '
      div.innerHTML += emails[i].subject;
      div.innerHTML += ' '
      div.innerHTML += emails[i].timestamp;
    
      mainContainer.appendChild(div);
    // ... do something else with emails ...
      }
    }
});

}

else if (mailbox == 'sent'){

  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#get-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  console.log("asd")

  fetch('/emails/sent')
.then(response => response.json())
.then(emails => {
    // Print emails
    console.log(emails);
    var mainContainer = document.getElementById("emails-view");
    for (var i = 0; i < emails.length; i++) {
     // if(emails[i].archived == false){
      var div = document.createElement("div");
      div.setAttribute("id", "email");
      div.setAttribute("id_of_email", emails[i].id);
      div.addEventListener('click', function(){view_email(this.getAttribute('id_of_email'))});
      div.style.border = '1px black solid';
      div.style.padding = '5px';
      div.style.marginBottom = '5px';
      if(emails[i].read == true){
        div.style.backgroundColor = 'lightgray'
      }
      else if(emails[i].read == false){
        div.style.backgroundColor = 'white'
      }
      
      div.innerHTML = emails[i].sender;
      div.innerHTML += ' '
      div.innerHTML += emails[i].subject;
      div.innerHTML += ' '
      div.innerHTML += emails[i].timestamp;
    
      mainContainer.appendChild(div);
    // ... do something else with emails ...
    //  }
    }
});

}


}