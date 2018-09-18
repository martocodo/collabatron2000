// Controller for Drawing Actions
DrawingController = (Model) => {
  this.model = Model;
  this.init = () => {
    // Keep track of mouse
    this.mouse = {
      click: false,
      move: false,
      pos: { x: 0, y: 0 },
      pos_prev: false
    }
    // Setup control of the canvas
    this.sidebar = document.getElementById('sidebar');
    this.toolbar = document.getElementById('toolbar');
    var canvas = document.getElementById('drawing');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.bindEvents();
  }

  this.toggleMouseTrue = () => {
    this.mouse.click = true;
  }

  this.toggleMouseFalse = () => {
    this.mouse.click = false;
  }

  this.trackMouseMovement = (e) => {
    // Keep track of mouse position as line is drawn
    var relativeWidth = this.width - sidebar.getAttribute('width');
    var relativeHeight = this.height - toolbar.getAttribute('height');
    // Touchscreen devices
    if (e.changedTouches) {
      mouse.pos.x = (e.changedTouches[0].pageX / relativeWidth);
      mouse.pos.y = (e.changedTouches[0].pageY / relativeHeight);
      // Desktop devices
    } else {
      mouse.pos.x = e.offsetX / relativeWidth;
      mouse.pos.y = e.offsetY / relativeHeight;
    }
    mouse.move = true;
  }

  this.drawCanvasLine = (data) => {
    var relativeWidth = this.width - this.sidebar.getAttribute('width');
    var relativeHeight = this.height - this.toolbar.getAttribute('height');
    var line = data.line;
    var canvas = document.getElementById('drawing');
    var context = canvas.getContext('2d');
    context.strokeStyle = data.color;
    context.beginPath();
    context.lineWidth = data.size;
    context.moveTo(line[0].x * relativeWidth, line[0].y * relativeHeight);
    context.lineTo(line[1].x * relativeWidth, line[1].y * relativeHeight);
    context.stroke();
  }

  this.mainLoop = () => {
    // Check for drawing
    if (this.mouse.click && this.mouse.move && this.mouse.pos_prev) {
      // Send Line to server
      socket.emit('draw_line', {
        line: [this.mouse.pos, this.mouse.pos_prev],
        color: this.model.settings.color,
        size: this.model.settings.size
      });
      this.mouse.move = false;
    }
    this.mouse.pos_prev = { x: this.mouse.pos.x, y: this.mouse.pos.y };
    setTimeout(this.mainLoop, 25);
  }

  this.bindEvents = () => {
    var relThis = this;
    // Listen for toolbar changes
    $(`#${this.model.elements.toolbar.size}`).on('change', jQuery.proxy(this, "updateDrawSize"));
    $(`#${this.model.elements.toolbar.clear}`).on('click', (e) => {
      e.preventDefault();
      socket.emit('reset_lines');
    });
    // Listen for mouse events
    var canvas = document.getElementById('drawing');
    canvas.onmousedown = ((e) => {
      this.mouse.click = true;
    });
    canvas.onmouseup = ((e) => {
      this.mouse.click = false;
    });
    canvas.onmousemove = ((e) => {
      this.trackMouseMovement(e)
    });
    // Listen for touch events
    canvas.ontouchstart = ((e) => {
      this.mouse.click = true;
    });
    canvas.ontouchend = ((e) => {
      this.mouse.click = false;
    });
    canvas.ontouchmove = ((e) => {
      this.trackMouseMovement(e)
    });
    // Listen for socket events
    this.socket.on('draw_line', jQuery.proxy(this, 'drawCanvasLine'));
    this.socket.on('reset_lines', jQuery.proxy(this, 'resetDrawing'));
    // Loop to check movement
    this.mainLoop();
    // Setup tools
    const pickr = new Pickr({
      el: '#colorPicker',

      default: this.model.settings.color,

      components: {

        preview: true,
        opacity: true,
        hue: true,

        interaction: {
          hex: true,
          rgba: true,
          hsva: true,
          input: true,
          clear: true,
          save: true
        }
      },
      // User has changed the color
      onChange(hsva, instance) {
        var color = hsva.toRGBA().toString();
        relThis.updateDrawColor(color);
      },

      // User has clicked the save button
      onSave(hsva, instance) {
        // same as onChange
        var color = hsva.toRGBA().toString();
        relThis.updateDrawColor(color);
      }
    });
  };

  this.resetDrawing = (e) => {
    var canvas = document.getElementById('drawing');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  this.updateDrawSize = (e) => {
    this.model.settings.size = e.target.value;
  };

  this.updateDrawColor = (color) => {
    this.model.settings.color = color
  }

  this.init();
};
