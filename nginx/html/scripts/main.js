$(document).ready(function () {

  var instanceId;

  var eventSource = $.extend(new EventSource('/streams/users/connected'), {
    onmessage: function(e) {
      if (instanceId) {
        $('#usersCount').text(e.data);
      } else {
        instanceId = e.data;
        $('#instanceId').text(e.data);
      }
    },
    onerror: function(e) {
      console.log("Stream connection error.");
    }
  });

});