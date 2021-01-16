(function() {

  const serverUrl = 'http://127.0.0.1:3000';
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const getMove = '/getmove';
  const getBackground = '/getbackground';

  //
  // TODO: build the swim command fetcher here
  //
  // const fetchtheMove =
  // const fetchtheMove = axios.get(`${serverUrl}${getMove}`)
  //   .then(response => console.log(response));

  const fetchtheMove = () => axios.get(`${serverUrl}${getMove}`)
    .then(data => data.data)
    .then(move => SwimTeam.move(move.move));

  const fetchBackground = () => axios.get(`${serverUrl}${getBackground}`)
    .then(data => data.data)
    .then(response => {
      // var image = new Image();
      $('.pool').css('background-image', `url("data:image/png;base64,${response.image}")`);
    });



  fetchBackground();

  // fetch(`${serverUrl}${getMove}`)
  //   .then(response => response)
  //   .then(result => console.log(result));
  // fetchtheMove()

  setInterval(fetchtheMove, 3000)

  const socket = io.connect('http://127.0.0.1:3000');
  socket.on('ghostmove', (data) => {
    const move = JSON.parse(data);
    SwimTeam.move(move.move);
  });

  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: 'http://127.0.0.1:3000/sendbackground',
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    // e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });

})();
