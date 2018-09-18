// Controller for Chat Actions
var ChatController = (Model) => {
  this.model = Model;

  this.init = () => {
    // Assign elements
    this.messageEl = $('#message');
    this.usernameEl = $(`#${this.model.elements.chat.username}`);
    this.btnSendMessage = $('#btnSendMessage');
    this.btnUpdateUsername = $('#btnUpdateUsername')
    this.chatroom = $('#chatroom');
    this.feedback = $('#feedback');
    this.usersTotal = $('#usersTotal');
    // Store local values
    this.username = this.model.settings.username;
    // Setup initial username
    socket.emit('update_username', { username });
    this.usernameEl.val(username);
    // Bind chat and messaging events
    this.bindEvents();
  }

  this.bindEvents = () => {
    this.btnUpdateUsername.on('click', jQuery.proxy(this, 'updateUsername'));
    this.btnSendMessage.on('click', jQuery.proxy(this, 'sendMessage'));
    this.usernameEl.on("keypress", (e) => {
      if (e && e.keyCode == 13) {
        this.btnUpdateUsername.click();
      }
    });
    this.messageEl.on("keypress", (e) => {
      socket.emit('typing');
      if (e && e.keyCode == 13) {
        this.btnSendMessage.click();
      }
    });
    //Listen on new_message
    socket.on("new_message", (data) => {
      this.feedback.html('');
      this.messageEl.val('');
      this.chatroom.append(`<p class="message" style="background-color: ${data.color}" ><span class="user">${data.username}</span>: ${data.message}</p>`)
    })

    //Listen on typing
    socket.on('typing', (data) => {
      feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
    })

    //Listen on users total
    socket.on('users_online', (data) => {
      this.usersTotal.html(data.total);
    })
  };

  this.sendMessage = (e) => {
    e.preventDefault();
    var msgContent = this.messageEl.val();
    // Validate
    if (msgContent === '') {
      notifier.warning('Please enter a message to send to other users!');
    } else {
      notifier.success('Message sent!');
      socket.emit('new_message', { message: this.messageEl.val() })
    };
  }

  this.updateUsername = (e) => {
    e.preventDefault();
    var newUsername = this.usernameEl.val();
    // Validate
    if (newUsername === this.username) {
      notifier.warning(`Please enter a new username to change it!`);
    } else {
      socket.emit('update_username', { username: this.usernameEl.val() });
      notifier.success('Username updated!');
      this.username = this.usernameEl.val();
    }

  }

  this.init();
};